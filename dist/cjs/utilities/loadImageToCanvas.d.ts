import { RequestType } from '../enums';
interface LoadImageOptions {
    canvas: HTMLCanvasElement;
    imageId: string;
    requestType?: RequestType;
    priority?: number;
    renderingEngineId?: string;
    useCPURendering?: boolean;
}
export default function loadImageToCanvas(options: LoadImageOptions): Promise<string>;
export {};
