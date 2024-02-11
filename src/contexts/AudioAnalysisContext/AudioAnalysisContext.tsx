import Meyda, { MeydaFeaturesObject } from "meyda";
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useSharedAudio } from "../SharedAudioContext/AudioContext";

// Define the context data type
interface AudioAnalysisData {
  analyser: AnalyserNode | null;
  bufferLength: number;
  dataArray: Uint8Array;
  bassLevel: number;
  features: MeydaFeaturesObject | null;
}

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
          "rms",
          "spectralRolloff",
          "loudness",
          "spectralCrest",
          "zcr",
        ],
        callback: (features: MeydaFeaturesObject) => {
          setFeatures(features);
          // Here you can use the extracted features to drive your visualization
          // For example, adjusting size based on 'energy' or color based on 'spectralCentroid'
        },
      });

      if (isAudioPlaying) {
        meydaAnalyzerRef.current.start();
      } else {
        meydaAnalyzerRef.current.stop();
      }
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
  }, [audio, audioContext, isAudioPlaying, isConnected, sourceNode]);

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
      features,
    };
  }, [analyser, bassLevel, bufferLength, dataArray, features]);

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
