import { AudioVisualizerWithMatter } from "./components/MatterAudioVisualizer/MatterAudioVisualizer";
import { AudioVisualizer } from "./components/CanvasShapesAudioVisualizer/index";
import { FrequencyBars } from "./components/CanvasFrequencyBars";
import { FrequencyLineGraph } from "./components/CanvasFrequencyLineGraph/CanvasFrequencyLineGraph";
import { RespondToBass } from "./components/RespondToBass/RespondToBass";
import { AudioAnalysisProvider } from "./contexts/AudioAnalysisContext";
import { useAudioAnalysis } from "./contexts/AudioAnalysisContext/AudioAnalysisContext";
import { SharedAudioProvider } from "./contexts/SharedAudioContext";
import { useSharedAudio } from "./contexts/SharedAudioContext/AudioContext";
import { Shape } from "./canvas/Shape";
import { Circle } from "./canvas/Circle";
import { Square } from "./canvas/Square";
import { Triangle } from "./canvas/Triangle";
import { Diamond } from "./canvas/Diamond";

export {
  SharedAudioProvider,
  AudioAnalysisProvider,
  RespondToBass,
  FrequencyBars,
  FrequencyLineGraph,
  AudioVisualizer,
  useAudioAnalysis,
  useSharedAudio,
  Shape,
  Square,
  Circle,
  Diamond,
  Triangle,
  AudioVisualizerWithMatter,
};
