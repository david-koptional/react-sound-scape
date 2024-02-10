import { jsx as _jsx } from "react/jsx-runtime";
import { useAudioAnalysis } from "../../contexts/AudioAnalysisContext/AudioAnalysisContext";
import { useEffect, useRef } from "react";
export const FrequencyBars = ({ width, height, color = "#728b93", widthMultiplier = 2.5, }) => {
    const { dataArray } = useAudioAnalysis();
    const canvasRef = useRef(null);
    useEffect(() => {
        const draw = () => {
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext("2d");
            if (!ctx)
                return;
            const barWidth = (width / dataArray.length) * widthMultiplier;
            ctx.clearRect(0, 0, width, height); // Clear the canvas
            const maxValue = Math.max(...dataArray);
            dataArray.forEach((value, index) => {
                const barHeight = (value / maxValue) * height;
                const x = barWidth * index;
                ctx.fillStyle = color; // Bar color
                ctx.fillRect(x, height - barHeight, barWidth, barHeight);
            });
            requestAnimationFrame(draw); // Redraw on the next animation frame
        };
        draw();
    }, [dataArray, width, height, color, widthMultiplier]);
    return _jsx("canvas", { ref: canvasRef, width: width, height: height });
};
//# sourceMappingURL=CanvasFrequencyBars.js.map