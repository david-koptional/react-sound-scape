import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useSharedAudio } from "./AudioContext";

// Define the context data type
interface AudioAnalysisData {
  analyser: AnalyserNode | null;
  bufferLength: number;
  dataArray: Uint8Array;
  bassLevel: number;
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

  useEffect(() => {
    if (audio && audioContext && sourceNode) {
      const analyser = audioContext.createAnalyser();
      sourceNode.connect(analyser);
      analyser.connect(audioContext.destination);
      setIsConnected(true);
      analyser.fftSize = 2048;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      setAnalyser(analyser);
      setBufferLength(bufferLength);
      setDataArray(dataArray);

      return () => {
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
