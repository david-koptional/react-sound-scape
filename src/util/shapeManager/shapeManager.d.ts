import { BaseShape } from "../../canvas/Shape/Shape";
export declare const shapeManager: () => {
    addShape: (shape: BaseShape) => void;
    drawShapes: () => void;
    updateShapes: () => void;
};
