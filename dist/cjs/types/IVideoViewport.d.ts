import { IViewport } from './IViewport';
import VideoViewportProperties from './VideoViewportProperties';
export default interface IVideoViewport extends IViewport {
    resize: () => void;
    setProperties(props: VideoViewportProperties, suppressEvents?: boolean): void;
    getProperties: () => VideoViewportProperties;
    setVideoURL: (url: string) => void;
    play: () => void;
    pause: () => void;
    resetProperties(): void;
    resetCamera(resetPan?: boolean, resetZoom?: boolean): boolean;
}
