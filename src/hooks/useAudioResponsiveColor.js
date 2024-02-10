import { useMemo } from "react";
export const useAudioResponsiveColor = (baseColor, beat) => {
    return useMemo(() => (beat ? "red" : baseColor), [baseColor, beat]);
};
//# sourceMappingURL=useAudioResponsiveColor.js.map