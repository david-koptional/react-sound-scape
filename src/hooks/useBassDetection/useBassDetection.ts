import { useMemo } from "react";
import { useAudioAnalysis } from "../../contexts/AudioAnalysisContext/AudioAnalysisContext";
import { useSharedAudio } from "../../contexts/SharedAudioContext/AudioContext";

export const useBassDetection = () => {
  const { audioContext } = useSharedAudio();
  const { features, analyser } = useAudioAnalysis();

  const spectrum = useMemo(() => features?.amplitudeSpectrum, [features?.amplitudeSpectrum]);
  const sampleRate = useMemo(() => audioContext?.sampleRate ?? 0, [audioContext?.sampleRate]);
  const binSize = sampleRate / (analyser?.frequencyBinCount ?? 0);

  let bassEnergy = 0;
  const lowerBound = 20; // 20 Hz
  const upperBound = 150; // 150 Hz
  for (let i = Math.floor(lowerBound / binSize); i <= Math.ceil(upperBound / binSize); i++) {
    if (spectrum) {
      bassEnergy += spectrum[i];
    }
  }

  return { bassEnergy };
};
