import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { SharedAudioProvider } from "./contexts/SharedAudioContext";
import { AudioAnalysisProvider } from "./contexts/AudioAnalysisContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SharedAudioProvider>
      <AudioAnalysisProvider>
        <App />
      </AudioAnalysisProvider>
    </SharedAudioProvider>
  </React.StrictMode>
);
