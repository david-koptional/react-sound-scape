import React from "react";
export declare const SharedAudioContext: React.Context<{
    audio: HTMLAudioElement;
    setAudioSource: (src: string) => void;
    playAudio: () => void;
    stopAudio: () => void;
    isAudioPlaying: boolean;
    trackTime: number;
    audioContext: AudioContext | null;
    sourceNode: MediaElementAudioSourceNode | null;
}>;
export declare const SharedAudioProvider: ({ children }: {
    children: React.ReactNode;
}) => React.JSX.Element;
export declare const useSharedAudio: () => {
    audio: HTMLAudioElement;
    setAudioSource: (src: string) => void;
    playAudio: () => void;
    stopAudio: () => void;
    isAudioPlaying: boolean;
    trackTime: number;
    audioContext: AudioContext | null;
    sourceNode: MediaElementAudioSourceNode | null;
};
