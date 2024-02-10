import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useSharedAudio } from "../SharedAudioContext/AudioContext";
import Meyda, { MeydaAudioFeature, MeydaFeaturesObject } from "meyda";

// Define the context data type
interface AudioAnalysisData {
  analyser: AnalyserNode | null;
  bufferLength: number;
  dataArray: Uint8Array;
  bassLevel: number;
}

const featureExtractors: MeydaAudioFeature[] = [
  "amplitudeSpectrum",
  "spectralCentroid",
  "spectralRolloff",
  "spectralFlatness",
  "spectralSlope",
  "spectralSpread",
  "spectralSkewness",
  "spectralKurtosis",
  "zcr",
  "loudness",
  "perceptualSpread",
  "perceptualSharpness",
  "mfcc",
  "rms",
  "energy",
  "chroma",
  "spectralFlux",
  "buffer",
];

// Create the context
const AudioAnalysisContext = createContext<AudioAnalysisData | null>(null);

// Create the provider component
export const AudioAnalysisProvider = ({
  children,
}: {
  children: React.ReactNode | React.ReactNode[];
}) => {
  const { audio, audioContext, sourceNode, isAudioPlaying } = useSharedAudio();
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [bufferLength, setBufferLength] = useState<number>(0);
  const [dataArray, setDataArray] = useState<Uint8Array>(new Uint8Array(0));
  const [bassLevel, setBassLevel] = useState<number>(0);
  const [isConnected, setIsConnected] = useState(false); // State to track connection
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const meydaAnalyzerRef = useRef<any>(null); // Reference to store the Meyda analyzer
  const [features, setFeatures] = useState<MeydaFeaturesObject | null>(null);

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
        ],
        callback: (features: MeydaFeaturesObject) => {
          console.log(features);
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
    let animationFrameId: number;

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
    };
  }, [analyser, bassLevel, bufferLength, dataArray]);

  return (
    <AudioAnalysisContext.Provider value={contextValue}>{children}</AudioAnalysisContext.Provider>
  );
};

// Create the custom hook
export const useAudioAnalysis = (): AudioAnalysisData => {
  const context = useContext(AudioAnalysisContext);
  if (context === null) {
    throw new Error("useAudioAnalysis must be used within a AudioAnalysisProvider");
  }
  return context;
};
