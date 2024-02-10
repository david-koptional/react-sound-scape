import { BaseShape } from "../canvas/Shape/Shape";
declare const useShapes: () => {
    addShape: (shape: BaseShape) => void;
    drawShapes: () => void;
    updateShapes: () => void;
};
export default useShapes;
