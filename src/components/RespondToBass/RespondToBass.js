import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useAudioAnalysis } from "../..";
export const RespondToBass = ({ children, rotate = false, maxScaleMultiplier = 0.1, maxRotateMultiplier = 1, animationDuration = 0.01, easingFunction = "easeOut", maxBassLevel = 2550, initialScale = 1, initialRotation = 0, className, style, onBassChange, animationThreshold = 0, }) => {
    const { bassLevel } = useAudioAnalysis();
    const controls = useAnimation();
    useEffect(() => {
        if (bassLevel > animationThreshold) {
            onBassChange?.(bassLevel);
            const normalizedBassLevel = Math.min(bassLevel / maxBassLevel, 1) * 10;
            const scaleMultiplier = normalizedBassLevel * maxScaleMultiplier;
            const rotateMultiplier = normalizedBassLevel * maxRotateMultiplier;
            controls.start({
                scale: initialScale + scaleMultiplier,
                rotate: rotate ? initialRotation + rotateMultiplier : initialRotation,
                transition: { duration: animationDuration, yoyo: Infinity, ease: easingFunction },
            });
        }
    }, [
        bassLevel,
        rotate,
        maxScaleMultiplier,
        maxRotateMultiplier,
        animationDuration,
        easingFunction,
        maxBassLevel,
        initialScale,
        initialRotation,
        onBassChange,
        animationThreshold,
        controls,
    ]);
    return (_jsx(motion.div, { className: className, style: style, animate: controls, children: children }));
};
//# sourceMappingURL=RespondToBass.js.map