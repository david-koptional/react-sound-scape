import { BaseShape } from "../../canvas/Shape/Shape";

export const shapeManager = () => {
  const shapes: BaseShape[] = [];

  const addShape = (shape: BaseShape) => {
    shapes.push(shape);
  };

  const drawShapes = () => {
    shapes.forEach((shape) => shape.draw());
  };

  const updateShapes = () => {
    shapes.forEach((shape) => shape.update());
  };

  return { addShape, drawShapes, updateShapes };
};
