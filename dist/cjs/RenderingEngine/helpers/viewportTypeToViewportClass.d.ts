import StackViewport from '../StackViewport';
import VolumeViewport from '../VolumeViewport';
import VolumeViewport3D from '../VolumeViewport3D';
import VideoViewport from '../VideoViewport';
declare const viewportTypeToViewportClass: {
    orthographic: typeof VolumeViewport;
    perspective: typeof VolumeViewport;
    stack: typeof StackViewport;
    volume3d: typeof VolumeViewport3D;
    video: typeof VideoViewport;
};
export default viewportTypeToViewportClass;
