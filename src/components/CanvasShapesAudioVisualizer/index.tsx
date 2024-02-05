import { useEffect, useMemo, useRef } from "react";
import { linearMovement, spiralMovement } from "../../canvas/movementPatterns/movementPatterns";
import { useAudioAnalysis } from "../../contexts/AudioAnalysisContext/AudioAnalysisContext";
import { useSharedAudio } from "../../contexts/SharedAudioContext/AudioContext";
import { Circle } from "../../canvas/Circle";
import { Triangle } from "../../canvas/Triangle";
import { Diamond } from "../../canvas/Diamond";
import { Square } from "../../canvas/Square";

interface AudioVisualizerProps {
  numberOfShapes?: number;
  shadows?: boolean;
}

export const AudioVisualizer = ({ numberOfShapes = 15, shadows = false }: AudioVisualizerProps) => {
  const { isAudioPlaying, audioContext } = useSharedAudio();
  const { analyser } = useAudioAnalysis();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const bounds = useMemo(
    () => ({ minX: 0, minY: 0, maxX: window.innerWidth, maxY: window.innerHeight }),
    []
  );

  const circleShadows = useMemo(() => {
    return {
      globalAlpha: 0.4,
      shadow: {
        color: "rgba(0, 0, 0, 0.2)",
        blur: 5,
        offsetX: 2,
        offsetY: 2,
      },
    };
  }, []);

  const squareShadows = useMemo(() => {
    return {
      globalAlpha: 0.6,
      shadow: {
        color: "rgba(0, 0, 0, 0.3)",
        blur: 8,
        offsetX: 3,
        offsetY: 3,
      },
    };
  }, []);

  const triangleShadows = useMemo(() => {
    return {
      globalAlpha: 0.8,
      shadow: {
        color: "rgba(0, 0, 0, 0.4)",
        blur: 10,
        offsetX: 4,
        offsetY: 4,
      },
    };
  }, []);

  const diamondShadows = useMemo(() => {
    return {
      globalAlpha: 0.95,
      shadow: {
        color: "rgba(0, 0, 0, 0.5)",
        blur: 15,
        offsetX: 5,
        offsetY: 5,
      },
    };
  }, []);

  useEffect(() => {
    if (!analyser || !audioContext) return;

    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    // Create an array of shapes
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const circles = Array.from({ length: numberOfShapes }, () => {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      const velocity = Math.random() * 10;
      const direction = Math.random() * 2 * Math.PI;

      return Circle(x, y, velocity, direction, 10, "#728b93", ctx, [
        linearMovement(),
        spiralMovement(100, velocity),
        // randomNoisyMovement(velocity),
        // zigzagMovement(velocity, 100),
      ]);
    });
    const squares = Array.from({ length: numberOfShapes }, () => {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      const velocity = Math.random() * 10;
      const direction = Math.random() * 2 * Math.PI;

      return Square(x, y, velocity, direction, 10, "#728b93", ctx, [
        linearMovement(),
        spiralMovement(100, velocity),
        // randomNoisyMovement(velocity),
        // zigzagMovement(velocity, 100),
      ]);
    });

    const triangles = Array.from({ length: numberOfShapes }, () => {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      const velocity = Math.random() * 10;
      const direction = Math.random() * 2 * Math.PI;

      return Triangle(x, y, velocity, direction, 10, "#728b93", ctx, [
        linearMovement(),
        spiralMovement(100, velocity),
        // randomNoisyMovement(velocity),
        // zigzagMovement(velocity, 100),
      ]);
    });

    const diamonds = Array.from({ length: numberOfShapes }, () => {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      const velocity = Math.random() * 10;
      const direction = Math.random() * 2 * Math.PI;

      return Diamond(x, y, velocity, direction, 20, "#728b93", ctx, [
        linearMovement(),
        spiralMovement(100, velocity),
        // randomNoisyMovement(velocity),
        // zigzagMovement(velocity, 100),
      ]);
    });

    let animationFrameId: number;

    let previousBassFrequency = 0;
    const beatThreshold = 200;

    const draw = () => {
      if (!isAudioPlaying) {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        cancelAnimationFrame(animationFrameId);
        return;
      }
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      analyser.getByteFrequencyData(dataArray);
      drawFrequencyLineGraph(dataArray, ctx, window.innerWidth, window.innerHeight);

      animationFrameId = requestAnimationFrame(draw);

      const bassFrequency = getBassFrequency(dataArray);

      const beat = bassFrequency > beatThreshold && bassFrequency > previousBassFrequency;

      circles.forEach((shape) => {
        if (shadows) {
          shape.globalAlpha = circleShadows.globalAlpha;
          shape.shadow = circleShadows.shadow;
        }
        shape.scaleSizeWithBass(bassFrequency);
        shape.changeMovementPatternsWithTheBeat(beat);
        shape.update();
        shape.keepWithinBounds({ width: window.innerWidth, height: window.innerHeight });
        shadows ? shape.wrappedDraw() : shape.draw();
      });

      squares.forEach((shape) => {
        if (shadows) {
          shape.globalAlpha = squareShadows.globalAlpha;
          shape.shadow = squareShadows.shadow;
        }
        shape.scaleSizeWithBass(bassFrequency);
        shape.changeMovementPatternsWithTheBeat(beat);
        shape.update();
        shape.keepWithinBounds({ width: window.innerWidth, height: window.innerHeight });
        shadows ? shape.wrappedDraw() : shape.draw();
      });
      triangles.forEach((shape) => {
        if (shadows) {
          shape.globalAlpha = triangleShadows.globalAlpha;
          shape.shadow = triangleShadows.shadow;
        }
        shape.scaleSizeWithBass(bassFrequency);
        shape.changeMovementPatternsWithTheBeat(beat);
        shape.update();
        shape.rotate(0.01);
        shape.keepWithinBounds({ width: window.innerWidth, height: window.innerHeight });
        shadows ? shape.wrappedDraw() : shape.draw();
      });
      diamonds.forEach((shape) => {
        if (shadows) {
          shape.globalAlpha = diamondShadows.globalAlpha;
          shape.shadow = diamondShadows.shadow;
        }
        shape.scaleSizeWithBass(bassFrequency);
        shape.changeMovementPatternsWithTheBeat(beat);
        shape.update();
        shape.rotate(0.01);
        shape.keepWithinBounds({ width: window.innerWidth, height: window.innerHeight });
        shadows ? shape.wrappedDraw() : shape.draw();
      });
      previousBassFrequency = bassFrequency;
    };

    draw();
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [
    analyser,
    audioContext,
    bounds,
    circleShadows.globalAlpha,
    circleShadows.shadow,
    diamondShadows.globalAlpha,
    diamondShadows.shadow,
    isAudioPlaying,
    numberOfShapes,
    shadows,
    squareShadows.globalAlpha,
    squareShadows.shadow,
    triangleShadows.globalAlpha,
    triangleShadows.shadow,
  ]);

  useEffect(() => {
    const resizeCanvas = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      className="fixed -z-10 top-0 left-0 w-full min-h-screen bg-[#303a4d]"
    ></canvas>
  );
};

function getBassFrequency(audioData: Uint8Array) {
  const bassFrequency = audioData.slice(0, 10).reduce((acc, curr) => acc + curr, 0) / 10;
  return bassFrequency;
}

function drawFrequencyLineGraph(
  dataArray: Uint8Array,
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) {
  // ctx.clearRect(0, 0, width, height); // Clear the canvas

  // Find the maximum value in dataArray to scale the line graph
  const maxValue = Math.max(...dataArray);

  // Begin the line path
  ctx.beginPath();
  ctx.strokeStyle = "#728b93"; // Line color
  ctx.lineWidth = 2; // Line width

  const pointSpacing = width / dataArray.length;

  dataArray.forEach((value, index) => {
    // Scale the y-coordinate to fit within the canvas height
    const scalingFactor = 0.25;
    const y = height - (value / maxValue) * height * scalingFactor;
    const x = pointSpacing * index;

    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.stroke(); // Draw the line
}
