import { ShapeType } from "../Shape/Shape";
export declare function linearMovement(): (shape: ShapeType) => ShapeType;
export declare function circularMovement(radius: number, angularVelocity: number): (shape: ShapeType) => ShapeType;
export declare function spiralMovement(radius: number, angularVelocity: number): (shape: ShapeType) => ShapeType;
export declare function randomNoisyMovement(velocity: number): (shape: ShapeType) => ShapeType;
export declare function zigzagMovement(velocity: number, changeInterval: number): (shape: ShapeType) => ShapeType;
