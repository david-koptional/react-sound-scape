import React from "react";
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
export declare const RespondToBass: ({ children, rotate, maxScaleMultiplier, maxRotateMultiplier, animationDuration, easingFunction, maxBassLevel, initialScale, initialRotation, className, style, onBassChange, animationThreshold, }: RespondToBassProps) => React.JSX.Element;
export {};
