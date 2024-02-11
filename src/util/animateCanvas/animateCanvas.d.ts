interface AnimateCanvas {
    ctx: CanvasRenderingContext2D;
    updateShapes: () => void;
    drawShapes: () => void;
}
export declare const animateCanvas: ({ ctx, updateShapes, drawShapes }: AnimateCanvas) => void;
export {};
