import { useEffect, useRef, useState } from "react";
import { useWindowSize } from "react-use";

export type SnowCanvasProps = {};

export class Snowflake {
  x: number;
  y: number;
  xVelocity: number;
  yVelocity: number;
  radius: number;

  constructor(canvasWidth: number, canvasHeight: number) {
    const radius = Math.random() * (Math.max(canvasWidth, canvasHeight) * 0.005) + 2;

    this.x = Snowflake.randomXPosition(canvasWidth);
    this.y = Snowflake.randomYPosition(canvasHeight);
    this.xVelocity = Snowflake.randomVelocity(canvasWidth, canvasHeight, radius, true);
    this.yVelocity = Snowflake.randomVelocity(canvasWidth, canvasHeight, radius, false);
    this.radius = radius;
  }

  private static randomXPosition(canvasWidth: number): number {
    return Math.random() * canvasWidth;
  }

  private static randomYPosition(canvasHeight: number): number {
    return Math.random() * canvasHeight;
  }

  private static randomVelocity(
    canvasWidth: number,
    canvasHeight: number,
    radius: number,
    allowNegativeDirection: boolean,
  ): number {
    return (
      Math.random() *
      Math.max(canvasWidth, canvasHeight) *
      (radius / 10) *
      (1 / 500) *
      (allowNegativeDirection ? Math.random() - 0.5 : 1)
    );
  }

  setRandomPosition(canvasWidth: number): void {
    this.x = Snowflake.randomXPosition(canvasWidth);
    this.y = -this.radius;
  }

  update(canvasWidth: number, canvasHeight: number): void {
    const snowflakeIsOutOfHorizontalBounds =
      this.x + this.radius < 0 || this.x - this.radius > canvasWidth;
    const snowflakeIsOutOfVerticalBounds = this.y - this.radius * 2 > canvasHeight;

    if (snowflakeIsOutOfHorizontalBounds || snowflakeIsOutOfVerticalBounds) {
      this.setRandomPosition(canvasWidth);
    } else {
      this.move();
    }
  }

  move(): void {
    this.x += this.xVelocity;
    this.y += this.yVelocity;
  }

  draw(context: CanvasRenderingContext2D): void {
    context.fillStyle = "rgba(255, 255, 255, 0.7)";
    context.beginPath();
    context.ellipse(this.x, this.y, this.radius, this.radius, 0, 0, 2 * Math.PI);
    context.fill();
  }
}

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
  const NUMBER_OF_SNOWFLAKES = 200;

  const [windowWidth, setWindowWidth] = useState<number>();
  const [windowHeight, setWindowHeight] = useState<number>();
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
      for (let i = 0; i < NUMBER_OF_SNOWFLAKES; i += 1) {
        snowflakes.current.push(new Snowflake(windowWidth, windowHeight));
      }
    }

    context.current = ctx;

    tick(context.current, windowWidth, windowHeight, snowflakes.current);
  }, [windowHeight, windowWidth]);

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
