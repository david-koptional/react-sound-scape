interface AnimateCanvas {
  ctx: CanvasRenderingContext2D;
  updateShapes: () => void;
  drawShapes: () => void;
}

export const animateCanvas = ({ ctx, updateShapes, drawShapes }: AnimateCanvas) => {
  const animate = () => {
    if (!ctx) return;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    updateShapes();
    drawShapes();
    requestAnimationFrame(animate);
  };
  requestAnimationFrame(animate);
};
