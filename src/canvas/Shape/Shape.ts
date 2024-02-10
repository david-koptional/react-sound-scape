type ShapeType = "circle" | "square" | "triangle" | "diamond";

export interface BaseShape {
  x: number;
  y: number;
  size: number;
  color: string;
  ctx: CanvasRenderingContext2D;
  type: ShapeType;
  draw: () => void;
  update: () => void;
}

export function createBaseShape(
  x: number,
  y: number,
  size: number,
  color: string,
  ctx: CanvasRenderingContext2D,
  type: ShapeType
): BaseShape {
  return {
    x,
    y,
    size,
    color,
    ctx,
    type,
    draw() {
      this.ctx.fillStyle = this.color;
      switch (this.type) {
        case "circle":
          this.ctx.beginPath();
          this.ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
          this.ctx.fill();
          break;
        case "square":
          this.ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
          break;
        case "triangle":
          this.ctx.beginPath();
          this.ctx.moveTo(this.x, this.y - this.size);
          this.ctx.lineTo(this.x - this.size, this.y + this.size);
          this.ctx.lineTo(this.x + this.size, this.y + this.size);
          this.ctx.closePath();
          this.ctx.fill();
          break;
        case "diamond":
          this.ctx.beginPath();
          this.ctx.moveTo(this.x, this.y - this.size);
          this.ctx.lineTo(this.x - this.size, this.y);
          this.ctx.lineTo(this.x, this.y + this.size);
          this.ctx.lineTo(this.x + this.size, this.y);
          this.ctx.closePath();
          this.ctx.fill();
          break;
        // Add more shapes as needed
      }
    },
    update() {
      // Basic update logic, if any
    },
  };
}

export function withSizeChangeOnBeat(
  shape: BaseShape,
  beat: boolean,
  scaleFactor: number
): BaseShape {
  if (beat) {
    return {
      ...shape,
      size: shape.size * scaleFactor,
    };
  }
  return shape;
}

// Modifier for color change on the beat
export function withColorChangeOnBeat(
  shape: BaseShape,
  beat: boolean,
  newColor: string
): BaseShape {
  if (beat) {
    return {
      ...shape,
      color: newColor,
    };
  }
  return shape;
}

// Modifier for changing direction on the beat
export function withDirectionChangeOnBeat(
  shape: BaseShape,
  beat: boolean,
  newDirection: number
): BaseShape {
  if (beat) {
    return {
      ...shape,
      update() {
        // Custom update logic for new direction
        this.x += Math.cos(newDirection) * 5; // Example movement logic
        this.y += Math.sin(newDirection) * 5;
      },
    };
  }
  return shape;
}
