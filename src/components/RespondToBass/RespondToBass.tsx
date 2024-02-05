import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useAudioAnalysis } from "../..";

interface RespondToBassProps {
  children: React.ReactNode | React.ReactNode[];
  rotate?: boolean;
  maxScaleMultiplier?: number;
  maxRotateMultiplier?: number;
  animationDuration?: number;
  easingFunction?: string;
  maxBassLevel?: number;
  initialScale?: number;
  initialRotation?: number;
  className?: string;
  style?: React.CSSProperties;
  onBassChange?: (bassLevel: number) => void;
  animationThreshold?: number;
}

export const RespondToBass = ({
  children,
  rotate = false,
  maxScaleMultiplier = 0.1,
  maxRotateMultiplier = 1,
  animationDuration = 0.01,
  easingFunction = "easeOut",
  maxBassLevel = 2550,
  initialScale = 1,
  initialRotation = 0,
  className,
  style,
  onBassChange,
  animationThreshold = 0,
}: RespondToBassProps) => {
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

  return (
    <motion.div className={className} style={style} animate={controls}>
      {children}
    </motion.div>
  );
};
