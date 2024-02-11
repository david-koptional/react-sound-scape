type ShapeType = "circle" | "square" | "triangle";
import { gsap } from "gsap";

export type Tween = gsap.core.Tween | null;

export abstract class BaseShape {
  x: number;
  y: number;
  size: number;
  color: string;
  velocity: { x: number; y: number } = { x: 0, y: 0 };
  ctx: CanvasRenderingContext2D;
  type: ShapeType;
  tween: Tween;

  constructor(
    x: number,
    y: number,
    size: number,
    color: string,
    velocity: { x: number; y: number },
    ctx: CanvasRenderingContext2D,
    type: ShapeType
  ) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.velocity = velocity;
    this.ctx = ctx;
    this.type = type;
    this.tween = null;
  }

  previousVelocity: { x: number; y: number } | null = null;

  abstract draw(): void;

  update({ canvasWidth, canvasHeight }: { canvasWidth: number; canvasHeight: number }): void {
    this.x += this.velocity.x;
    this.y += this.velocity.y;

    if (this.x + this.size > canvasWidth || this.x - this.size < 0) {
      this.velocity.x *= -1; // Reverse the horizontal velocity
    }

    // For the bottom and top canvas edges
    if (this.y + this.size > canvasHeight || this.y - this.size < 0) {
      this.velocity.y *= -1; // Reverse the vertical velocity
    }
  }

  setColor(newColor: string): void {
    this.color = newColor;
  }

  animateSize(newSize: number, duration: number = 1): void {
    // If there's an ongoing animation, kill it to start a new one
    if (this.tween) {
      this.tween.kill();
    }

    // Use GSAP to animate the size property
    this.tween = gsap.to(this, {
      size: newSize,
      duration: duration,
      ease: "power1.inOut",
      onUpdate: () => this.draw(), // Optional: Redraw on each update if necessary
    });
  }

  pauseMovement(): void {
    if (!this.previousVelocity) {
      // Only save the velocity if not already paused
      this.previousVelocity = { ...this.velocity };
      this.velocity = { x: 0, y: 0 }; // Stop the shape by setting its velocity to 0
    }
  }

  resumeMovement(): void {
    if (this.previousVelocity) {
      this.velocity = { ...this.previousVelocity }; // Restore the saved velocity
      this.previousVelocity = null; // Clear the saved velocity
    }
  }

  setVelocity(x: number, y: number): void {
    this.velocity = { x, y };
  }
}

export class Circle extends BaseShape {
  constructor(
    x: number,
    y: number,
    size: number,
    color: string,
    velocity: { x: number; y: number },
    ctx: CanvasRenderingContext2D
  ) {
    super(x, y, size, color, velocity, ctx, "circle");
  }

  draw(): void {
    this.ctx.fillStyle = this.color;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    this.ctx.fill();
  }
}

export class Square extends BaseShape {
  constructor(
    x: number,
    y: number,
    size: number,
    color: string,
    velocity: { x: number; y: number },
    ctx: CanvasRenderingContext2D
  ) {
    super(x, y, size, color, velocity, ctx, "square");
  }

  draw(): void {
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
  }
}

export class Triangle extends BaseShape {
  constructor(
    x: number,
    y: number,
    size: number,
    color: string,
    velocity: { x: number; y: number },
    ctx: CanvasRenderingContext2D
  ) {
    super(x, y, size, color, velocity, ctx, "triangle");
  }

  draw(): void {
    this.ctx.fillStyle = this.color;
    this.ctx.beginPath();
    this.ctx.moveTo(this.x, this.y - this.size / 2);
    this.ctx.lineTo(this.x + this.size / 2, this.y + this.size / 2);
    this.ctx.lineTo(this.x - this.size / 2, this.y + this.size / 2);
    this.ctx.fill();
  }
}
