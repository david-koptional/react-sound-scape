import { useMemo } from "react";

export const useAudioResponsiveColor = (baseColor: string, beat: boolean) => {
  return useMemo(() => (beat ? "red" : baseColor), [baseColor, beat]);
};
