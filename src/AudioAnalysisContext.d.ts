import React from "react";
interface AudioAnalysisData {
    analyser: AnalyserNode | null;
    bufferLength: number;
    dataArray: Uint8Array;
    bassLevel: number;
}
export declare const AudioAnalysisProvider: ({ children, }: {
    children: React.ReactNode | React.ReactNode[];
}) => React.JSX.Element;
export declare const useAudioAnalysis: () => AudioAnalysisData;
export {};
