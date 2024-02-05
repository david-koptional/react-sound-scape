import { ShapeType } from "../Shape/Shape";
import { createNoise2D } from "simplex-noise";

const noise = createNoise2D();

export function linearMovement() {
  return (shape: ShapeType): ShapeType => {
    const x = shape.x + shape.velocity * Math.cos(shape.direction);
    const y = shape.y + shape.velocity * Math.sin(shape.direction);
    return { ...shape, x, y };
  };
}

export function circularMovement(radius: number, angularVelocity: number) {
  return (shape: ShapeType): ShapeType => {
    const x = shape.x + radius * Math.cos(angularVelocity + shape.direction);
    const y = shape.y + radius * Math.sin(angularVelocity + shape.direction);
    return { ...shape, x, y };
  };
}

export function spiralMovement(radius: number, angularVelocity: number) {
  return (shape: ShapeType): ShapeType => {
    const x = shape.x + radius * Math.cos(angularVelocity + shape.direction) * 0.1;
    const y = shape.y + radius * Math.sin(angularVelocity + shape.direction) * 0.1;
    return { ...shape, x, y };
  };
}

export function randomNoisyMovement(velocity: number) {
  return (shape: ShapeType): ShapeType => {
    const x = shape.x + velocity * noise(shape.x, shape.y);
    const y = shape.y + velocity * noise(shape.y, shape.x);
    return { ...shape, x, y };
  };
}

export function zigzagMovement(velocity: number, changeInterval: number) {
  let distanceMoved = 0;
  let zigzagDirection = 1; // 1 for one direction, -1 for the opposite

  return (shape: ShapeType): ShapeType => {
    if (distanceMoved > changeInterval) {
      zigzagDirection *= -1; // Change direction
      distanceMoved = 0; // Reset the distance counter
    }

    // Calculate new position
    const x = shape.x + velocity * zigzagDirection;
    const y = shape.y;

    // Update the distance moved
    distanceMoved += Math.abs(velocity);

    return { ...shape, x, y };
  };
}
