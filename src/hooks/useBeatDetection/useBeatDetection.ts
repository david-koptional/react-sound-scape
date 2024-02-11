import { useEffect, useMemo, useState } from "react";
import { useAudioAnalysis } from "../../contexts/AudioAnalysisContext/AudioAnalysisContext";

export const useBeatDetection = () => {
  const { features } = useAudioAnalysis();
  const [energyHistory, setEnergyHistory] = useState<number[]>([]);
  const [beatDetected, setBeatDetected] = useState<boolean>(false);

  // Assuming 'energy' feature is updated in real-time by your audio analysis context
  const energy = useMemo(() => features?.energy ?? 0, [features?.energy]);

  useEffect(() => {
    console.log("energy", energy);
    // Update energy history
    // For example, keep the last 43 frames (approximately 1 second of history if analyzing at 43Hz)
    const historyLimit = 43;
    setEnergyHistory((prev) => {
      const newEnergyHistory = [...prev, energy].slice(-historyLimit);

      if (newEnergyHistory.length === historyLimit) {
        const averageEnergy = newEnergyHistory.reduce((acc, val) => acc + val, 0) / historyLimit;
        const energyThreshold = averageEnergy * 1.5; // Example threshold multiplier
        const currentBeatDetected = energy > energyThreshold;

        setBeatDetected(currentBeatDetected);
      }

      return newEnergyHistory;
    });

    // Beat detection logic
  }, [energy]);

  // Reset beat detection flag after it's been set to true
  useEffect(() => {
    if (beatDetected) {
      const timer = setTimeout(() => {
        setBeatDetected(false);
      }, 100); // Reset after a short delay to avoid constant true state

      return () => clearTimeout(timer);
    }
  }, [beatDetected]);

  // Return whether a beat was detected, and optionally other useful info like current energy
  return { beatDetected, energy, energyHistory };
};
