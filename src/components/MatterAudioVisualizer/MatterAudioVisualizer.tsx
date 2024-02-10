import React, { useEffect } from "react";
import Matter from "matter-js";

interface AudioVisualizerWithMatterProps {
  analyser: AnalyserNode;
}

export const AudioVisualizerWithMatter: React.FC<AudioVisualizerWithMatterProps> = ({
  analyser,
}) => {
  useEffect(() => {
    // create engine
    const engine = Matter.Engine.create(),
      world = engine.world;

    // create renderer
    const render = Matter.Render.create({
      element: document.body,
      engine: engine,
      options: {
        width: 800,
        height: 600,
        wireframes: false,
      },
    });

    Matter.Render.run(render);

    // create runner
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    // add walls
    const walls = [
      Matter.Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
      Matter.Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
      Matter.Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
      Matter.Bodies.rectangle(0, 300, 50, 600, { isStatic: true }),
    ];
    Matter.Composite.add(world, walls);

    // explosion logic
    const explosion = () => {
      const bodies = Matter.Composite.allBodies(world);

      for (const body of bodies) {
        if (!body.isStatic) {
          const forceMagnitude = 0.05 * body.mass;

          Matter.Body.applyForce(body, body.position, {
            x:
              (forceMagnitude + Matter.Common.random() * forceMagnitude) *
              Matter.Common.choose([1, -1]),
            y: -forceMagnitude + Matter.Common.random() * -forceMagnitude,
          });
        }
      }
    };

    // audio analysis and explosion trigger
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    const update = () => {
      requestAnimationFrame(update);
      analyser.getByteFrequencyData(dataArray);
      const bassFrequency = dataArray.slice(0, 10).reduce((acc, curr) => acc + curr, 0) / 10;

      if (bassFrequency > 180) {
        // Threshold for "bassy" element
        explosion();
      }
    };

    update();

    // cleanup function
    return () => {
      Matter.Engine.clear(engine);
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Matter.World.clear(world, false);
      render.canvas.remove();
    };
  }, [analyser]);

  return null; // This component does not render anything to the DOM itself
};
