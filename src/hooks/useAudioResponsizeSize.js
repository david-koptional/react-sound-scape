import { useMemo } from "react";
import { useAudioAnalysis } from "../contexts/AudioAnalysisContext/AudioAnalysisContext";
export const useAudioResponsiveSize = (baseSize) => {
    const { bassLevel } = useAudioAnalysis();
    return useMemo(() => baseSize * (1 + bassLevel / 255), [baseSize, bassLevel]);
};
//# sourceMappingURL=useAudioResponsizeSize.js.map