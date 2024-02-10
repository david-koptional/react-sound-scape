export type LineType = {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    color: string;
    ctx: CanvasRenderingContext2D;
    respondToBass: (bassFrequency: number) => void;
    float: () => void;
    rotate: () => void;
    draw: () => void;
    update: () => void;
};
export declare function Line(x1: number, y1: number, x2: number, y2: number, color: string, ctx: CanvasRenderingContext2D): LineType;
