import type { TierResult, GetGPUTier } from 'detect-gpu';
declare type Cornerstone3DConfig = {
    gpuTier?: TierResult;
    detectGPUConfig: GetGPUTier;
    rendering: {
        preferSizeOverAccuracy: boolean;
        useNorm16Texture: boolean;
        useCPURendering: boolean;
        strictZSpacingForVolumeViewport: boolean;
    };
};
export default Cornerstone3DConfig;
