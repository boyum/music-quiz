export class Snowflake {
  x: number;
  y: number;
  originalXVelocity: number;
  originalYVelocity: number;
  xVelocity: number;
  yVelocity: number;
  radius: number;
  color: `rgba(${number}, ${number}, ${number}, ${number})`;
  alpha: number;
  dAlpha: number;

  constructor(canvasWidth: number, canvasHeight: number) {
    const radius = Math.random() * (Math.max(canvasWidth, canvasHeight) * 0.0025) + 3;

    this.x = Snowflake.randomXPosition(canvasWidth);
    this.y = Snowflake.randomYPosition(canvasHeight);
    this.originalXVelocity = Snowflake.randomVelocity(canvasWidth, canvasHeight, radius, true);
    this.xVelocity = this.originalXVelocity;
    this.originalYVelocity = Snowflake.randomVelocity(canvasWidth, canvasHeight, radius, false);
    this.yVelocity = this.originalYVelocity;
    this.radius = radius;

    const alphaValue = Snowflake.randomAlphaValue();
    this.alpha = alphaValue;
    this.dAlpha = 0;
    this.color = `rgba(255, 255, 255, ${alphaValue})`;
  }

  private static randomXPosition(canvasWidth: number): number {
    return Math.random() * canvasWidth;
  }

  private static randomYPosition(canvasHeight: number): number {
    return Math.random() * canvasHeight;
  }

  private static randomAlphaValue(): number {
    return Math.random() * 0.5 + 0.3;
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
    const stopProbability = 0.1;
    const shouldStop =
      Math.random() < stopProbability &&
      this.y > canvasHeight - (this.radius * Math.random() * 0.5 + 0.5);
    if (shouldStop) {
      this.xVelocity = 0;
      this.yVelocity = 0;

      const meltingFactor = 0.01;
      this.dAlpha = -meltingFactor;

      this.alpha += this.dAlpha;
      this.color = `rgba(255, 255, 255, ${this.alpha})`;
    }

    const snowflakeIsOutOfHorizontalBounds =
      this.x + this.radius < 0 || this.x - this.radius > canvasWidth;
    const snowflakeIsOutOfVerticalBounds = this.y - this.radius * 2 > canvasHeight;
    const isInvisible = this.alpha <= 0;

    if (snowflakeIsOutOfHorizontalBounds || snowflakeIsOutOfVerticalBounds) {
      this.setRandomPosition(canvasWidth);
    } else if (isInvisible) {
      this.setRandomPosition(canvasWidth);
      this.dAlpha = 0;
      this.alpha = Snowflake.randomAlphaValue();
      this.xVelocity = this.originalXVelocity;
      this.yVelocity = this.originalYVelocity;
    } else {
      this.move();
    }
  }

  move(): void {
    this.x += this.xVelocity;
    this.y += this.yVelocity;
  }

  draw(context: CanvasRenderingContext2D): void {
    context.fillStyle = this.color;
    context.beginPath();
    context.ellipse(this.x, this.y, this.radius, this.radius, 0, 0, 2 * Math.PI);
    context.fill();
  }
}
