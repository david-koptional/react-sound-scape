export type ShapeType = {
  x: number;
  y: number;
  size: number;
  color: string;
  velocity: number;
  direction: number;
  ctx: CanvasRenderingContext2D;
  movementPattern: (shape: ShapeType) => ShapeType;
  draw: () => void;
  wrappedDraw: () => void;
  update: () => void;
  scaleSizeWithBass: (bassFrequency: number) => void;
  keepWithinBounds: (bounds: { width: number; height: number }) => void;
  changeMovementPatternsWithTheBeat: (beat: boolean) => void;
  rotate: (angle: number) => void;
  globalAlpha: number;
  shadow: {
    color: string;
    blur: number;
    offsetX: number;
    offsetY: number;
  };
};

export function Shape(
  x: number,
  y: number,
  velocity: number,
  direction: number,
  size: number,
  color: string,
  ctx: CanvasRenderingContext2D,
  movementPatterns: ((shape: ShapeType) => ShapeType)[]
): ShapeType {
  const movementPattern = movementPatterns[0];
  let beatCount = 0;

  const originalSize = size;

  return {
    x,
    y,
    size,
    color,
    ctx,
    velocity,
    direction,
    movementPattern,
    globalAlpha: 1.0, // Default alpha value
    shadow: {
      color: "rgba(0, 0, 0, 0.5)", // Default shadow color
      blur: 10,
      offsetX: 5,
      offsetY: 5,
    },
    draw: function () {
      // Implement the draw method
    },
    update: function () {
      const updatedShape = this.movementPattern(this);
      this.x = updatedShape.x;
      this.y = updatedShape.y;
    },
    wrappedDraw: function () {
      this.ctx.save(); // Save the current context state

      // Apply global alpha and shadow settings
      this.ctx.globalAlpha = this.globalAlpha;
      this.ctx.shadowColor = this.shadow.color;
      this.ctx.shadowBlur = this.shadow.blur;
      this.ctx.shadowOffsetX = this.shadow.offsetX;
      this.ctx.shadowOffsetY = this.shadow.offsetY;

      // Call the specific shape's draw method
      this.draw();

      this.ctx.restore(); // Restore the context state, reverting alpha and shadow changes
    },

    changeMovementPatternsWithTheBeat: function (beat: boolean) {
      if (beat) {
        beatCount++;
        this.movementPattern = movementPatterns[beatCount % movementPatterns.length];
      }
    },
    scaleSizeWithBass: function (bassFrequency: number) {
      this.size = originalSize; // Reset the size to the original size
      const scaleFactor = 1 + bassFrequency / 255;
      this.size = this.size * scaleFactor;
    },
    keepWithinBounds: function (bounds: { width: number; height: number }) {
      if (this.x < 0) {
        this.x = 0;
        this.direction = Math.PI - this.direction; // Reflect direction on x-axis
      } else if (this.x > bounds.width) {
        this.x = bounds.width;
        this.direction = Math.PI - this.direction; // Reflect direction on x-axis
      }

      if (this.y < 0) {
        this.y = 0;
        this.direction = -this.direction; // Reflect direction on y-axis
      } else if (this.y > bounds.height) {
        this.y = bounds.height;
        this.direction = -this.direction; // Reflect direction on y-axis
      }
    },
    rotate: function (angle: number) {
      this.direction += angle;
    },
  };
}
