import React, { createContext, useContext, useState, useRef, useCallback, useEffect, useMemo, } from "react";
export const SharedAudioContext = createContext(null);
export const SharedAudioProvider = ({ children }) => {
    const audio = useRef(new Audio());
    const audioContext = useRef(new AudioContext());
    const sourceNode = useRef(null);
    const [isAudioPlaying, setIsAudioPlaying] = useState(false);
    const [trackTime, setTrackTime] = useState(0);
    useEffect(() => {
        if (audio.current && !sourceNode.current) {
            const source = audioContext.current.createMediaElementSource(audio.current);
            sourceNode.current = source;
        }
        return () => {
            if (sourceNode.current) {
                sourceNode.current.disconnect();
            }
        };
    }, []);
    const setAudioSource = useCallback((src) => {
        if (audio.current) {
            audio.current.src = src;
            setTrackTime(0); // Reset track time when source changes
        }
    }, []);
    const playAudio = useCallback(() => {
        if (audio.current && audioContext.current && sourceNode.current) {
            audio.current.play();
            setIsAudioPlaying(true);
            sourceNode.current.connect(audioContext.current.destination);
        }
    }, []);
    const stopAudio = useCallback(() => {
        if (audio.current) {
            audio.current.pause();
            audio.current.currentTime = 0;
            setIsAudioPlaying(false);
            setTrackTime(0);
            if (sourceNode.current) {
                sourceNode.current.disconnect();
            }
        }
    }, []);
    useEffect(() => {
        const audioElem = audio.current;
        const onPlayEnd = () => setIsAudioPlaying(false);
        const onTimeUpdate = () => setTrackTime(audioElem ? audioElem.currentTime : 0);
        audioElem?.addEventListener("ended", onPlayEnd);
        audioElem?.addEventListener("timeupdate", onTimeUpdate);
        return () => {
            audioElem?.removeEventListener("ended", onPlayEnd);
            audioElem?.removeEventListener("timeupdate", onTimeUpdate);
        };
    }, []);
    const contextValue = useMemo(() => ({
        audio: audio.current,
        setAudioSource,
        playAudio,
        stopAudio,
        isAudioPlaying,
        trackTime,
        sourceNode: sourceNode.current,
        audioContext: audioContext.current,
    }), [isAudioPlaying, playAudio, setAudioSource, stopAudio, trackTime]);
    return (<SharedAudioContext.Provider value={contextValue}>
      {children}
      <audio ref={audio}/>
    </SharedAudioContext.Provider>);
};
export const useSharedAudio = () => useContext(SharedAudioContext);
//# sourceMappingURL=AudioContext.jsx.map