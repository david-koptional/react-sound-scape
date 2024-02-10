import { MeydaFeaturesObject } from "meyda";
import React from "react";
interface AudioAnalysisData {
    analyser: AnalyserNode | null;
    bufferLength: number;
    dataArray: Uint8Array;
    bassLevel: number;
    features: MeydaFeaturesObject | null;
}
export declare const AudioAnalysisProvider: ({ children, }: {
    children: React.ReactNode | React.ReactNode[];
}) => import("react/jsx-runtime").JSX.Element;
export declare const useAudioAnalysis: () => AudioAnalysisData;
export {};
