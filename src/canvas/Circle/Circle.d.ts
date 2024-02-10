import { ShapeType } from "../Shape/Shape";
export declare function Circle(x: number, y: number, velocity: number, direction: number, size: number, color: string, ctx: CanvasRenderingContext2D, movementPatterns: ((shape: ShapeType) => ShapeType)[]): ShapeType;
