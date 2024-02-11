import { useEffect, useRef } from "react";
import { BaseShape, Circle, Square, Triangle } from "../../canvas/Shape/Shape"; // Ensure the Circle class is correctly imported
import { useBeatDetection } from "../../hooks/useBeatDetection/useBeatDetection";
import { useBassDetection } from "../../hooks/useBassDetection/useBassDetection";

export const AudioVisualizer = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const baseShapesRef = useRef<BaseShape[] | null>(null); // Store the circle instance

  const CANVAS_WIDTH = window.innerWidth;
  const CANVAS_HEIGHT = window.innerHeight;

  const { beatDetected } = useBeatDetection();

  const { bassEnergy } = useBassDetection();

  console.log(bassEnergy);

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
      baseShapesRef.current = Array.from({ length: 15 }, () => {
        const circle = new Circle(
          Math.random() * CANVAS_WIDTH, // x
          Math.random() * CANVAS_HEIGHT, // y
          Math.random() * 100, // size
          `hsl(${Math.random() * 360}, 50%, 50%)`, // color
          { x: Math.random() * 2 - 1, y: Math.random() * 2 - 1 }, // velocity
          ctx
        );
        const square = new Square(
          Math.random() * CANVAS_WIDTH, // x
          Math.random() * CANVAS_HEIGHT, // y
          Math.random() * 100, // size
          `hsl(${Math.random() * 360}, 50%, 50%)`, // color
          { x: Math.random() * 2 - 1, y: Math.random() * 2 - 1 }, // velocity
          ctx
        );

        const triangle = new Triangle(
          Math.random() * CANVAS_WIDTH, // x
          Math.random() * CANVAS_HEIGHT, // y
          Math.random() * 100, // size
          `hsl(${Math.random() * 360}, 50%, 50%)`, // color
          { x: Math.random() * 2 - 1, y: Math.random() * 2 - 1 }, // velocity
          ctx
        );

        switch (Math.floor(Math.random() * 3)) {
          case 0:
            return circle;
          case 1:
            return square;
          case 2:
            return triangle;
          default:
            return circle;
        }
      });
    }
  }, [CANVAS_HEIGHT, CANVAS_WIDTH]);

  useEffect(() => {
    if (beatDetected && baseShapesRef.current) {
      // Change color on beat detected
      // baseShapesRef.current.setColor(`hsl(${Math.random() * 360}, 50%, 50%)`);
      baseShapesRef.current.forEach((shape) => {
        shape.animateSize(Math.random() * 100, 0.5); // Animate the size
      });
    }
  }, [beatDetected]);

  useEffect(() => {
    if (baseShapesRef.current) {
      if (bassEnergy > 160) {
        // Pause movement only if not already paused
        baseShapesRef.current.forEach((shape) => {
          if (!shape.previousVelocity) {
            // Check if the shape is moving
            shape.pauseMovement();
          }
        });
      } else {
        // Resume movement only if not already moving
        baseShapesRef.current.forEach((shape) => {
          if (shape.previousVelocity) {
            // Check if the shape is paused
            shape.resumeMovement();
          }
        });
      }
    }
  }, [bassEnergy]);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const animate = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      if (baseShapesRef.current) {
        baseShapesRef.current.forEach((shape) => {
          shape.update({ canvasHeight: CANVAS_HEIGHT, canvasWidth: CANVAS_WIDTH });
          shape.draw();
        });
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId); // Correct cleanup using the animation frame ID
    };
  }, [CANVAS_HEIGHT, CANVAS_WIDTH]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed -z-10 top-0 left-0"
      style={{ width: "100vw", height: "100vh" }}
    />
  );
};
