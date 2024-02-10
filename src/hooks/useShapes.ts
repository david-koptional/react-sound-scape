import { useCallback, useEffect, useState } from "react";
import { BaseShape, withSizeChangeOnBeat } from "../canvas/Shape/Shape";
import { useBeatDetection } from "./useBeatDetection";

const useShapes = () => {
  const [shapes, setShapes] = useState<BaseShape[]>([]);

  const beat = useBeatDetection();

  useEffect(() => {
    const updatedShapes = shapes.map((shape) => withSizeChangeOnBeat(shape, beat, 1.5));
    setShapes(updatedShapes);
  }, [beat, shapes]);

  // Function to add shapes
  const addShape = useCallback((shape: BaseShape) => {
    setShapes((prevShapes) => [...prevShapes, shape]);
  }, []);

  const drawShapes = useCallback(() => {
    shapes.forEach((shape) => shape.draw());
  }, [shapes]);

  const updateShapes = useCallback(() => {
    shapes.forEach((shape) => shape.update());
  }, [shapes]);

  useEffect(() => {
    drawShapes();
  }, [drawShapes]);

  // Adjust shapes based on beat - outside addBeatSensitiveShape to ensure reactivity

  return { addShape, drawShapes, updateShapes };
};

export default useShapes;
