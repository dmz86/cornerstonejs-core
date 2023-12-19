import { Events as EVENTS, VideoViewport as VideoViewportEnum } from '../enums';
import { Transform } from './helpers/cpuFallback/rendering/transform';
import { triggerEvent } from '../utilities';
import Viewport from './Viewport';
import { getOrCreateCanvas } from './helpers';
class VideoViewport extends Viewport {
    constructor(props) {
        super({
            ...props,
            canvas: props.canvas || getOrCreateCanvas(props.element),
        });
        this.videoWidth = 0;
        this.videoHeight = 0;
        this.loop = false;
        this.mute = true;
        this.isPlaying = false;
        this.scrollSpeed = 1;
        this.fps = 30;
        this.videoCamera = {
            panWorld: [0, 0],
            parallelScale: 1,
        };
        this.getProperties = () => {
            return {
                loop: this.videoElement.loop,
                muted: this.videoElement.muted,
            };
        };
        this.resetCamera = () => {
            this.refreshRenderValues();
            this.canvasContext.fillRect(0, 0, this.canvas.width, this.canvas.height);
            if (this.isPlaying === false) {
                this.renderFrame();
            }
            return true;
        };
        this.getFrameOfReferenceUID = () => {
            return this.videoElement.src;
        };
        this.resize = () => {
            const canvas = this.canvas;
            const { clientWidth, clientHeight } = canvas;
            if (canvas.width !== clientWidth || canvas.height !== clientHeight) {
                canvas.width = clientWidth;
                canvas.height = clientHeight;
            }
            this.refreshRenderValues();
            if (this.isPlaying === false) {
                this.renderFrame();
            }
        };
        this.canvasToWorld = (canvasPos) => {
            const pan = this.videoCamera.panWorld;
            const worldToCanvasRatio = this.getWorldToCanvasRatio();
            const panOffsetCanvas = [
                pan[0] * worldToCanvasRatio,
                pan[1] * worldToCanvasRatio,
            ];
            const subCanvasPos = [
                canvasPos[0] - panOffsetCanvas[0],
                canvasPos[1] - panOffsetCanvas[1],
            ];
            const worldPos = [
                subCanvasPos[0] / worldToCanvasRatio,
                subCanvasPos[1] / worldToCanvasRatio,
                0,
            ];
            return worldPos;
        };
        this.worldToCanvas = (worldPos) => {
            const pan = this.videoCamera.panWorld;
            const worldToCanvasRatio = this.getWorldToCanvasRatio();
            const subCanvasPos = [
                (worldPos[0] + pan[0]) * worldToCanvasRatio,
                (worldPos[1] + pan[1]) * worldToCanvasRatio,
            ];
            const canvasPos = [subCanvasPos[0], subCanvasPos[1]];
            return canvasPos;
        };
        this.customRenderViewportToCanvas = () => {
            this.renderFrame();
        };
        this.renderFrame = () => {
            const panWorld = this.videoCamera.panWorld;
            const worldToCanvasRatio = this.getWorldToCanvasRatio();
            const canvasToWorldRatio = this.getCanvasToWorldRatio();
            const halfCanvas = [this.canvas.width / 2, this.canvas.height / 2];
            const halfCanvasWorldCoordinates = [
                halfCanvas[0] * canvasToWorldRatio,
                halfCanvas[1] * canvasToWorldRatio,
            ];
            const transform = new Transform();
            transform.translate(halfCanvas[0], halfCanvas[1]);
            transform.scale(worldToCanvasRatio, worldToCanvasRatio);
            transform.translate(panWorld[0], panWorld[1]);
            transform.translate(-halfCanvasWorldCoordinates[0], -halfCanvasWorldCoordinates[1]);
            const transformationMatrix = transform.getMatrix();
            this.canvasContext.transform(transformationMatrix[0], transformationMatrix[1], transformationMatrix[2], transformationMatrix[3], transformationMatrix[4], transformationMatrix[5]);
            this.canvasContext.drawImage(this.videoElement, 0, 0, this.videoWidth, this.videoHeight);
            this.canvasContext.resetTransform();
            triggerEvent(this.element, EVENTS.IMAGE_RENDERED, {
                element: this.element,
                viewportId: this.id,
                viewport: this,
                renderingEngineId: this.renderingEngineId,
                time: this.videoElement.currentTime,
                duration: this.videoElement.duration,
            });
        };
        this.renderWhilstPlaying = () => {
            this.renderFrame();
            if (this.isPlaying) {
                requestAnimationFrame(this.renderWhilstPlaying);
            }
        };
        this.canvasContext = this.canvas.getContext('2d');
        this.renderingEngineId = props.renderingEngineId;
        this.element.setAttribute('data-viewport-uid', this.id);
        this.element.setAttribute('data-rendering-engine-uid', this.renderingEngineId);
        this.videoElement = document.createElement('video');
        this.videoElement.muted = this.mute;
        this.videoElement.loop = this.loop;
        this.videoElement.crossOrigin = 'anonymous';
        this.addEventListeners();
        this.resize();
    }
    static get useCustomRenderingPipeline() {
        return true;
    }
    addEventListeners() {
        this.canvas.addEventListener(EVENTS.ELEMENT_DISABLED, this.elementDisabledHandler);
    }
    removeEventListeners() {
        this.canvas.removeEventListener(EVENTS.ELEMENT_DISABLED, this.elementDisabledHandler);
    }
    elementDisabledHandler() {
        this.removeEventListeners();
        this.videoElement.remove();
    }
    async setVideoURL(videoURL) {
        return new Promise((resolve) => {
            this.videoElement.src = videoURL;
            this.videoElement.preload = 'auto';
            const loadedMetadataEventHandler = () => {
                this.videoWidth = this.videoElement.videoWidth;
                this.videoHeight = this.videoElement.videoHeight;
                this.videoElement.removeEventListener('loadedmetadata', loadedMetadataEventHandler);
                this.refreshRenderValues();
                resolve(true);
            };
            this.videoElement.addEventListener('loadedmetadata', loadedMetadataEventHandler);
        });
    }
    togglePlayPause() {
        if (this.isPlaying) {
            this.pause();
            return false;
        }
        else {
            this.play();
            return true;
        }
    }
    play() {
        if (!this.isPlaying) {
            this.videoElement.play();
            this.isPlaying = true;
            this.renderWhilstPlaying();
        }
    }
    async pause() {
        if (this.isPlaying) {
            await this.videoElement.pause();
            this.isPlaying = false;
        }
    }
    async scroll(delta = 1) {
        await this.pause();
        const videoElement = this.videoElement;
        const renderFrame = this.renderFrame;
        const currentTime = videoElement.currentTime;
        const newTime = currentTime + (delta * this.scrollSpeed) / this.fps;
        videoElement.currentTime = newTime;
        const seekEventListener = (evt) => {
            renderFrame();
            videoElement.removeEventListener('seeked', seekEventListener);
        };
        videoElement.addEventListener('seeked', seekEventListener);
    }
    async start() {
        const videoElement = this.videoElement;
        const renderFrame = this.renderFrame;
        videoElement.currentTime = 0;
        if (videoElement.paused) {
            const seekEventListener = (evt) => {
                console.log('seeked');
                renderFrame();
                videoElement.removeEventListener('seeked', seekEventListener);
            };
            videoElement.addEventListener('seeked', seekEventListener);
        }
    }
    async end() {
        const videoElement = this.videoElement;
        const renderFrame = this.renderFrame;
        videoElement.currentTime = videoElement.duration;
        if (videoElement.paused) {
            const seekEventListener = (evt) => {
                renderFrame();
                videoElement.removeEventListener('seeked', seekEventListener);
            };
            videoElement.addEventListener('seeked', seekEventListener);
        }
    }
    async setTime(timeInSeconds) {
        const videoElement = this.videoElement;
        const renderFrame = this.renderFrame;
        videoElement.currentTime = timeInSeconds;
        if (videoElement.paused) {
            const seekEventListener = (evt) => {
                renderFrame();
                videoElement.removeEventListener('seeked', seekEventListener);
            };
            videoElement.addEventListener('seeked', seekEventListener);
        }
    }
    async setFrame(frame) {
        this.setTime((frame - 1) / this.fps);
    }
    setProperties(videoInterface) {
        if (videoInterface.loop !== undefined) {
            this.videoElement.loop = videoInterface.loop;
        }
        if (videoInterface.muted !== undefined) {
            this.videoElement.muted = videoInterface.muted;
        }
        if (videoInterface.playbackRate !== undefined) {
            this.setPlaybackRate(videoInterface.playbackRate);
        }
    }
    setPlaybackRate(rate = 1) {
        if (rate < 0.0625) {
            this.pause();
            return;
        }
        if (!this.videoElement) {
            return;
        }
        this.videoElement.playbackRate = rate;
        this.play();
    }
    setScrollSpeed(scrollSpeed = 1, unit = VideoViewportEnum.SpeedUnit.FRAME) {
        this.scrollSpeed =
            unit === VideoViewportEnum.SpeedUnit.SECOND
                ? scrollSpeed * this.fps
                : scrollSpeed;
    }
    resetProperties() {
        this.setProperties({
            loop: false,
            muted: true,
        });
    }
    getImageData() {
        return null;
    }
    setCamera(camera) {
        const { parallelScale, focalPoint } = camera;
        if (camera.parallelScale !== undefined) {
            this.videoCamera.parallelScale = 1 / parallelScale;
        }
        if (focalPoint !== undefined) {
            const focalPointCanvas = this.worldToCanvas(focalPoint);
            const canvasCenter = [
                this.element.clientWidth / 2,
                this.element.clientHeight / 2,
            ];
            const panWorldDelta = [
                (focalPointCanvas[0] - canvasCenter[0]) /
                    this.videoCamera.parallelScale,
                (focalPointCanvas[1] - canvasCenter[1]) /
                    this.videoCamera.parallelScale,
            ];
            this.videoCamera.panWorld = [
                this.videoCamera.panWorld[0] - panWorldDelta[0],
                this.videoCamera.panWorld[1] - panWorldDelta[1],
            ];
        }
        this.canvasContext.fillRect(0, 0, this.canvas.width, this.canvas.height);
        if (this.isPlaying === false) {
            this.renderFrame();
        }
    }
    getCamera() {
        const { parallelScale } = this.videoCamera;
        const canvasCenter = [
            this.element.clientWidth / 2,
            this.element.clientHeight / 2,
        ];
        const canvasCenterWorld = this.canvasToWorld(canvasCenter);
        return {
            parallelProjection: true,
            focalPoint: canvasCenterWorld,
            position: [0, 0, 0],
            parallelScale: 1 / parallelScale,
            viewPlaneNormal: [0, 0, 1],
        };
    }
    refreshRenderValues() {
        let worldToCanvasRatio = this.canvas.width / this.videoWidth;
        if (this.videoHeight * worldToCanvasRatio > this.canvas.height) {
            const secondWorldToCanvasRatio = this.canvas.height / (this.videoHeight * worldToCanvasRatio);
            worldToCanvasRatio *= secondWorldToCanvasRatio;
        }
        const drawWidth = Math.floor(this.videoWidth * worldToCanvasRatio);
        const drawHeight = Math.floor(this.videoHeight * worldToCanvasRatio);
        const xOffsetCanvas = this.canvas.width / 2 - drawWidth / 2;
        const yOffsetCanvas = this.canvas.height / 2 - drawHeight / 2;
        const xOffsetWorld = xOffsetCanvas / worldToCanvasRatio;
        const yOffsetWorld = yOffsetCanvas / worldToCanvasRatio;
        this.videoCamera.panWorld = [xOffsetWorld, yOffsetWorld];
        this.videoCamera.parallelScale = worldToCanvasRatio;
    }
    getWorldToCanvasRatio() {
        return this.videoCamera.parallelScale;
    }
    getCanvasToWorldRatio() {
        return 1.0 / this.videoCamera.parallelScale;
    }
}
export default VideoViewport;
//# sourceMappingURL=VideoViewport.js.map