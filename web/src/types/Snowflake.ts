export class Snowflake {
  x: number;
  y: number;
  xVelocity: number;
  yVelocity: number;
  radius: number;
  color: `rgba(${number}, ${number}, ${number}, ${number})`;

  constructor(canvasWidth: number, canvasHeight: number) {
    const radius = Math.random() * (Math.max(canvasWidth, canvasHeight) * 0.0025) + 3;

    this.x = Snowflake.randomXPosition(canvasWidth);
    this.y = Snowflake.randomYPosition(canvasHeight);
    this.xVelocity = Snowflake.randomVelocity(canvasWidth, canvasHeight, radius, true);
    this.yVelocity = Snowflake.randomVelocity(canvasWidth, canvasHeight, radius, false);
    this.radius = radius;

    const alphaValue = Math.random() * 0.5 + 0.3;
    this.color = `rgba(255, 255, 255, ${alphaValue})`;
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
    context.fillStyle = this.color;
    context.beginPath();
    context.ellipse(this.x, this.y, this.radius, this.radius, 0, 0, 2 * Math.PI);
    context.fill();
  }
}
