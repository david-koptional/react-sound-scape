import { ShapeType, Shape } from "../Shape/Shape";

export function Square(
  x: number,
  y: number,
  velocity: number,
  direction: number,
  size: number,
  color: string,
  ctx: CanvasRenderingContext2D,
  movementPatterns: ((shape: ShapeType) => ShapeType)[]
): ShapeType {
  const shape = Shape(x, y, velocity, direction, size, color, ctx, movementPatterns);

  return {
    ...shape,
    draw: function () {
      this.ctx.beginPath();
      this.ctx.rect(this.x, this.y, this.size, this.size);
      this.ctx.fillStyle = this.color;
      this.ctx.fill();
    },
  };
}
