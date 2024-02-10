import { ShapeType } from "../Shape";
export declare function Triangle(x: number, y: number, velocity: number, direction: number, size: number, color: string, ctx: CanvasRenderingContext2D, movementPatterns: ((shape: ShapeType) => ShapeType)[]): ShapeType;
