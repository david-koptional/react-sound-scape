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
    keepWithinBounds: (bounds: {
        width: number;
        height: number;
    }) => void;
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
export declare function Shape(x: number, y: number, velocity: number, direction: number, size: number, color: string, ctx: CanvasRenderingContext2D, movementPatterns: ((shape: ShapeType) => ShapeType)[]): ShapeType;
