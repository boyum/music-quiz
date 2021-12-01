import { useEffect, useRef, useState } from "react";
import { Snowflake } from "../../types/Snowflake";

export type SnowCanvasProps = {};

const update = (canvasWidth: number, canvasHeight: number, snowflakes: Array<Snowflake>): void => {
  for (const snowflake of snowflakes) {
    snowflake.update(canvasWidth, canvasHeight);
  }
};

const draw = (context: CanvasRenderingContext2D, snowflakes: Array<Snowflake>): void => {
  for (const snowflake of snowflakes) {
    snowflake.draw(context);
  }
};

const tick = (
  context: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  snowflakes: Array<Snowflake>,
): void => {
  context.clearRect(0, 0, canvasWidth, canvasHeight);
  update(canvasWidth, canvasHeight, snowflakes);
  draw(context, snowflakes);

  window.requestAnimationFrame(() => tick(context, canvasWidth, canvasHeight, snowflakes));
};

export const SnowCanvas: React.FC<SnowCanvasProps> = ({}) => {
  const [windowWidth, setWindowWidth] = useState<number>();
  const [windowHeight, setWindowHeight] = useState<number>();
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const canvas = useRef<HTMLCanvasElement>(null);

  const snowflakes = useRef<Array<Snowflake>>([]);
  const context = useRef<CanvasRenderingContext2D>();

  useEffect(() => {
    if (!canvas.current) {
      return;
    }

    if (!windowWidth || !windowHeight) {
      return;
    }

    const ctx = canvas.current.getContext("2d");
    if (!ctx) {
      throw new Error("Failed  to get canvas context");
    }

    const noSnowflakes = snowflakes.current.length === 0;
    if (noSnowflakes) {
      const NUMBER_OF_SNOWFLAKES = Math.min(windowWidth, windowHeight) / 3;
      for (let i = 0; i < NUMBER_OF_SNOWFLAKES; i += 1) {
        snowflakes.current.push(new Snowflake(windowWidth, windowHeight));
      }
    }

    context.current = ctx;

    if (!isRunning) {
      tick(context.current, windowWidth, windowHeight, snowflakes.current);
      setIsRunning(true);
    }
  }, [isRunning, windowHeight, windowWidth]);

  useEffect(() => {
    const resize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };

    resize();

    window.addEventListener("resize", resize);
  }, []);

  return (
    <canvas
      suppressHydrationWarning
      className="fixed z-0 inset-0 pointer-events-none"
      ref={canvas}
      width={windowWidth}
      height={windowHeight}
    />
  );
};
