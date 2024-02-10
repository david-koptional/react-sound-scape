export const animateCanvas = ({ ctx, updateShapes, drawShapes }) => {
    const animate = () => {
        if (!ctx)
            return;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        updateShapes();
        drawShapes();
        requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
};
//# sourceMappingURL=animateCanvas.js.map