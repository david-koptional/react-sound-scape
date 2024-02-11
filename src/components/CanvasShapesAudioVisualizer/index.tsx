import { useEffect, useRef } from "react";
import { BaseShape, createBaseShape, withColorChangeOnBeat } from "../../canvas/Shape/Shape";
import { useBeatDetection } from "../../hooks/useBeatDetection/useBeatDetection";

export const AudioVisualizer = ({ numberOfShapes = 15 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const shapesRef = useRef<BaseShape[]>([]);

  const beat = useBeatDetection();

  useEffect(() => {
    // Dynamically adjust the canvas size on resize
    const resizeCanvas = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        // Trigger redraw after resizing
      }
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas(); // Call it once initially

    // Ensure cleanup is handled to prevent memory leaks
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  useEffect(() => {
    const ctx = canvasRef?.current?.getContext("2d");
    console.log("CTX", ctx);
    if (!ctx) {
      return;
    }

    shapesRef.current = Array.from({ length: numberOfShapes }, () => {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      const radius = Math.random() * 50 + 50;
      const color = `hsl(${Math.random() * 360}, 50%, 50%)`;
      return createBaseShape(x, y, radius, color, ctx, "circle");
    });
  }, [numberOfShapes]);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");

    console.log({ ctx });
    if (!ctx) return;

    const animate = () => {
      console.log("Hi");
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      shapesRef.current.forEach((shape) => {
        console.log({ beat });
        // Example of updating shape properties based on beat
        if (beat) {
          withColorChangeOnBeat(shape, beat, "red"); // This might need to be adjusted based on how withColorChangeOnBeat is implemented
        }
        shape.update();
        shape.draw();
      });

      requestAnimationFrame(animate);
    };

    const animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [beat]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed -z-10 top-0 left-0"
      style={{ width: "100vw", height: "100vh" }}
    />
  );
};
