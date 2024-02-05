import { useAudioAnalysis } from "../../contexts/AudioAnalysisContext/AudioAnalysisContext";
import { useSharedAudio } from "../../contexts/SharedAudioContext/AudioContext";
import { useEffect, useRef } from "react";
export const FrequencyLineGraph = ({ width, height, color = "#728b93", }) => {
    const { isAudioPlaying } = useSharedAudio();
    const { dataArray } = useAudioAnalysis();
    const canvasRef = useRef(null);
    useEffect(() => {
        let animationFrameId;
        const draw = () => {
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext("2d");
            if (!ctx)
                return;
            if (!isAudioPlaying) {
                ctx.clearRect(0, 0, width, height);
                return;
            }
            ctx.clearRect(0, 0, width, height);
            const maxValue = Math.max(...dataArray);
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = 4;
            const pointSpacing = width / dataArray.length;
            dataArray.forEach((value, index) => {
                const y = height - (value / maxValue) * height;
                const x = pointSpacing * index;
                if (index === 0) {
                    ctx.moveTo(x, y);
                }
                else {
                    ctx.lineTo(x, y);
                }
            });
            ctx.stroke();
            animationFrameId = requestAnimationFrame(draw);
        };
        draw();
        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [dataArray, width, height, isAudioPlaying, color]);
    return <canvas ref={canvasRef} width={width} height={height}></canvas>;
};
//# sourceMappingURL=CanvasFrequencyLineGraph.jsx.map