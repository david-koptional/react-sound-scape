import React, { useEffect, useRef } from "react";
import Matter from "matter-js";
import { useAudioAnalysis } from "../../contexts/AudioAnalysisContext/AudioAnalysisContext";
import { createWallsAndCeiling } from "./utils/createWallsAndCeiling";
import { useSharedAudio } from "../../contexts/SharedAudioContext/AudioContext";

export const AudioVisualizerWithMatter = () => {
  const { bassLevel } = useAudioAnalysis();
  const { isAudioPlaying } = useSharedAudio();
  const visualizerRef = useRef<HTMLDivElement>(null);
  const bodiesRef = useRef<Matter.Body[]>([]); // Ref to store the bodies
  const engineRef = useRef<Matter.Engine | null>(null);

  useEffect(() => {
    if (!visualizerRef.current) return;

    const engine = Matter.Engine.create();
    engineRef.current = engine;
    const world = engine.world;

    const WORLD_WIDTH = visualizerRef.current.clientWidth;

    const WORLD_HEIGHT = visualizerRef.current.clientHeight;

    const render = Matter.Render.create({
      element: visualizerRef.current,
      engine: engine,
      options: {
        width: WORLD_WIDTH,
        height: WORLD_HEIGHT,
        wireframes: false,
      },
    });

    Matter.Render.run(render);
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    createWallsAndCeiling(engine, WORLD_WIDTH, WORLD_HEIGHT);

    // Define and add initial bodies

    const bodyOptions = {
      frictionAir: 0,
      friction: 0.0001,
      restitution: 0.8,
    };

    const bodies = Matter.Composites.stack(20, 100, 15, 3, 20, 40, function (x: number, y: number) {
      // Randomly choose a body type to create
      const bodyType = Matter.Common.choose(["rectangle", "polygon", "circle"]);

      switch (bodyType) {
        case "rectangle":
          // Create a rectangle with random width and height
          return Matter.Bodies.rectangle(
            x,
            y,
            Matter.Common.random(20, 40),
            Matter.Common.random(20, 40),
            bodyOptions
          );
        case "polygon":
          // Create a polygon with random sides and radius, minimum 3 sides
          return Matter.Bodies.polygon(
            x,
            y,
            Math.floor(Matter.Common.random(3, 6)),
            Matter.Common.random(10, 20),
            bodyOptions
          );
        case "circle":
        default:
          // Create a circle with random radius
          return Matter.Bodies.circle(x, y, Matter.Common.random(10, 20), bodyOptions);
      }
    });
    Matter.Composite.add(world, bodies);

    // Store references to the bodies for later manipulation
    bodiesRef.current = bodies.bodies;

    // Cleanup function
    return () => {
      Matter.Engine.clear(engine);
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Matter.World.clear(world, false);
      if (render.canvas) {
        render.canvas.remove();
      }
    };
  }, []);

  useEffect(() => {
    // Dynamically adjust gravity based on bassLevel
    if (engineRef.current) {
      if (!isAudioPlaying) {
        engineRef.current.gravity.y = 1;
      } else {
        const gravityY = bassLevel > 500 ? 0 : 1; // Example logic
        engineRef.current.gravity.y = gravityY;
      }
    }
  }, [bassLevel, isAudioPlaying]); // Adjust gravity when bassLevel changes

  useEffect(() => {
    if (bodiesRef.current.length > 0) {
      bodiesRef.current.forEach((body) => {
        // Define the range of your bassLevel values
        const bassLevelMin = 0; // Minimum expected bassLevel
        const bassLevelMax = 1000; // Maximum expected bassLevel

        // Define the range for your force magnitudes
        const forceMagnitudeMin = 0.00001; // Minimum force magnitude
        const forceMagnitudeMax = 0.0008; // Maximum force magnitude

        // Normalize bassLevel to a value between 0 and 1
        const normalizedBassLevel = (bassLevel - bassLevelMin) / (bassLevelMax - bassLevelMin);

        // Linearly interpolate to get the force magnitude based on the normalized bassLevel
        const forceMagnitude =
          forceMagnitudeMin + (forceMagnitudeMax - forceMagnitudeMin) * normalizedBassLevel;

        // Apply force in a more varied direction based on the calculated force magnitude
        Matter.Body.applyForce(body, body.position, {
          x:
            (forceMagnitude + Matter.Common.random() * forceMagnitude) *
            Matter.Common.choose([1, -1]),
          y:
            (forceMagnitude + Matter.Common.random() * forceMagnitude) *
            Matter.Common.choose([1, -1]),
        });
      });
    }
  }, [bassLevel]);

  return (
    <div
      ref={visualizerRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
      }}
    />
  );
};
