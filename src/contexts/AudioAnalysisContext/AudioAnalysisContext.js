import { jsx as _jsx } from "react/jsx-runtime";
import Meyda from "meyda";
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useSharedAudio } from "../SharedAudioContext/AudioContext";
// Create the context
const AudioAnalysisContext = createContext(null);
// Create the provider component
export const AudioAnalysisProvider = ({ children, }) => {
    const { audio, audioContext, sourceNode, isAudioPlaying } = useSharedAudio();
    const [analyser, setAnalyser] = useState(null);
    const [bufferLength, setBufferLength] = useState(0);
    const [dataArray, setDataArray] = useState(new Uint8Array(0));
    const [bassLevel, setBassLevel] = useState(0);
    const [isConnected, setIsConnected] = useState(false); // State to track connection
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const meydaAnalyzerRef = useRef(null); // Reference to store the Meyda analyzer
    const [features, setFeatures] = useState(null);
    useEffect(() => {
        if (audio && audioContext && sourceNode) {
            const analyser = audioContext.createAnalyser();
            sourceNode.connect(analyser);
            meydaAnalyzerRef.current = Meyda.createMeydaAnalyzer({
                audioContext,
                source: sourceNode,
                bufferSize: 512,
                featureExtractors: [
                    "energy",
                    "amplitudeSpectrum",
                    "chroma",
                    "spectralCentroid",
                    "spectralKurtosis",
                    "rms",
                    "spectralRolloff",
                    "loudness",
                    "spectralCrest",
                    "zcr",
                    // "zeroCrossingRate",
                ],
                callback: (features) => {
                    setFeatures(features);
                    // Here you can use the extracted features to drive your visualization
                    // For example, adjusting size based on 'energy' or color based on 'spectralCentroid'
                },
            });
            meydaAnalyzerRef.current.start();
            console.log("Meyda analyzer started", meydaAnalyzerRef.current);
            analyser.connect(audioContext.destination);
            setIsConnected(true);
            analyser.fftSize = 2048;
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            setAnalyser(analyser);
            setBufferLength(bufferLength);
            setDataArray(dataArray);
            return () => {
                meydaAnalyzerRef.current.stop();
                if (isConnected && sourceNode) {
                    sourceNode.disconnect(analyser);
                    analyser.disconnect(audioContext.destination);
                    setIsConnected(false);
                }
            };
        }
    }, [audio, audioContext, isConnected, sourceNode]);
    useEffect(() => {
        let animationFrameId;
        const update = () => {
            if (analyser && dataArray) {
                analyser.getByteFrequencyData(dataArray);
                const bassValue = dataArray.reduce((a, b, i) => (i < 10 ? a + b : a), 0);
                setBassLevel(bassValue);
            }
            animationFrameId = requestAnimationFrame(update);
        };
        if (isAudioPlaying) {
            update();
        }
        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [isAudioPlaying, analyser, dataArray]);
    const contextValue = useMemo(() => {
        return {
            analyser,
            bufferLength,
            bassLevel,
            dataArray,
            features,
        };
    }, [analyser, bassLevel, bufferLength, dataArray, features]);
    return (_jsx(AudioAnalysisContext.Provider, { value: contextValue, children: children }));
};
// Create the custom hook
export const useAudioAnalysis = () => {
    const context = useContext(AudioAnalysisContext);
    if (context === null) {
        throw new Error("useAudioAnalysis must be used within a AudioAnalysisProvider");
    }
    return context;
};
//# sourceMappingURL=AudioAnalysisContext.js.map