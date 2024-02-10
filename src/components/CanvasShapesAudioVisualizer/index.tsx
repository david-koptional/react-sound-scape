import React, { useRef, useEffect } from "react";
import useShapes from "../../hooks/useShapes";
import { createBaseShape } from "../../canvas/Shape/Shape";

export const AudioVisualizer = ({ numberOfShapes = 15 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize shapes once and ensure `useShapes` hook is properly managing them
  const { addShape, updateShapes, drawShapes } = useShapes();

  useEffect(() => {
    // Dynamically adjust the canvas size on resize
    const resizeCanvas = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        // Trigger redraw after resizing
        drawShapes();
      }
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas(); // Call it once initially

    // Ensure cleanup is handled to prevent memory leaks
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [drawShapes]);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      // Moved inside useEffect to ensure ctx is valid and component is mounted

      // Add shapes only once or based on specific triggers, not on every render
      for (let i = 0; i < numberOfShapes; i++) {
        // Assuming createBaseShape and addShape are adapted to handle ctx correctly
        addShape(createBaseShape(100, 100, 50, "red", ctx, "circle"));
      }

      // Setup and use animation loop properly
      const animate = () => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Clear the canvas
        updateShapes(); // Potentially update shapes' positions or properties
        drawShapes(); // Redraw shapes
        requestAnimationFrame(animate);
      };

      // Start the animation loop
      requestAnimationFrame(animate);
    }
  }, [numberOfShapes, addShape, updateShapes, drawShapes]);

  return (
    <canvas ref={canvasRef} className="fixed -z-10 top-0 left-0 w-full min-h-screen bg-[#303a4d]" />
  );
};
