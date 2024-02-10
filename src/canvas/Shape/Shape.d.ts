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
export declare function createBaseShape(x: number, y: number, size: number, color: string, ctx: CanvasRenderingContext2D, type: ShapeType): BaseShape;
export declare function withSizeChangeOnBeat(shape: BaseShape, beat: boolean, scaleFactor: number): BaseShape;
export declare function withColorChangeOnBeat(shape: BaseShape, beat: boolean, newColor: string): BaseShape;
export declare function withDirectionChangeOnBeat(shape: BaseShape, beat: boolean, newDirection: number): BaseShape;
export {};
