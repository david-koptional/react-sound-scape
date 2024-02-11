import { useMemo } from "react";
import { useAudioAnalysis } from "../../contexts/AudioAnalysisContext/AudioAnalysisContext";

const inferMoodAndColor = ({
  energy,
  spectralCentroid,
  rms,
}: {
  energy: number;
  spectralCentroid: number;
  rms: number;
}) => {
  // Normalize features
  const highEnergy = energy > 0.5; // example threshold
  const highRMS = rms > 0.05; // example threshold
  const highSpectralCentroid = spectralCentroid > 2000; // example threshold

  // Infer mood
  let mood = "Neutral";
  if (highEnergy && highRMS && highSpectralCentroid) {
    mood = "Happy/Upbeat";
  } else if (!highEnergy && !highRMS) {
    // This condition is broad and covers both "Calm" and potentially "Sad/Melancholic"
    // You may need additional logic here to differentiate further, perhaps based on another feature
    mood = "Calm"; // Default to "Calm" if both energy and RMS are low, without checking spectralCentroid
  } else if (highEnergy && highRMS && !highSpectralCentroid) {
    mood = "Angry/Intense";
  } // Removed the problematic else if branch

  // Map mood to color
  let color;
  switch (mood) {
    case "Happy/Upbeat":
      color = "yellow";
      break;
    case "Calm":
      color = "green";
      break;
    // Consider how to incorporate "Sad/Melancholic" distinctly if needed
    case "Angry/Intense":
      color = "red";
      break;
    default:
      color = "gray"; // Neutral or undefined mood
  }

  return { mood, color };
};

export const useMoodAnalysis = () => {
  const { features } = useAudioAnalysis();

  const spectralCentroid = useMemo(() => features?.spectralCentroid, [features?.spectralCentroid]);

  const energy = useMemo(() => features?.energy, [features?.energy]);

  const rms = useMemo(() => features?.rms, [features?.rms]);

  const moodColor = useMemo(() => {
    if (energy && spectralCentroid && rms) {
      const moodAndColor = inferMoodAndColor({ energy, spectralCentroid, rms });

      return moodAndColor.color;
    } else {
      return "black";
    }
  }, [energy, rms, spectralCentroid]);

  return { color: moodColor };
};
