import { useEffect } from "react";
import { useSharedAudio } from "./contexts/SharedAudioContext/AudioContext";

import sample from "./assets/sound/ah_music_90_chasescene_ful_Dm.wav";
import { AudioVisualizer } from "./components/CanvasShapesAudioVisualizer";

function App() {
  const { setAudioSource, playAudio } = useSharedAudio();

  useEffect(() => {
    setAudioSource(sample);
  }, [setAudioSource]);

  return (
    <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
      <button
        onClick={playAudio}
        style={{ border: "4px solid red", position: "fixed", top: 5, right: 5, zIndex: 5000 }}
      >
        Play
      </button>
      <AudioVisualizer />
    </div>
  );
}

export default App;
