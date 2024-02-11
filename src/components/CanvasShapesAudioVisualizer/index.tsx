import { useEffect, useRef } from "react";
import { Circle } from "../../canvas/Shape/Shape"; // Ensure the Circle class is correctly imported
import { useBeatDetection } from "../../hooks/useBeatDetection/useBeatDetection";

export const AudioVisualizer = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const circleRef = useRef<Circle | null>(null); // Store the circle instance

  const CANVAS_WIDTH = window.innerWidth;
  const CANVAS_HEIGHT = window.innerHeight;

  const { beatDetected } = useBeatDetection();

  useEffect(() => {
    const resizeCanvas = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        // No need to redraw here, as the animation loop will handle it
      }
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas(); // Call it once initially

    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");

    if (ctx) {
      // Initialize the circle and store it in the ref
      circleRef.current = new Circle(100, 100, 20, "red", { x: 1, y: 1 }, ctx);
    }
  }, []);

  useEffect(() => {
    if (beatDetected && circleRef.current) {
      // Change color on beat detected
      // circleRef.current.setColor(`hsl(${Math.random() * 360}, 50%, 50%)`);
      circleRef.current.animateSize(Math.random() * 100);
    }
  }, [beatDetected]);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      if (circleRef.current) {
        circleRef.current.update({ canvasWidth: CANVAS_WIDTH, canvasHeight: CANVAS_HEIGHT }); // Update the circle position
        circleRef.current.draw(); // Draw the circle
      }

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate); // Start the animation loop

    // It's a good practice to clean up the animation frame on component unmount
    return () => {
      const id = requestAnimationFrame(animate);
      cancelAnimationFrame(id);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed -z-10 top-0 left-0"
      style={{ width: "100vw", height: "100vh" }}
    />
  );
};
