import { ElementRef, useEffect } from "react";

export const useResizeCanvas = (canvas: ElementRef<"canvas"> | null, callback: () => void) => {
  useEffect(() => {
    // Dynamically adjust the canvas size on resize
    const resizeCanvas = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        // Trigger redraw after resizing
        callback();
      }
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas(); // Call it once initially

    // Ensure cleanup is handled to prevent memory leaks
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [callback, canvas]);
};
