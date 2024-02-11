import { useState, useEffect } from "react";
import Meyda, { MeydaFeaturesObject } from "meyda";
import { useSharedAudio } from "../../contexts/SharedAudioContext/AudioContext";

export const useBeatDetection = () => {
  const { audioContext, sourceNode } = useSharedAudio();
  const [beat, setBeat] = useState(false);
  const [energyHistory, setEnergyHistory] = useState<number[]>([]);

  useEffect(() => {
    if (!audioContext || !sourceNode) return;
    const analyzer = Meyda.createMeydaAnalyzer({
      audioContext,
      source: sourceNode,
      bufferSize: 512,
      featureExtractors: ["energy"],
      callback: ({ energy }: MeydaFeaturesObject) => {
        // Simple beat detection algorithm:
        const energyThreshold = 0.9; // Adjust based on your needs
        const historyLength = 43; // Number of frames to consider for averaging
        const beatSensitivity = 1.3; // Multiplier for average energy to count as a beat

        // Update energy history
        const updatedHistory = [...energyHistory, energy].slice(-historyLength);
        setEnergyHistory(updatedHistory);

        // Calculate average energy from the history
        const avgEnergy = updatedHistory.reduce((acc, cur) => acc + cur, 0) / updatedHistory.length;

        // Determine if the current energy represents a beat
        if (energy > avgEnergy * beatSensitivity && energy > energyThreshold) {
          setBeat(true);
          // Reset beat after a short delay to "simulate" the beat duration
          setTimeout(() => setBeat(false), 100); // Adjust delay as needed
        }
      },
    });

    analyzer.start();

    return () => {
      analyzer.stop();
    };
  }, [audioContext, sourceNode, energyHistory]);

  return beat;
};
