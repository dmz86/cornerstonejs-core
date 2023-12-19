import type { GetGPUTier } from 'detect-gpu';
import { mat3 } from 'gl-matrix';
import { mat4 } from 'gl-matrix';
import type { TierResult } from 'detect-gpu';
import { vec3 } from 'gl-matrix';
import type vtkActor from '@kitware/vtk.js/Rendering/Core/Actor';
import type { vtkCamera } from '@kitware/vtk.js/Rendering/Core/Camera';
import vtkColorTransferFunction from '@kitware/vtk.js/Rendering/Core/ColorTransferFunction';
import type { vtkImageData } from '@kitware/vtk.js/Common/DataModel/ImageData';
import vtkImageSlice from '@kitware/vtk.js/Rendering/Core/ImageSlice';
import type { vtkObject } from '@kitware/vtk.js/interfaces';
import vtkPlane from '@kitware/vtk.js/Common/DataModel/Plane';
import type vtkVolume from '@kitware/vtk.js/Rendering/Core/Volume';

declare type Actor = vtkActor;

declare type ActorEntry = {
    uid: string;
    actor: Actor | VolumeActor | ImageActor;
    referenceId?: string;
    slabThickness?: number;
    clippingFilter?: any;
};

declare function actorIsA(actorEntry: Types.ActorEntry, actorType: actorTypes): boolean;

declare type ActorSliceRange = {
    actor: VolumeActor;
    viewPlaneNormal: Point3;
    focalPoint: Point3;
    min: number;
    max: number;
    current: number;
};

declare type actorTypes = 'vtkActor' | 'vtkVolume' | 'vtkImageSlice';

declare type AdditionalDetails = {
    imageId?: string;
    volumeId?: string;
};

declare function addProvider(provider: (type: string, query: any) => any, priority?: number): void;

export declare function addVolumesToViewports(renderingEngine: IRenderingEngine, volumeInputs: Array<IVolumeInput>, viewportIds: Array<string>, immediateRender?: boolean, suppressEvents?: boolean): Promise<void>;

declare type AffineMatrix = [
[
number,
number,
number,
number
],
[
number,
number,
number,
number
],
[
number,
number,
number,
number
],
[
number,
number,
number,
number
]
];

declare function applyPreset(actor: VolumeActor, preset: ViewportPreset): void;

export declare abstract class BaseVolumeViewport extends Viewport implements IVolumeViewport {
    useCPURendering: boolean;
    useNativeDataType: boolean;
    private _FrameOfReferenceUID;
    protected initialTransferFunctionNodes: any;
    private globalDefaultProperties;
    private perVolumeIdDefaultProperties;
    protected viewportProperties: VolumeViewportProperties;
    constructor(props: ViewportInput);
    static get useCustomRenderingPipeline(): boolean;
    protected applyViewOrientation(orientation: OrientationAxis | OrientationVectors): void;
    private initializeVolumeNewImageEventDispatcher;
    protected resetVolumeViewportClippingRange(): void;
    private setVOILUTFunction;
    private setColormap;
    private setOpacity;
    private setInvert;
    private _getOrCreateColorTransferFunction;
    private setInterpolationType;
    private setVOI;
    setDefaultProperties(ViewportProperties: VolumeViewportProperties, volumeId?: string): void;
    clearDefaultProperties(volumeId?: string): void;
    setProperties({ voiRange, VOILUTFunction, invert, colormap, preset, interpolationType, slabThickness, }?: VolumeViewportProperties, volumeId?: string, suppressEvents?: boolean): void;
    resetToDefaultProperties(volumeId: string): void;
    private setPreset;
    getDefaultProperties: (volumeId?: string) => VolumeViewportProperties;
    getProperties: (volumeId?: string) => VolumeViewportProperties;
    setVolumes(volumeInputArray: Array<IVolumeInput>, immediate?: boolean, suppressEvents?: boolean): Promise<void>;
    addVolumes(volumeInputArray: Array<IVolumeInput>, immediate?: boolean, suppressEvents?: boolean): Promise<void>;
    removeVolumeActors(actorUIDs: Array<string>, immediate?: boolean): void;
    setOrientation(orientation: OrientationAxis, immediate?: boolean): void;
    private _getApplicableVolumeActor;
    private _isValidVolumeInputArray;
    getBounds(): number[];
    flip(flipDirection: FlipDirection): void;
    getFrameOfReferenceUID: () => string;
    hasVolumeId(volumeId: string): boolean;
    getImageData(volumeId?: string): IImageData | undefined;
    private _setVolumeActors;
    canvasToWorld: (canvasPos: Point2) => Point3;
    worldToCanvas: (worldPos: Point3) => Point2;
    hasImageURI: (imageURI: string) => boolean;
    protected _getOrientationVectors(orientation: OrientationAxis | OrientationVectors): OrientationVectors;
    getSlabThickness(): number;
    getIntensityFromWorld(point: Point3): number;
    getImageIds: (volumeId?: string) => Array<string>;
    abstract getCurrentImageIdIndex(): number;
    abstract getCurrentImageId(): string;
    abstract setBlendMode(blendMode: BlendModes, filterActorUIDs?: Array<string>, immediate?: boolean): void;
    abstract setSlabThickness(slabThickness: number, filterActorUIDs?: Array<string>): void;
    abstract resetProperties(volumeId?: string): void;
}

declare enum BlendModes {
    COMPOSITE = 0,
    MAXIMUM_INTENSITY_BLEND = 1,
    MINIMUM_INTENSITY_BLEND = 2,
    AVERAGE_INTENSITY_BLEND = 3
}

export declare const cache: Cache_2;

declare class Cache_2 implements ICache {
    private readonly _imageCache;
    private readonly _volumeCache;
    private readonly _geometryCache;
    private _imageCacheSize;
    private _volumeCacheSize;
    private _maxCacheSize;
    private _maxInstanceSize;
    constructor();
    setMaxCacheSize: (newMaxCacheSize: number) => void;
    isCacheable: (byteLength: number) => boolean;
    getMaxCacheSize: () => number;
    getMaxInstanceSize: () => number;
    getCacheSize: () => number;
    getBytesAvailable(): number;
    private _decacheImage;
    private _decacheVolume;
    purgeCache: () => void;
    purgeVolumeCache: () => void;
    decacheIfNecessaryUntilBytesAvailable(numBytes: number, volumeImageIds?: Array<string>): number | undefined;
    putImageLoadObject(imageId: string, imageLoadObject: IImageLoadObject): Promise<any>;
    getImageLoadObject(imageId: string): IImageLoadObject;
    isLoaded(imageId: string): boolean;
    getVolumeContainingImageId(imageId: string): {
        volume: IImageVolume;
        imageIdIndex: number;
    };
    getCachedImageBasedOnImageURI(imageId: string): ICachedImage | undefined;
    putVolumeLoadObject(volumeId: string, volumeLoadObject: IVolumeLoadObject): Promise<any>;
    getVolumeLoadObject: (volumeId: string) => IVolumeLoadObject;
    getGeometry: (geometryId: string) => IGeometry;
    getVolume: (volumeId: string) => IImageVolume;
    removeImageLoadObject: (imageId: string) => void;
    removeVolumeLoadObject: (volumeId: string) => void;
    putGeometryLoadObject: (geometryId: string, geometryLoadObject: IGeometryLoadObject) => Promise<void>;
    private _incrementImageCacheSize;
    private _incrementVolumeCacheSize;
}

declare function calculateViewportsSpatialRegistration(viewport1: IStackViewport, viewport2: IStackViewport): void;

declare enum CalibrationTypes {
    NOT_APPLICABLE = "",
    ERMF = "ERMF",
    USER = "User",
    PROJECTION = "Proj",
    REGION = "Region",
    ERROR = "Error",
    UNCALIBRATED = "Uncalibrated"
}

declare type CameraModifiedEvent = CustomEvent_2<CameraModifiedEventDetail>;

declare type CameraModifiedEventDetail = {
    previousCamera: ICamera;
    camera: ICamera;
    element: HTMLDivElement;
    viewportId: string;
    renderingEngineId: string;
    rotation?: number;
};

declare function cancelLoadAll(): void;

declare function cancelLoadImage(imageId: string): void;

declare function cancelLoadImages(imageIds: Array<string>): void;

declare function clamp(value: number, min: number, max: number): number;

declare namespace colormap {
    export {
        getColormap,
        getColormapNames,
        registerColormap
    }
}

declare type ColormapPublic = {
    name?: string;
    opacity?: OpacityMapping[] | number;
};

declare type ColormapRegistration = {
    ColorSpace: string;
    Name: string;
    RGBPoints: RGB[];
};

declare const colormapsData: CPUFallbackColormapsData;

declare namespace CONSTANTS {
    export {
        colormapsData as CPU_COLORMAPS,
        RENDERING_DEFAULTS,
        mprCameraValues as MPR_CAMERA_VALUES,
        EPSILON,
        presets as VIEWPORT_PRESETS
    }
}
export { CONSTANTS }

declare type ContourData = {
    points: Point3[];
    type: ContourType;
    color: Point3;
    segmentIndex: number;
};

declare type ContourSetData = {
    id: string;
    data: ContourData[];
    frameOfReferenceUID: string;
    color?: Point3;
    segmentIndex?: number;
};

declare enum ContourType {
    CLOSED_PLANAR = "CLOSED_PLANAR",
    OPEN_PLANAR = "OPEN_PLANAR"
}

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

declare class CornerstoneEventTarget implements EventTarget {
    private listeners;
    constructor();
    reset(): void;
    addEventListener(type: any, callback: any): void;
    removeEventListener(type: any, callback: any): void;
    dispatchEvent(event: any): boolean;
}

declare interface CPUFallbackColormap {
    getId: () => string;
    getColorSchemeName: () => string;
    setColorSchemeName: (name: string) => void;
    getNumberOfColors: () => number;
    setNumberOfColors: (numColors: number) => void;
    getColor: (index: number) => Point4;
    getColorRepeating: (index: number) => Point4;
    setColor: (index: number, rgba: Point4) => void;
    addColor: (rgba: Point4) => void;
    insertColor: (index: number, rgba: Point4) => void;
    removeColor: (index: number) => void;
    clearColors: () => void;
    buildLookupTable: (lut: CPUFallbackLookupTable) => void;
    createLookupTable: () => CPUFallbackLookupTable;
    isValidIndex: (index: number) => boolean;
}

declare type CPUFallbackColormapData = {
    name: string;
    numOfColors?: number;
    colors?: Point4[];
    segmentedData?: unknown;
    numColors?: number;
    gamma?: number;
};

declare type CPUFallbackColormapsData = {
    [key: string]: CPUFallbackColormapData;
};

declare interface CPUFallbackEnabledElement {
    scale?: number;
    pan?: Point2;
    zoom?: number;
    rotation?: number;
    image?: IImage;
    canvas?: HTMLCanvasElement;
    viewport?: CPUFallbackViewport;
    colormap?: CPUFallbackColormap;
    options?: {
        [key: string]: unknown;
        colormap?: CPUFallbackColormap;
    };
    renderingTools?: CPUFallbackRenderingTools;
    transform?: CPUFallbackTransform;
    invalid?: boolean;
    needsRedraw?: boolean;
    metadata?: {
        direction?: Mat3;
        dimensions?: Point3;
        spacing?: Point3;
        origin?: Point3;
        imagePlaneModule?: ImagePlaneModule;
        imagePixelModule?: ImagePixelModule;
    };
}

declare interface CPUFallbackLookupTable {
    setNumberOfTableValues: (number: number) => void;
    setRamp: (ramp: string) => void;
    setTableRange: (start: number, end: number) => void;
    setHueRange: (start: number, end: number) => void;
    setSaturationRange: (start: number, end: number) => void;
    setValueRange: (start: number, end: number) => void;
    setRange: (start: number, end: number) => void;
    setAlphaRange: (start: number, end: number) => void;
    getColor: (scalar: number) => Point4;
    build: (force: boolean) => void;
    setTableValue(index: number, rgba: Point4): any;
}

declare type CPUFallbackLUT = {
    lut: number[];
};

declare type CPUFallbackRenderingTools = {
    renderCanvas?: HTMLCanvasElement;
    lastRenderedIsColor?: boolean;
    lastRenderedImageId?: string;
    lastRenderedViewport?: {
        windowWidth: number | number[];
        windowCenter: number | number[];
        invert: boolean;
        rotation: number;
        hflip: boolean;
        vflip: boolean;
        modalityLUT: CPUFallbackLUT;
        voiLUT: CPUFallbackLUT;
        colormap: unknown;
    };
    renderCanvasContext?: CanvasRenderingContext2D;
    colormapId?: string;
    colorLUT?: CPUFallbackLookupTable;
    renderCanvasData?: ImageData;
};

declare interface CPUFallbackTransform {
    reset: () => void;
    clone: () => CPUFallbackTransform;
    multiply: (matrix: TransformMatrix2D) => void;
    getMatrix: () => TransformMatrix2D;
    invert: () => void;
    rotate: (rad: number) => void;
    translate: (x: number, y: number) => void;
    scale: (sx: number, sy: number) => void;
    transformPoint: (point: Point2) => Point2;
}

declare type CPUFallbackViewport = {
    scale?: number;
    parallelScale?: number;
    focalPoint?: number[];
    translation?: {
        x: number;
        y: number;
    };
    voi?: {
        windowWidth: number;
        windowCenter: number;
    };
    invert?: boolean;
    pixelReplication?: boolean;
    rotation?: number;
    hflip?: boolean;
    vflip?: boolean;
    modalityLUT?: CPUFallbackLUT;
    voiLUT?: CPUFallbackLUT;
    colormap?: CPUFallbackColormap;
    displayedArea?: CPUFallbackViewportDisplayedArea;
    modality?: string;
};

declare type CPUFallbackViewportDisplayedArea = {
    tlhc: {
        x: number;
        y: number;
    };
    brhc: {
        x: number;
        y: number;
    };
    rowPixelSpacing: number;
    columnPixelSpacing: number;
    presentationSizeMode: string;
};

declare type CPUIImageData = {
    dimensions: Point3;
    direction: Mat3;
    spacing: Point3;
    origin: Point3;
    imageData: CPUImageData;
    metadata: {
        Modality: string;
    };
    scalarData: PixelDataTypedArray;
    scaling: Scaling;
    hasPixelSpacing?: boolean;
    calibration?: IImageCalibration;
    preScale?: {
        scaled?: boolean;
        scalingParameters?: {
            modality?: string;
            rescaleSlope?: number;
            rescaleIntercept?: number;
            suvbw?: number;
        };
    };
};

declare type CPUImageData = {
    worldToIndex?: (point: Point3) => Point3;
    indexToWorld?: (point: Point3) => Point3;
    getWorldToIndex?: () => Point3;
    getIndexToWorld?: () => Point3;
    getSpacing?: () => Point3;
    getDirection?: () => Mat3;
    getScalarData?: () => PixelDataTypedArray;
    getDimensions?: () => Point3;
};

declare function createAndCacheDerivedVolume(referencedVolumeId: string, options: DerivedVolumeOptions): Promise<ImageVolume>;

declare function createAndCacheGeometry(geometryId: string, options: GeometryOptions): Promise<IGeometry>;

declare function createAndCacheVolume(volumeId: string, options?: VolumeLoaderOptions): Promise<Record<string, any>>;

declare function createFloat32SharedArray(length: number): Float32Array;

declare function createInt16SharedArray(length: number): Int16Array;

declare function createLinearRGBTransferFunction(voiRange: VOIRange): vtkColorTransferFunction;

declare function createLocalVolume(options: LocalVolumeOptions, volumeId: string, preventCache?: boolean): ImageVolume;

declare function createSigmoidRGBTransferFunction(voiRange: VOIRange, approximationNodes?: number): vtkColorTransferFunction;

declare function createUint16SharedArray(length: number): Uint16Array;

declare function createUint8SharedArray(length: number): Uint8Array;

export declare function createVolumeActor(props: createVolumeActorInterface, element: HTMLDivElement, viewportId: string, suppressEvents?: boolean, useNativeDataType?: boolean): Promise<VolumeActor>;

declare interface createVolumeActorInterface {
    volumeId: string;
    callback?: ({ volumeActor, volumeId, }: {
        volumeActor: VolumeActor;
        volumeId: string;
    }) => void;
    blendMode?: BlendModes;
}

export declare function createVolumeMapper(imageData: any, vtkOpenGLTexture: any): any;

declare interface CustomEvent_2<T = any> extends Event {
    readonly detail: T;
    initCustomEvent(typeArg: string, canBubbleArg: boolean, cancelableArg: boolean, detailArg: T): void;
}

declare const deepMerge: (target?: {}, source?: {}, optionsArgument?: any) => any;

declare interface DerivedVolumeOptions {
    volumeId: string;
    targetBuffer?: {
        type: 'Float32Array' | 'Uint8Array' | 'Uint16Array' | 'Int16Array';
        sharedArrayBuffer?: boolean;
    };
}

declare type DisplayArea = {
    imageArea: [number, number];
    imageCanvasPoint: {
        imagePoint: [number, number];
        canvasPoint: [number, number];
    };
    storeAsInitialCamera: boolean;
};

declare type DisplayAreaModifiedEvent = CustomEvent_2<DisplayAreaModifiedEventDetail>;

declare type DisplayAreaModifiedEventDetail = {
    viewportId: string;
    displayArea: DisplayArea;
    volumeId?: string;
    storeAsInitialCamera?: boolean;
};

declare enum DynamicOperatorType {
    SUM = "SUM",
    AVERAGE = "AVERAGE",
    SUBTRACT = "SUBTRACT"
}

declare type ElementDisabledEvent = CustomEvent_2<ElementDisabledEventDetail>;

declare type ElementDisabledEventDetail = {
    element: HTMLDivElement;
    viewportId: string;
    renderingEngineId: string;
};

declare type ElementEnabledEvent = CustomEvent_2<ElementEnabledEventDetail>;

declare type ElementEnabledEventDetail = {
    element: HTMLDivElement;
    viewportId: string;
    renderingEngineId: string;
};

declare namespace Enums {
    export {
        EVENTS as Events,
        BlendModes,
        CalibrationTypes,
        InterpolationType,
        RequestType,
        ViewportType,
        OrientationAxis,
        SharedArrayBufferModes,
        GeometryType,
        ContourType,
        VOILUTFunctionType,
        DynamicOperatorType,
        ViewportStatus,
        VideoViewport_2 as VideoViewport
    }
}
export { Enums }

declare const EPSILON = 0.001;

declare namespace eventListener {
    export {
        TargetEventListeners,
        MultiTargetEventListenerManager
    }
}

export declare enum EVENTS {
    CACHE_SIZE_EXCEEDED = "CACHE_SIZE_EXCEEDED",
    IMAGE_LOAD_ERROR = "IMAGE_LOAD_ERROR",
    CAMERA_MODIFIED = "CORNERSTONE_CAMERA_MODIFIED",
    CAMERA_RESET = "CORNERSTONE_CAMERA_RESET",
    VOI_MODIFIED = "CORNERSTONE_VOI_MODIFIED",
    DISPLAY_AREA_MODIFIED = "CORNERSTONE_DISPLAY_AREA_MODIFIED",
    ELEMENT_DISABLED = "CORNERSTONE_ELEMENT_DISABLED",
    ELEMENT_ENABLED = "CORNERSTONE_ELEMENT_ENABLED",
    IMAGE_RENDERED = "CORNERSTONE_IMAGE_RENDERED",
    IMAGE_VOLUME_MODIFIED = "CORNERSTONE_IMAGE_VOLUME_MODIFIED",
    IMAGE_VOLUME_LOADING_COMPLETED = "CORNERSTONE_IMAGE_VOLUME_LOADING_COMPLETED",
    IMAGE_LOADED = "CORNERSTONE_IMAGE_LOADED",
    IMAGE_LOAD_FAILED = "CORNERSTONE_IMAGE_LOAD_FAILED",
    VOLUME_VIEWPORT_NEW_VOLUME = "CORNERSTONE_VOLUME_VIEWPORT_NEW_VOLUME",
    VOLUME_LOADED = "CORNERSTONE_VOLUME_LOADED",
    VOLUME_LOADED_FAILED = "CORNERSTONE_VOLUME_LOADED_FAILED",
    IMAGE_CACHE_IMAGE_ADDED = "CORNERSTONE_IMAGE_CACHE_IMAGE_ADDED",
    IMAGE_CACHE_IMAGE_REMOVED = "CORNERSTONE_IMAGE_CACHE_IMAGE_REMOVED",
    VOLUME_CACHE_VOLUME_ADDED = "CORNERSTONE_VOLUME_CACHE_VOLUME_ADDED",
    VOLUME_CACHE_VOLUME_REMOVED = "CORNERSTONE_VOLUME_CACHE_VOLUME_REMOVED",
    STACK_NEW_IMAGE = "CORNERSTONE_STACK_NEW_IMAGE",
    VOLUME_NEW_IMAGE = "CORNERSTONE_VOLUME_NEW_IMAGE",
    PRE_STACK_NEW_IMAGE = "CORNERSTONE_PRE_STACK_NEW_IMAGE",
    IMAGE_SPACING_CALIBRATED = "CORNERSTONE_IMAGE_SPACING_CALIBRATED",
    IMAGE_LOAD_PROGRESS = "CORNERSTONE_IMAGE_LOAD_PROGRESS",
    STACK_VIEWPORT_NEW_STACK = "CORNERSTONE_STACK_VIEWPORT_NEW_STACK",
    STACK_VIEWPORT_SCROLL = "CORNERSTONE_STACK_VIEWPORT_SCROLL",
    GEOMETRY_CACHE_GEOMETRY_ADDED = "CORNERSTONE_GEOMETRY_CACHE_GEOMETRY_ADDED",
    VOLUME_SCROLL_OUT_OF_BOUNDS = "CORNERSTONE_VOLUME_SCROLL_OUT_OF_BOUNDS",
    CLIPPING_PLANES_UPDATED = "CORNERSTONE_CLIPPING_PLANES_UPDATED"
}

export declare const eventTarget: CornerstoneEventTarget;

declare namespace EventTypes {
    export {
        CameraModifiedEventDetail,
        CameraModifiedEvent,
        VoiModifiedEvent,
        VoiModifiedEventDetail,
        DisplayAreaModifiedEvent,
        DisplayAreaModifiedEventDetail,
        ElementDisabledEvent,
        ElementDisabledEventDetail,
        ElementEnabledEvent,
        ElementEnabledEventDetail,
        ImageRenderedEventDetail,
        ImageRenderedEvent,
        ImageVolumeModifiedEvent,
        ImageVolumeModifiedEventDetail,
        ImageVolumeLoadingCompletedEvent,
        ImageVolumeLoadingCompletedEventDetail,
        ImageLoadedEvent,
        ImageLoadedEventDetail,
        ImageLoadedFailedEventDetail,
        ImageLoadedFailedEvent,
        VolumeLoadedEvent,
        VolumeLoadedEventDetail,
        VolumeLoadedFailedEvent,
        VolumeLoadedFailedEventDetail,
        ImageCacheImageAddedEvent,
        ImageCacheImageAddedEventDetail,
        ImageCacheImageRemovedEvent,
        ImageCacheImageRemovedEventDetail,
        VolumeCacheVolumeAddedEvent,
        VolumeCacheVolumeAddedEventDetail,
        VolumeCacheVolumeRemovedEvent,
        VolumeCacheVolumeRemovedEventDetail,
        StackNewImageEvent,
        StackNewImageEventDetail,
        PreStackNewImageEvent,
        PreStackNewImageEventDetail,
        ImageSpacingCalibratedEvent,
        ImageSpacingCalibratedEventDetail,
        ImageLoadProgressEvent,
        ImageLoadProgressEventDetail,
        VolumeNewImageEvent,
        VolumeNewImageEventDetail,
        StackViewportNewStackEvent,
        StackViewportNewStackEventDetail,
        StackViewportScrollEvent,
        StackViewportScrollEventDetail
    }
}

/**
 * Method use to decorate a given object (publicAPI+model) with vtkRenderer characteristics.
 *
 * @param publicAPI - object on which methods will be bounds (public)
 * @param model - object on which data structure will be bounds (protected)
 * @param initialValues -
 */
declare function extend(
publicAPI: any,
model: any,
initialValues?: ICameraInitialValues
): void;

declare type FlipDirection = {
    flipHorizontal?: boolean;
    flipVertical?: boolean;
};

declare namespace geometryLoader {
    export {
        createAndCacheGeometry
    }
}
export { geometryLoader }

declare type GeometryOptions = {
    type: GeometryType;
    geometryData: PublicContourSetData | PublicSurfaceData;
};

declare enum GeometryType {
    CONTOUR = "contour",
    SURFACE = "Surface"
}

declare function getClosestImageId(imageVolume: IImageVolume, worldPos: Point3, viewPlaneNormal: Point3): string;

declare function getClosestStackImageIndexForPoint(point: Point3, viewport: IStackViewport): number | null;

declare function getColormap(name: any): any;

declare function getColormapNames(): any[];

export declare function getConfiguration(): Cornerstone3DConfig;

export declare function getEnabledElement(element: HTMLDivElement | undefined): IEnabledElement | undefined;

export declare function getEnabledElementByIds(viewportId: string, renderingEngineId: string): IEnabledElement;

export declare function getEnabledElements(): IEnabledElement[];

declare function getImageLegacy(element: HTMLDivElement): Types.IImage | undefined;

declare function getImageSliceDataForVolumeViewport(viewport: IVolumeViewport): ImageSliceData;

declare function getMetaData(type: string, query: string): any;

declare function getMinMax(storedPixelData: number[]): {
    min: number;
    max: number;
};

export declare function getOrCreateCanvas(element: HTMLDivElement): HTMLCanvasElement;

export declare function getRenderingEngine(id: string): IRenderingEngine | undefined;

export declare function getRenderingEngines(): IRenderingEngine[] | undefined;

declare function getRuntimeId(context?: unknown, separator?: string, max?: number): string;

declare function getScalarDataType(scalingParameters: ScalingParameters, scalarData?: any): string;

declare function getScalingParameters(imageId: string): ScalingParameters;

export declare function getShouldUseCPURendering(): boolean;

export declare function getShouldUseSharedArrayBuffer(): boolean;

declare function getSliceRange(volumeActor: VolumeActor, viewPlaneNormal: Point3, focalPoint: Point3): ActorSliceRange;

declare function getSpacingInNormalDirection(imageVolume: IImageVolume | {
    direction: mat3;
    spacing: Point3;
}, viewPlaneNormal: Point3): number;

declare function getTargetVolumeAndSpacingInNormalDir(viewport: IVolumeViewport, camera: ICamera, targetVolumeId?: string): {
    imageVolume: IImageVolume;
    spacingInNormalDirection: number;
    actorUID: string;
};

declare function getTransferFunctionNodes(transferFunction: any): any[];

declare function getViewportImageCornersInWorld(viewport: IStackViewport | IVolumeViewport): Point3[];

declare function getViewportModality(viewport: IViewport, volumeId?: string): string;

declare function getViewportsWithImageURI(imageURI: string, renderingEngineId?: string): Array<Viewport_2>;

declare function getViewportsWithVolumeId(volumeId: string, renderingEngineId?: string): Array<IVolumeViewport>;

declare function getVoiFromSigmoidRGBTransferFunction(cfun: vtkColorTransferFunction): [number, number];

declare function getVolumeActorCorners(volumeActor: any): Array<Point3>;

declare function getVolumeLoaderSchemes(): string[];

declare function getVolumeSliceRangeInfo(viewport: IVolumeViewport, volumeId: string): {
    sliceRange: ActorSliceRange;
    spacingInNormalDirection: number;
    camera: ICamera;
};

declare function getVolumeViewportsContainingSameVolumes(targetViewport: IVolumeViewport, renderingEngineId?: string): Array<IVolumeViewport>;

declare function getVolumeViewportScrollInfo(viewport: IVolumeViewport, volumeId: string): {
    numScrollSteps: number;
    currentStepIndex: number;
    sliceRangeInfo: {
        sliceRange: ActorSliceRange;
        spacingInNormalDirection: number;
        camera: ICamera;
    };
};

declare function hasNaNValues(input: number[] | number): boolean;

declare interface ICache {
    setMaxCacheSize: (maxCacheSize: number) => void;
    getMaxCacheSize: () => number;
    getCacheSize: () => number;
    putImageLoadObject: (imageId: string, imageLoadObject: IImageLoadObject) => Promise<any>;
    getImageLoadObject: (imageId: string) => IImageLoadObject | void;
    putVolumeLoadObject: (volumeId: string, volumeLoadObject: IVolumeLoadObject) => Promise<any>;
    getVolumeLoadObject: (volumeId: string) => IVolumeLoadObject | void;
    purgeCache: () => void;
}

declare interface ICachedGeometry {
    geometryId: string;
    geometryLoadObject: IGeometryLoadObject;
    loaded: boolean;
    timeStamp: number;
    sizeInBytes: number;
    geometry?: IGeometry;
}

declare interface ICachedImage {
    image?: IImage;
    imageId: string;
    imageLoadObject: IImageLoadObject;
    loaded: boolean;
    sharedCacheKey?: string;
    timeStamp: number;
    sizeInBytes: number;
}

declare interface ICachedVolume {
    volume?: IImageVolume;
    volumeId: string;
    volumeLoadObject: IVolumeLoadObject;
    loaded: boolean;
    timeStamp: number;
    sizeInBytes: number;
}

declare interface ICamera {
    focalPoint?: Point3;
    parallelProjection?: boolean;
    parallelScale?: number;
    scale?: number;
    position?: Point3;
    viewAngle?: number;
    viewPlaneNormal?: Point3;
    viewUp?: Point3;
    flipHorizontal?: boolean;
    flipVertical?: boolean;
    clippingRange?: Point2;
}

/**
 *
 */
declare interface ICameraInitialValues {
    position?: number[];
    focalPoint?: number[];
    viewUp?: number[];
    directionOfProjection?: number[];
    parallelProjection?: boolean;
    useHorizontalViewAngle?: boolean;
    viewAngle?: number;
    parallelScale?: number;
    clippingRange?: number[];
    windowCenter?: number[];
    viewPlaneNormal?: number[];
    useOffAxisProjection?: boolean;
    screenBottomLeft?: number[];
    screenBottomRight?: number[];
    screenTopRight?: number[];
    freezeFocalPoint?: boolean;
    physicalTranslation?: number[];
    physicalScale?: number;
    physicalViewUp?: number[];
    physicalViewNorth?: number[];
}

declare interface IContour {
    readonly id: string;
    readonly sizeInBytes: number;
    points: Point3[];
    color: any;
    _getSizeInBytes(): number;
    getPoints(): Point3[];
    getColor(): Point3;
    getType(): ContourType;
    getFlatPointsArray(): number[];
}

declare interface IContourSet {
    readonly id: string;
    readonly sizeInBytes: number;
    readonly frameOfReferenceUID: string;
    contours: IContour[];
    _createEachContour(data: ContourData[]): void;
    getSizeInBytes(): number;
    getSegmentIndex(): number;
    getCentroid(): Point3;
    getColor(): any;
    getContours(): IContour[];
    getFlatPointsArray(): Point3[];
    getNumberOfContours(): number;
    getTotalNumberOfPoints(): number;
    getNumberOfPointsArray(): number[];
    getPointsInContour(contourIndex: number): Point3[];
    getNumberOfPointsInAContour(contourIndex: number): number;
}

declare interface IDynamicImageVolume extends IImageVolume {
    get timePointIndex(): number;
    set timePointIndex(newTimePointIndex: number);
    get numTimePoints(): number;
    getScalarDataArrays(): VolumeScalarData[];
}

declare interface IEnabledElement {
    viewport: IStackViewport | IVolumeViewport;
    renderingEngine: IRenderingEngine;
    viewportId: string;
    renderingEngineId: string;
    FrameOfReferenceUID: string;
}

declare interface IGeometry {
    id: string;
    type: GeometryType;
    data: IContourSet | Surface;
    sizeInBytes: number;
}

declare interface IGeometryLoadObject {
    promise: Promise<IGeometry>;
    cancelFn?: () => void;
    decache?: () => void;
}

declare interface IImage {
    imageId: string;
    sharedCacheKey?: string;
    isPreScaled?: boolean;
    preScale?: {
        scaled?: boolean;
        scalingParameters?: {
            modality?: string;
            rescaleSlope?: number;
            rescaleIntercept?: number;
            suvbw?: number;
        };
    };
    minPixelValue: number;
    maxPixelValue: number;
    slope: number;
    intercept: number;
    windowCenter: number[] | number;
    windowWidth: number[] | number;
    voiLUTFunction: string;
    getPixelData: () => PixelDataTypedArray;
    getCanvas: () => HTMLCanvasElement;
    rows: number;
    columns: number;
    height: number;
    width: number;
    color: boolean;
    rgba: boolean;
    numComps: number;
    render?: (enabledElement: CPUFallbackEnabledElement, invalidated: boolean) => unknown;
    columnPixelSpacing: number;
    rowPixelSpacing: number;
    sliceThickness?: number;
    invert: boolean;
    photometricInterpretation?: string;
    sizeInBytes: number;
    modalityLUT?: CPUFallbackLUT;
    voiLUT?: CPUFallbackLUT;
    colormap?: CPUFallbackColormap;
    scaling?: {
        PT?: {
            SUVlbmFactor?: number;
            SUVbsaFactor?: number;
            suvbwToSuvlbm?: number;
            suvbwToSuvbsa?: number;
        };
    };
    loadTimeInMS?: number;
    decodeTimeInMS?: number;
    stats?: {
        lastStoredPixelDataToCanvasImageDataTime?: number;
        lastGetPixelDataTime?: number;
        lastPutImageDataTime?: number;
        lastLutGenerateTime?: number;
        lastRenderedViewport?: unknown;
        lastRenderTime?: number;
    };
    cachedLut?: {
        windowWidth?: number | number[];
        windowCenter?: number | number[];
        invert?: boolean;
        lutArray?: Uint8ClampedArray;
        modalityLUT?: unknown;
        voiLUT?: CPUFallbackLUT;
    };
}

declare interface IImageCalibration {
    rowPixelSpacing?: number;
    columnPixelSpacing?: number;
    scale?: number;
    aspect?: number;
    type: CalibrationTypes;
    tooltip?: string;
    sequenceOfUltrasoundRegions?: Record<string, unknown>[];
}

declare interface IImageData {
    dimensions: Point3;
    direction: Mat3;
    spacing: Point3;
    origin: Point3;
    scalarData: Float32Array | Uint16Array | Uint8Array | Int16Array;
    imageData: vtkImageData;
    metadata: {
        Modality: string;
    };
    scaling?: Scaling;
    hasPixelSpacing?: boolean;
    calibration?: IImageCalibration;
    preScale?: {
        scaled?: boolean;
        scalingParameters?: {
            modality?: string;
            rescaleSlope?: number;
            rescaleIntercept?: number;
            suvbw?: number;
        };
    };
}

declare interface IImageLoadObject {
    promise: Promise<IImage>;
    cancelFn?: () => void;
    decache?: () => void;
}

declare interface IImageVolume {
    readonly volumeId: string;
    dimensions: Point3;
    direction: Mat3;
    metadata: Metadata;
    origin: Point3;
    isPreScaled: boolean;
    scaling?: {
        PT?: {
            SUVlbmFactor?: number;
            SUVbsaFactor?: number;
            suvbwToSuvlbm?: number;
            suvbwToSuvbsa?: number;
        };
    };
    sizeInBytes?: number;
    spacing: Point3;
    numVoxels: number;
    imageData?: vtkImageData;
    vtkOpenGLTexture: any;
    loadStatus?: Record<string, any>;
    imageIds: Array<string>;
    referencedVolumeId?: string;
    hasPixelSpacing: boolean;
    isDynamicVolume(): boolean;
    convertToCornerstoneImage?: (imageId: string, imageIdIndex: number) => IImageLoadObject;
    cancelLoading?: () => void;
    getScalarData(): VolumeScalarData;
    getImageIdIndex(imageId: string): number;
    getImageURIIndex(imageURI: string): number;
    destroy(): void;
}

declare type ImageActor = vtkImageSlice;

declare type ImageCacheImageAddedEvent = CustomEvent_2<ImageCacheImageAddedEventDetail>;

declare type ImageCacheImageAddedEventDetail = {
    image: ICachedImage;
};

declare type ImageCacheImageRemovedEvent = CustomEvent_2<ImageCacheImageRemovedEventDetail>;

declare type ImageCacheImageRemovedEventDetail = {
    imageId: string;
};

declare function imageIdToURI(imageId: string): string;

declare type ImageLoadedEvent = CustomEvent_2<ImageLoadedEventDetail>;

declare type ImageLoadedEventDetail = {
    image: IImage;
};

declare type ImageLoadedFailedEvent = CustomEvent_2<ImageLoadedFailedEventDetail>;

declare type ImageLoadedFailedEventDetail = {
    imageId: string;
    error: unknown;
};

declare namespace imageLoader {
    export {
        loadImage,
        loadAndCacheImage,
        loadAndCacheImages,
        cancelLoadImage,
        cancelLoadImages,
        cancelLoadAll,
        registerImageLoader,
        registerUnknownImageLoader,
        unregisterAllImageLoaders,
        ImageLoaderOptions
    }
}
export { imageLoader }

declare type ImageLoaderFn = (imageId: string, options?: Record<string, any>) => {
    promise: Promise<Record<string, any>>;
    cancelFn?: () => void | undefined;
    decache?: () => void | undefined;
};

declare interface ImageLoaderOptions {
    priority: number;
    requestType: string;
    additionalDetails?: Record<string, unknown>;
}

declare const imageLoadPoolManager: RequestPoolManager;
export { imageLoadPoolManager }
export { imageLoadPoolManager as requestPoolManager }

declare type ImageLoadProgressEvent = CustomEvent_2<ImageLoadProgressEventDetail>;

declare type ImageLoadProgressEventDetail = {
    url: string;
    imageId: string;
    loaded: number;
    total: number;
    percent: number;
};

declare interface ImagePixelModule {
    bitsAllocated: number;
    bitsStored: number;
    samplesPerPixel: number;
    highBit: number;
    photometricInterpretation: string;
    pixelRepresentation: string;
    windowWidth: number | number[];
    windowCenter: number | number[];
    voiLUTFunction: VOILUTFunctionType;
    modality: string;
}

declare interface ImagePlaneModule {
    columnCosines?: Point3;
    columnPixelSpacing?: number;
    imageOrientationPatient?: Float32Array;
    imagePositionPatient?: Point3;
    pixelSpacing?: Point2;
    rowCosines?: Point3;
    rowPixelSpacing?: number;
    sliceLocation?: number;
    sliceThickness?: number;
    frameOfReferenceUID: string;
    columns: number;
    rows: number;
}

declare type ImageRenderedEvent = CustomEvent_2<ElementEnabledEventDetail>;

declare type ImageRenderedEventDetail = {
    element: HTMLDivElement;
    viewportId: string;
    renderingEngineId: string;
    suppressEvents?: boolean;
    viewportStatus: ViewportStatus;
};

export declare const imageRetrievalPoolManager: RequestPoolManager;

declare type ImageSliceData = {
    numberOfSlices: number;
    imageIndex: number;
};

declare type ImageSpacingCalibratedEvent = CustomEvent_2<ImageSpacingCalibratedEventDetail>;

declare type ImageSpacingCalibratedEventDetail = {
    element: HTMLDivElement;
    viewportId: string;
    renderingEngineId: string;
    imageId: string;
    calibration: IImageCalibration;
    imageData: vtkImageData;
    worldToIndex: mat4;
};

declare function imageToWorldCoords(imageId: string, imageCoords: Point2): Point3 | undefined;

export declare class ImageVolume implements IImageVolume {
    private _imageIds;
    private _imageIdsIndexMap;
    private _imageURIsIndexMap;
    protected scalarData: VolumeScalarData | Array<VolumeScalarData>;
    readonly volumeId: string;
    isPreScaled: boolean;
    dimensions: Point3;
    direction: Mat3;
    metadata: Metadata;
    origin: Point3;
    scaling?: {
        PT?: {
            SUVlbmFactor?: number;
            SUVbsaFactor?: number;
            suvbwToSuvlbm?: number;
            suvbwToSuvbsa?: number;
        };
    };
    sizeInBytes?: number;
    spacing: Point3;
    numVoxels: number;
    imageData?: vtkImageData;
    vtkOpenGLTexture: any;
    loadStatus?: Record<string, any>;
    referencedVolumeId?: string;
    hasPixelSpacing: boolean;
    constructor(props: IVolume);
    get imageIds(): Array<string>;
    set imageIds(newImageIds: Array<string>);
    private _reprocessImageIds;
    cancelLoading: () => void;
    isDynamicVolume(): boolean;
    getScalarData(): VolumeScalarData;
    getImageIdIndex(imageId: string): number;
    getImageURIIndex(imageURI: string): number;
    destroy(): void;
}

declare type ImageVolumeLoadingCompletedEvent = CustomEvent_2<ImageVolumeLoadingCompletedEventDetail>;

declare type ImageVolumeLoadingCompletedEventDetail = {
    volumeId: string;
    FrameOfReferenceUID: string;
};

declare type ImageVolumeModifiedEvent = CustomEvent_2<ImageVolumeModifiedEventDetail>;

declare type ImageVolumeModifiedEventDetail = {
    imageVolume: IImageVolume;
    FrameOfReferenceUID: string;
};

declare function indexWithinDimensions(index: Point3, dimensions: Point3): boolean;

export declare function init(configuration?: Cornerstone3DConfig): Promise<boolean>;

declare type InternalVideoCamera = {
    panWorld?: Point2;
    parallelScale?: number;
};

declare enum InterpolationType {
    NEAREST = 0,
    LINEAR = 1,
    FAST_LINEAR = 2
}

declare function invertRgbTransferFunction(rgbTransferFunction: any): void;

declare interface IRegisterImageLoader {
    registerImageLoader: (scheme: string, imageLoader: ImageLoaderFn) => void;
}

declare interface IRenderingEngine {
    id: string;
    hasBeenDestroyed: boolean;
    offscreenMultiRenderWindow: any;
    offScreenCanvasContainer: any;
    setViewports(viewports: Array<PublicViewportInput>): void;
    resize(immediate?: boolean, keepCamera?: boolean): void;
    getViewport(id: string): IViewport;
    getViewports(): Array<IViewport>;
    render(): void;
    renderViewports(viewportIds: Array<string>): void;
    renderViewport(viewportId: string): void;
    renderFrameOfReference(FrameOfReferenceUID: string): void;
    fillCanvasWithBackgroundColor(canvas: HTMLCanvasElement, backgroundColor: [number, number, number]): void;
    enableElement(viewportInputEntry: PublicViewportInput): void;
    disableElement(viewportId: string): void;
    getStackViewports(): Array<IStackViewport>;
    getVolumeViewports(): Array<IVolumeViewport>;
    getVideoViewports(): Array<IVideoViewport>;
    destroy(): void;
    _debugRender(): void;
}

export declare function isCornerstoneInitialized(): boolean;

declare function isEqual<ValueType>(v1: ValueType, v2: ValueType, tolerance?: number): boolean;

declare function isImageActor(actorEntry: Types.ActorEntry): boolean;

declare function isOpposite(v1: Point3, v2: Point3, tolerance?: number): boolean;

declare const isPTPrescaledWithSUV: (image: IImage) => number;

declare interface IStackViewport extends IViewport {
    modality: string;
    scaling: Scaling;
    resize: () => void;
    getFrameOfReferenceUID: () => string;
    setDefaultProperties(ViewportProperties: StackViewportProperties, imageId?: string): void;
    clearDefaultProperties(imageId?: string): void;
    setProperties({ voiRange, invert, interpolationType, rotation, colormap, }: StackViewportProperties, suppressEvents?: boolean): void;
    getDefaultProperties: (imageId?: string) => StackViewportProperties;
    getProperties: () => StackViewportProperties;
    canvasToWorld: (canvasPos: Point2) => Point3;
    worldToCanvas: (worldPos: Point3) => Point2;
    getCurrentImageIdIndex: () => number;
    getImageIds: () => string[];
    hasImageId: (imageId: string) => boolean;
    hasImageURI: (imageURI: string) => boolean;
    getCurrentImageId: () => string;
    customRenderViewportToCanvas: () => {
        canvas: HTMLCanvasElement;
        element: HTMLDivElement;
        viewportId: string;
        renderingEngineId: string;
    };
    getImageData(): IImageData | CPUIImageData;
    getCornerstoneImage: () => IImage;
    resetToDefaultProperties(): void;
    resetProperties(): void;
    getCamera(): ICamera;
    setCamera(cameraInterface: ICamera): void;
    setStack(imageIds: Array<string>, currentImageIdIndex?: number): Promise<string>;
    resetCamera(resetPan?: boolean, resetZoom?: boolean): boolean;
    setImageIdIndex(imageIdIndex: number): Promise<string>;
    calibrateSpacing(imageId: string): void;
    getRenderer(): any;
    unsetColormap(): void;
}

declare interface IStreamingImageVolume extends ImageVolume {
    clearLoadCallbacks(): void;
    convertToCornerstoneImage(imageId: string, imageIdIndex: number): any;
    decache(completelyRemove: boolean): void;
}

declare interface IStreamingVolumeProperties {
    imageIds: Array<string>;
    loadStatus: {
        loaded: boolean;
        loading: boolean;
        cancelled: boolean;
        cachedFrames: Array<boolean>;
        callbacks: Array<() => void>;
    };
}

declare interface IVideoViewport extends IViewport {
    resize: () => void;
    setProperties(props: VideoViewportProperties, suppressEvents?: boolean): void;
    getProperties: () => VideoViewportProperties;
    setVideoURL: (url: string) => void;
    play: () => void;
    pause: () => void;
    resetProperties(): void;
    resetCamera(resetPan?: boolean, resetZoom?: boolean): boolean;
}

declare interface IViewport {
    id: string;
    renderingEngineId: string;
    type: ViewportType;
    canvas: HTMLCanvasElement;
    element: HTMLDivElement;
    sx: number;
    sy: number;
    sWidth: number;
    sHeight: number;
    _actors: Map<string, any>;
    defaultOptions: any;
    options: ViewportInputOptions;
    suppressEvents: boolean;
    isDisabled: boolean;
    viewportStatus: ViewportStatus;
    getRotation: () => number;
    getFrameOfReferenceUID: () => string;
    canvasToWorld: (canvasPos: Point2) => Point3;
    worldToCanvas: (worldPos: Point3) => Point2;
    getDefaultActor(): ActorEntry;
    getActors(): Array<ActorEntry>;
    getActor(actorUID: string): ActorEntry;
    getActorUIDByIndex(index: number): string;
    getActorByIndex(index: number): ActorEntry;
    setActors(actors: Array<ActorEntry>): void;
    addActors(actors: Array<ActorEntry>): void;
    addActor(actorEntry: ActorEntry): void;
    removeAllActors(): void;
    removeActors(actorUIDs: Array<string>): void;
    getRenderingEngine(): any;
    getRenderer(): void;
    render(): void;
    setOptions(options: ViewportInputOptions, immediate: boolean): void;
    setDisplayArea(displayArea: DisplayArea, callResetCamera?: boolean, suppressEvents?: boolean): any;
    getDisplayArea(): DisplayArea | undefined;
    reset(immediate: boolean): void;
    getCanvas(): HTMLCanvasElement;
    getCamera(): ICamera;
    setRendered(): void;
    getZoom(): number;
    setZoom(zoom: number, storeAsInitialCamera?: boolean): any;
    getPan(): Point2;
    setPan(pan: Point2, storeAsInitialCamera?: boolean): any;
    setCamera(cameraInterface: ICamera, storeAsInitialCamera?: boolean): void;
    customRenderViewportToCanvas: () => unknown;
    _getCorners(bounds: Array<number>): Array<number>[];
    updateRenderingPipeline: () => void;
}

declare interface IViewportId {
    renderingEngineId: string;
    viewportId: string;
}

declare interface IVolume {
    volumeId: string;
    metadata: Metadata;
    dimensions: Point3;
    spacing: Point3;
    origin: Point3;
    direction: Mat3;
    scalarData: VolumeScalarData | Array<VolumeScalarData>;
    sizeInBytes?: number;
    imageData?: vtkImageData;
    referencedVolumeId?: string;
    scaling?: {
        PT?: {
            SUVlbmFactor?: number;
            SUVbsaFactor?: number;
            suvbwToSuvlbm?: number;
            suvbwToSuvbsa?: number;
        };
    };
}

declare interface IVolumeInput {
    volumeId: string;
    actorUID?: string;
    visibility?: boolean;
    callback?: VolumeInputCallback;
    blendMode?: BlendModes;
    slabThickness?: number;
}

declare interface IVolumeLoadObject {
    promise: Promise<ImageVolume>;
    cancelFn?: () => void;
    decache?: () => void;
}

declare interface IVolumeViewport extends IViewport {
    useCPURendering: boolean;
    getFrameOfReferenceUID: () => string;
    getDefaultProperties: (volumeId?: string) => VolumeViewportProperties;
    getProperties: (volumeId?: string) => VolumeViewportProperties;
    canvasToWorld: (canvasPos: Point2) => Point3;
    worldToCanvas: (worldPos: Point3) => Point2;
    getImageIds: (volumeId?: string) => string[];
    getCurrentImageIdIndex: () => number;
    hasVolumeId: (volumeId: string) => boolean;
    hasImageURI: (imageURI: string) => boolean;
    getCurrentImageId: () => string;
    setDefaultProperties(ViewportProperties: VolumeViewportProperties, volumeId?: string): void;
    clearDefaultProperties(volumeId?: string): void;
    setProperties({ voiRange }: VolumeViewportProperties, volumeId?: string, suppressEvents?: boolean): void;
    resetProperties(volumeId: string): void;
    setVolumes(volumeInputArray: Array<IVolumeInput>, immediate?: boolean, suppressEvents?: boolean): Promise<void>;
    addVolumes(volumeInputArray: Array<IVolumeInput>, immediate?: boolean, suppressEvents?: boolean): Promise<void>;
    removeVolumeActors(actorUIDs: Array<string>, immediate?: boolean): void;
    getIntensityFromWorld(point: Point3): number;
    getBounds(): any;
    flip(flipDirection: FlipDirection): void;
    resetCamera(resetPan?: boolean, resetZoom?: boolean, resetToCenter?: boolean): boolean;
    setBlendMode(blendMode: BlendModes, filterActorUIDs?: Array<string>, immediate?: boolean): void;
    setSlabThickness(slabThickness: number, filterActorUIDs?: Array<string>): void;
    getSlabThickness(): number;
    getImageData(volumeId?: string): IImageData | undefined;
    setOrientation(orientation: OrientationAxis): void;
}

declare function linePlaneIntersection(p0: Point3, p1: Point3, plane: Plane): Point3;

declare function loadAndCacheImage(imageId: string, options?: ImageLoaderOptions): Promise<IImage>;

declare function loadAndCacheImages(imageIds: Array<string>, options?: ImageLoaderOptions): Promise<IImage>[];

declare function loadImage(imageId: string, options?: ImageLoaderOptions): Promise<IImage>;

declare interface LoadImageOptions {
    canvas: HTMLCanvasElement;
    imageId: string;
    requestType?: RequestType;
    priority?: number;
    renderingEngineId?: string;
    useCPURendering?: boolean;
}

declare function loadImageToCanvas(options: LoadImageOptions): Promise<string>;

declare function loadVolume(volumeId: string, options?: VolumeLoaderOptions): Promise<Types.IImageVolume>;

declare interface LocalVolumeOptions {
    scalarData: Float32Array | Uint8Array | Uint16Array | Int16Array;
    metadata: Metadata;
    dimensions: Point3;
    spacing: Point3;
    origin: Point3;
    direction: Mat3;
}

declare type Mat3 = [number, number, number, number, number, number, number, number, number] | Float32Array;

declare type Metadata = {
    BitsAllocated: number;
    BitsStored: number;
    SamplesPerPixel: number;
    HighBit: number;
    PhotometricInterpretation: string;
    PixelRepresentation: number;
    Modality: string;
    SeriesInstanceUID?: string;
    ImageOrientationPatient: Array<number>;
    PixelSpacing: Array<number>;
    FrameOfReferenceUID: string;
    Columns: number;
    Rows: number;
    voiLut: Array<VOI>;
    VOILUTFunction: string;
};

declare namespace metaData {
    export {
        addProvider,
        removeProvider,
        removeAllProviders,
        getMetaData as get
    }
}
export { metaData }

declare const metadataProvider: {
    add: (imageId: string, payload: IImageCalibration) => void;
    get: (type: string, imageId: string) => IImageCalibration;
};

declare const mprCameraValues: any;

declare class MultiTargetEventListenerManager {
    private _targetsEventListeners;
    addEventListener(target: EventTarget, type: string, callback: EventListener, options?: AddEventListenerOptions): void;
    removeEventListener(target: EventTarget, type: string, callback?: EventListener, options?: EventListenerOptions): void;
    reset(): void;
}

/**
 * Method use to create a new instance of vtkCamera with its focal point at the origin,
 * and position=(0,0,1). The view up is along the y-axis, view angle is 30 degrees,
 * and the clipping range is (.1,1000).
 * @param initialValues - for pre-setting some of its content
 */
declare function newInstance(
initialValues?: ICameraInitialValues
): vtkSlabCamera;

declare type OpacityMapping = {
    value: number;
    opacity: number;
};

declare enum OrientationAxis {
    AXIAL = "axial",
    CORONAL = "coronal",
    SAGITTAL = "sagittal",
    ACQUISITION = "acquisition"
}

declare type OrientationVectors = {
    viewPlaneNormal: Point3;
    viewUp: Point3;
};

declare type PixelDataTypedArray = Float32Array | Int16Array | Uint16Array | Uint8Array | Int8Array | Uint8ClampedArray;

declare namespace planar {
    export {
        linePlaneIntersection,
        planeEquation,
        threePlaneIntersection,
        planeDistanceToPoint
    }
}

declare type Plane = [number, number, number, number];

declare function planeDistanceToPoint(plane: Plane, point: Point3, signed?: boolean): number;

declare function planeEquation(normal: Point3, point: Point3 | vec3): Plane;

declare type Point2 = [number, number];

declare type Point3 = [number, number, number];

declare type Point4 = [number, number, number, number];

declare const presets: ViewportPreset[];

declare type PreStackNewImageEvent = CustomEvent_2<PreStackNewImageEventDetail>;

declare type PreStackNewImageEventDetail = {
    imageId: string;
    imageIdIndex: number;
    viewportId: string;
    renderingEngineId: string;
};

declare type PTScaling = {
    suvbwToSuvlbm?: number;
    suvbwToSuvbsa?: number;
    suvbw?: number;
    suvlbm?: number;
    suvbsa?: number;
};

declare type PublicContourSetData = ContourSetData;

declare type PublicSurfaceData = {
    id: string;
    data: SurfaceData;
    frameOfReferenceUID: string;
    color?: Point3;
};

declare type PublicViewportInput = {
    element: HTMLDivElement;
    viewportId: string;
    type: ViewportType;
    defaultOptions?: ViewportInputOptions;
};

declare function registerColormap(colormap: ColormapRegistration): void;

export declare function registerImageLoader(scheme: string, imageLoader: ImageLoaderFn): void;

declare function registerUnknownImageLoader(imageLoader: ImageLoaderFn): ImageLoaderFn;

declare function registerUnknownVolumeLoader(volumeLoader: Types.VolumeLoaderFn): Types.VolumeLoaderFn | undefined;

declare function registerVolumeLoader(scheme: string, volumeLoader: Types.VolumeLoaderFn): void;

declare function removeAllProviders(): void;

declare function removeProvider(provider: (type: string, query: any) => {
    any: any;
}): void;

declare const RENDERING_DEFAULTS: {
    MINIMUM_SLAB_THICKNESS: number;
    MAXIMUM_RAY_DISTANCE: number;
};

export declare class RenderingEngine implements IRenderingEngine {
    readonly id: string;
    hasBeenDestroyed: boolean;
    offscreenMultiRenderWindow: any;
    readonly offScreenCanvasContainer: any;
    private _viewports;
    private _needsRender;
    private _animationFrameSet;
    private _animationFrameHandle;
    private useCPURendering;
    constructor(id?: string);
    enableElement(viewportInputEntry: PublicViewportInput): void;
    disableElement(viewportId: string): void;
    setViewports(publicViewportInputEntries: Array<PublicViewportInput>): void;
    resize(immediate?: boolean, keepCamera?: boolean): void;
    getViewport(viewportId: string): IViewport;
    getViewports(): Array<IViewport>;
    getStackViewports(): Array<IStackViewport>;
    getVideoViewports(): Array<IVideoViewport>;
    getVolumeViewports(): Array<IVolumeViewport>;
    render(): void;
    renderFrameOfReference: (FrameOfReferenceUID: string) => void;
    renderViewports(viewportIds: Array<string>): void;
    renderViewport(viewportId: string): void;
    destroy(): void;
    fillCanvasWithBackgroundColor(canvas: HTMLCanvasElement, backgroundColor: [number, number, number]): void;
    private _normalizeViewportInputEntry;
    private _normalizeViewportInputEntries;
    private _resizeUsingCustomResizeHandler;
    private _resizeVTKViewports;
    private enableVTKjsDrivenViewport;
    private _removeViewport;
    private addVtkjsDrivenViewport;
    private addCustomViewport;
    private setCustomViewports;
    private setVtkjsDrivenViewports;
    private _resizeOffScreenCanvas;
    private _resize;
    private _getViewportCoordsOnOffScreenCanvas;
    private _getViewportsAsArray;
    private _setViewportsToBeRenderedNextFrame;
    private _render;
    private _renderFlaggedViewports;
    private performVtkDrawCall;
    private renderViewportUsingCustomOrVtkPipeline;
    private _renderViewportFromVtkCanvasToOnscreenCanvas;
    private _resetViewport;
    private _clearAnimationFrame;
    private _reset;
    private _throwIfDestroyed;
    _downloadOffScreenCanvas(): void;
    _debugRender(): void;
}

declare function renderToCanvasCPU(canvas: HTMLCanvasElement, image: IImage, modality?: string, renderingEngineId?: string): Promise<string>;

declare function renderToCanvasGPU(canvas: HTMLCanvasElement, image: IImage, modality?: any, renderingEngineId?: string): Promise<string>;

declare type RequestDetailsInterface = {
    requestFn: () => Promise<IImage | void>;
    type: RequestType;
    additionalDetails: AdditionalDetails;
};

declare type RequestPool = {
    [name in RequestType]: {
        [key: number]: RequestDetailsInterface[];
    };
};

declare class RequestPoolManager {
    private id;
    private awake;
    private requestPool;
    private numRequests;
    maxNumRequests: {
        interaction: number;
        thumbnail: number;
        prefetch: number;
    };
    grabDelay: number;
    private timeoutHandle;
    constructor(id?: string);
    setMaxSimultaneousRequests(type: RequestType, maxNumRequests: number): void;
    getMaxSimultaneousRequests(type: RequestType): number;
    destroy(): void;
    addRequest(requestFn: () => Promise<IImage | void>, type: RequestType, additionalDetails: Record<string, unknown>, priority?: number): void;
    filterRequests(filterFunction: (requestDetails: RequestDetailsInterface) => boolean): void;
    clearRequestStack(type: string): void;
    private sendRequests;
    private getNextRequest;
    protected startGrabbing(): void;
    protected startAgain(): void;
    protected getSortedPriorityGroups(type: string): Array<number>;
    getRequestPool(): RequestPool;
}

declare enum RequestType {
    Interaction = "interaction",
    Thumbnail = "thumbnail",
    Prefetch = "prefetch"
}

export declare function resetUseCPURendering(): void;

export declare function resetUseSharedArrayBuffer(): void;

declare type RGB = [number, number, number];

declare function scaleRGBTransferFunction(rgbTransferFunction: any, scalingFactor: number): void;

declare type Scaling = {
    PT?: PTScaling;
};

declare type ScalingParameters = {
    rescaleSlope: number;
    rescaleIntercept: number;
    modality: string;
    suvbw?: number;
    suvlbm?: number;
    suvbsa?: number;
};

export declare function setConfiguration(c: Cornerstone3DConfig): void;

export declare function setPreferSizeOverAccuracy(status: boolean): void;

export declare class Settings {
    constructor(base?: Settings);
    set(key: string, value: unknown): boolean;
    get(key: string): unknown;
    unset(key: string): boolean;
    forEach(callback: (key: string, value: unknown) => void): void;
    extend(): Settings;
    import(root: Record<string, unknown>): void;
    dump(): Record<string, unknown>;
    static assert(subject: Settings): Settings;
    static getDefaultSettings(subfield?: any): Settings | any;
    static getRuntimeSettings(): Settings;
    static getObjectSettings(subject: unknown, from?: unknown): Settings;
    static extendRuntimeSettings(): Settings;
}

declare function setTransferFunctionNodes(transferFunction: any, nodes: any): void;

export declare function setUseCPURendering(status: boolean): void;

export declare function setUseSharedArrayBuffer(mode: SharedArrayBufferModes | boolean): void;

export declare function setVolumesForViewports(renderingEngine: IRenderingEngine, volumeInputs: Array<IVolumeInput>, viewportIds: Array<string>, immediateRender?: boolean, suppressEvents?: boolean): Promise<void>;

declare enum SharedArrayBufferModes {
    TRUE = "true",
    FALSE = "false",
    AUTO = "auto"
}

declare function snapFocalPointToSlice(focalPoint: Point3, position: Point3, sliceRange: ActorSliceRange, viewPlaneNormal: Point3, spacingInNormalDirection: number, deltaFrames: number): {
    newFocalPoint: Point3;
    newPosition: Point3;
};

declare const spatialRegistrationMetadataProvider: {
    add: (query: string[], payload: mat4) => void;
    get: (type: string, query: string[]) => mat4;
};

declare enum SpeedUnit {
    FRAME = "f",
    SECOND = "s"
}

declare type StackNewImageEvent = CustomEvent_2<StackNewImageEventDetail>;

declare type StackNewImageEventDetail = {
    image: IImage;
    imageId: string;
    imageIdIndex: number;
    viewportId: string;
    renderingEngineId: string;
};

export declare class StackViewport extends Viewport implements IStackViewport {
    private imageIds;
    private currentImageIdIndex;
    private targetImageIdIndex;
    private debouncedTimeout;
    private globalDefaultProperties;
    private perImageIdDefaultProperties;
    private colormap;
    private voiRange;
    private voiUpdatedWithSetProperties;
    private VOILUTFunction;
    private invert;
    private initialInvert;
    private initialTransferFunctionNodes;
    private interpolationType;
    private _imageData;
    private cameraFocalPointOnRender;
    private stackInvalidated;
    private _publishCalibratedEvent;
    private _calibrationEvent;
    private _cpuFallbackEnabledElement?;
    private useCPURendering;
    private useNativeDataType;
    private cpuImagePixelData;
    private cpuRenderingInvalidated;
    private csImage;
    modality: string;
    scaling: Scaling;
    private initialViewUp;
    constructor(props: ViewportInput);
    setUseCPURendering(value: boolean): void;
    static get useCustomRenderingPipeline(): boolean;
    updateRenderingPipeline: () => void;
    private _configureRenderingPipeline;
    private _resetCPUFallbackElement;
    private _resetGPUViewport;
    getImageData: () => IImageData | CPUIImageData;
    getCamera: () => ICamera;
    setCamera: (cameraInterface: ICamera, storeAsInitialCamera?: boolean) => void;
    getRotation: () => number;
    unsetColormap: () => void;
    resetCamera: (resetPan?: boolean, resetZoom?: boolean) => boolean;
    canvasToWorld: (canvasPos: Point2) => Point3;
    worldToCanvas: (worldPos: Point3) => Point2;
    getRenderer: () => any;
    getDefaultActor: () => ActorEntry;
    getActors: () => Array<ActorEntry>;
    getActor: (actorUID: string) => ActorEntry;
    setActors: (actors: Array<ActorEntry>) => void;
    addActors: (actors: Array<ActorEntry>) => void;
    addActor: (actorEntry: ActorEntry) => void;
    removeAllActors: () => void;
    private setVOI;
    private setInterpolationType;
    private setInvertColor;
    private setColormap;
    private initializeElementDisabledHandler;
    resize: () => void;
    private _resizeCPU;
    private getImageDataGPU;
    private getImageDataCPU;
    getFrameOfReferenceUID: () => string | undefined;
    getCornerstoneImage: () => IImage;
    private createActorMapper;
    private buildMetadata;
    private calibrateIfNecessary;
    setDefaultProperties(ViewportProperties: StackViewportProperties, imageId?: string): void;
    clearDefaultProperties(imageId?: string): void;
    setProperties({ colormap, voiRange, VOILUTFunction, invert, interpolationType, rotation, }?: StackViewportProperties, suppressEvents?: boolean): void;
    getDefaultProperties: (imageId?: string) => StackViewportProperties;
    getProperties: () => StackViewportProperties;
    resetProperties(): void;
    private _resetProperties;
    resetToDefaultProperties(): void;
    private _setPropertiesFromCache;
    private getCameraCPU;
    private setCameraCPU;
    private setFlipCPU;
    private getRotationCPU;
    private getRotationGPU;
    private setRotation;
    private setVOILUTFunction;
    private setRotationCPU;
    private setRotationGPU;
    private setInterpolationTypeGPU;
    private setInterpolationTypeCPU;
    private setInvertColorCPU;
    private setInvertColorGPU;
    private setVOICPU;
    private getTransferFunction;
    private setVOIGPU;
    private _addScalingToViewport;
    private _getNumCompsFromPhotometricInterpretation;
    private _getImageDataMetadata;
    private _getCameraOrientation;
    private _createVTKImageData;
    setStack(imageIds: Array<string>, currentImageIdIndex?: number): Promise<string>;
    private _throwIfDestroyed;
    private _checkVTKImageDataMatchesCornerstoneImage;
    private _updateVTKImageDataFromCornerstoneImage;
    private _updatePixelData;
    private _loadAndDisplayImage;
    private _loadAndDisplayImageCPU;
    private _loadAndDisplayImageGPU;
    renderImageObject: (image: any) => void;
    private _setCSImage;
    private _updateToDisplayImageCPU;
    private _updateActorToDisplayImageId;
    private _getInitialVOIRange;
    private _getPTPreScaledRange;
    private _isCurrentImagePTPrescaled;
    private _getDefaultPTPrescaledVOIRange;
    private _getVOIRangeFromWindowLevel;
    private _setImageIdIndex;
    private resetCameraCPU;
    private resetCameraGPU;
    scroll(delta: number, debounce?: boolean, loop?: boolean): void;
    setImageIdIndex(imageIdIndex: number): Promise<string>;
    calibrateSpacing(imageId: string): void;
    private _restoreCameraProps;
    private triggerCameraEvent;
    private triggerCalibrationEvent;
    private canvasToWorldCPU;
    private worldToCanvasCPU;
    private canvasToWorldGPU;
    private worldToCanvasGPU;
    private _getVOIRangeForCurrentImage;
    private _getValidVOILUTFunction;
    getCurrentImageIdIndex: () => number;
    getTargetImageIdIndex: () => number;
    getImageIds: () => Array<string>;
    getCurrentImageId: () => string;
    hasImageId: (imageId: string) => boolean;
    hasImageURI: (imageURI: string) => boolean;
    private getCPUFallbackError;
    private fillWithBackgroundColor;
    customRenderViewportToCanvas: () => {
        canvas: HTMLCanvasElement;
        element: HTMLDivElement;
        viewportId: string;
        renderingEngineId: string;
        viewportStatus: ViewportStatus;
    };
    private unsetColormapCPU;
    private setColormapCPU;
    private setColormapGPU;
    private unsetColormapGPU;
    private _getImagePlaneModule;
    private renderingPipelineFunctions;
}

declare type StackViewportNewStackEvent = CustomEvent_2<StackViewportNewStackEventDetail>;

declare type StackViewportNewStackEventDetail = {
    imageIds: string[];
    viewportId: string;
    element: HTMLDivElement;
    currentImageIdIndex: number;
};

declare type StackViewportProperties = ViewportProperties & {
    interpolationType?: InterpolationType;
    rotation?: number;
    suppressEvents?: boolean;
    isComputedVOI?: boolean;
};

declare type StackViewportScrollEvent = CustomEvent_2<StackViewportScrollEventDetail>;

declare type StackViewportScrollEventDetail = {
    newImageIdIndex: number;
    imageId: string;
    direction: number;
};

declare class Surface {
    readonly id: string;
    readonly sizeInBytes: number;
    readonly frameOfReferenceUID: string;
    private color;
    private points;
    private polys;
    constructor(props: SurfaceProps);
    _getSizeInBytes(): number;
    getColor(): Point3;
    getPoints(): number[];
    getPolys(): number[];
    getSizeInBytes(): number;
}

declare type SurfaceData = {
    points: number[];
    polys: number[];
};

declare type SurfaceProps = {
    id: string;
    data: SurfaceData;
    frameOfReferenceUID: string;
    color?: Point3;
};

declare class TargetEventListeners {
    private _target;
    private _eventListeners;
    private _children;
    constructor(target: EventTarget);
    get isEmpty(): boolean;
    addEventListener(type: string, callback: EventListener, options?: AddEventListenerOptions): void;
    removeEventListener(type: string, callback?: EventListener, options?: EventListenerOptions): void;
    reset(): void;
    private _addEventListener;
    private _removeEventListener;
    private _unregisterAllListeners;
    private _unregisterAllEvents;
}

declare function threePlaneIntersection(firstPlane: Plane, secondPlane: Plane, thirdPlane: Plane): Point3;

declare function toLowHighRange(windowWidth: number, windowCenter: number): {
    lower: number;
    upper: number;
};

declare function toWindowLevel(low: number, high: number): {
    windowWidth: number;
    windowCenter: number;
};

declare namespace transferFunctionUtils {
    export {
        getTransferFunctionNodes,
        setTransferFunctionNodes
    }
}

declare type TransformMatrix2D = [number, number, number, number, number, number];

declare function transformWorldToIndex(imageData: any, worldPos: Point3): any;

export declare function triggerEvent(el: EventTarget, type: string, detail?: unknown): boolean;

declare namespace Types {
    export {
        Cornerstone3DConfig,
        ICamera,
        IStackViewport,
        IVideoViewport,
        IVolumeViewport,
        IEnabledElement,
        ICache,
        IVolume,
        VolumeScalarData,
        IViewportId,
        IImageVolume,
        IDynamicImageVolume,
        IRenderingEngine,
        ScalingParameters,
        PTScaling,
        Scaling,
        IStreamingImageVolume,
        IImage,
        IImageData,
        IImageCalibration,
        CPUIImageData,
        CPUImageData,
        EventTypes,
        ImageLoaderFn,
        VolumeLoaderFn,
        IRegisterImageLoader,
        IStreamingVolumeProperties,
        IViewport,
        StackViewportProperties,
        VolumeViewportProperties,
        ViewportProperties,
        PublicViewportInput,
        VolumeActor,
        Actor,
        ActorEntry,
        ImageActor,
        IImageLoadObject,
        IVolumeLoadObject,
        IVolumeInput,
        VolumeInputCallback,
        ViewportPreset,
        Metadata,
        OrientationVectors,
        Point2,
        Point3,
        Point4,
        Mat3,
        Plane,
        ViewportInputOptions,
        VideoViewportProperties,
        VOIRange,
        VOI,
        DisplayArea,
        FlipDirection,
        ICachedImage,
        ICachedVolume,
        CPUFallbackEnabledElement,
        CPUFallbackViewport,
        CPUFallbackTransform,
        CPUFallbackColormapData,
        CPUFallbackViewportDisplayedArea,
        CPUFallbackColormapsData,
        CPUFallbackColormap,
        TransformMatrix2D,
        CPUFallbackLookupTable,
        CPUFallbackLUT,
        CPUFallbackRenderingTools,
        CustomEvent_2 as CustomEventType,
        ActorSliceRange,
        ImageSliceData,
        IGeometry,
        IGeometryLoadObject,
        ICachedGeometry,
        PublicContourSetData,
        ContourSetData,
        ContourData,
        IContourSet,
        IContour,
        PublicSurfaceData,
        SurfaceData,
        RGB,
        ColormapPublic,
        ColormapRegistration,
        PixelDataTypedArray,
        ImagePixelModule,
        ImagePlaneModule,
        AffineMatrix,
        InternalVideoCamera,
        VideoViewportInput
    }
}
export { Types }

declare function unregisterAllImageLoaders(): void;

declare namespace utilities {
    export {
        eventListener,
        invertRgbTransferFunction,
        createSigmoidRGBTransferFunction,
        getVoiFromSigmoidRGBTransferFunction,
        createLinearRGBTransferFunction,
        scaleRGBTransferFunction as scaleRgbTransferFunction,
        triggerEvent,
        imageIdToURI,
        metadataProvider as calibratedPixelSpacingMetadataProvider,
        clamp,
        uuidv4,
        planar,
        getMinMax,
        getRuntimeId,
        isEqual,
        isOpposite,
        createFloat32SharedArray,
        createUint8SharedArray,
        createUint16SharedArray,
        createInt16SharedArray,
        getViewportModality,
        windowLevel,
        getClosestImageId,
        getSpacingInNormalDirection,
        getTargetVolumeAndSpacingInNormalDir,
        getVolumeActorCorners,
        indexWithinDimensions,
        getVolumeViewportsContainingSameVolumes,
        getViewportsWithVolumeId,
        transformWorldToIndex,
        loadImageToCanvas,
        renderToCanvasCPU,
        renderToCanvasGPU,
        worldToImageCoords,
        imageToWorldCoords,
        getVolumeSliceRangeInfo,
        getVolumeViewportScrollInfo,
        getSliceRange,
        snapFocalPointToSlice,
        getImageSliceDataForVolumeViewport,
        isImageActor,
        isPTPrescaledWithSUV,
        actorIsA,
        getViewportsWithImageURI,
        getClosestStackImageIndexForPoint,
        calculateViewportsSpatialRegistration,
        spatialRegistrationMetadataProvider,
        getViewportImageCornersInWorld,
        hasNaNValues,
        applyPreset,
        deepMerge,
        getScalingParameters,
        getScalarDataType,
        colormap,
        getImageLegacy,
        transferFunctionUtils
    }
}
export { utilities }

declare function uuidv4(): string;

export declare class VideoViewport extends Viewport implements IVideoViewport {
    readonly uid: any;
    readonly renderingEngineId: string;
    readonly canvasContext: CanvasRenderingContext2D;
    private videoElement?;
    private videoWidth;
    private videoHeight;
    private loop;
    private mute;
    private isPlaying;
    private scrollSpeed;
    private fps;
    private videoCamera;
    constructor(props: VideoViewportInput);
    static get useCustomRenderingPipeline(): boolean;
    private addEventListeners;
    private removeEventListeners;
    private elementDisabledHandler;
    setVideoURL(videoURL: string): Promise<unknown>;
    togglePlayPause(): boolean;
    play(): void;
    pause(): Promise<void>;
    scroll(delta?: number): Promise<void>;
    start(): Promise<void>;
    end(): Promise<void>;
    setTime(timeInSeconds: number): Promise<void>;
    setFrame(frame: number): Promise<void>;
    setProperties(videoInterface: VideoViewportProperties): void;
    setPlaybackRate(rate?: number): void;
    setScrollSpeed(scrollSpeed?: number, unit?: VideoViewport_2.SpeedUnit): void;
    getProperties: () => VideoViewportProperties;
    resetProperties(): void;
    getImageData(): any;
    setCamera(camera: ICamera): void;
    getCamera(): ICamera;
    resetCamera: () => boolean;
    getFrameOfReferenceUID: () => string;
    resize: () => void;
    canvasToWorld: (canvasPos: Point2) => Point3;
    worldToCanvas: (worldPos: Point3) => Point2;
    private refreshRenderValues;
    private getWorldToCanvasRatio;
    private getCanvasToWorldRatio;
    customRenderViewportToCanvas: () => void;
    private renderFrame;
    private renderWhilstPlaying;
}

declare namespace VideoViewport_2 {
    export {
        SpeedUnit
    }
}

declare type VideoViewportInput = {
    id: string;
    renderingEngineId: string;
    type: ViewportType;
    element: HTMLDivElement;
    sx: number;
    sy: number;
    sWidth: number;
    sHeight: number;
    defaultOptions: any;
    canvas: HTMLCanvasElement;
};

declare type VideoViewportProperties = ViewportProperties & {
    loop?: boolean;
    muted?: boolean;
    pan?: Point2;
    playbackRate?: number;
    parallelScale?: number;
};

export declare class Viewport implements IViewport {
    readonly id: string;
    readonly element: HTMLDivElement;
    readonly canvas: HTMLCanvasElement;
    readonly renderingEngineId: string;
    readonly type: ViewportType;
    protected flipHorizontal: boolean;
    protected flipVertical: boolean;
    isDisabled: boolean;
    viewportStatus: ViewportStatus;
    sx: number;
    sy: number;
    sWidth: number;
    sHeight: number;
    _actors: Map<string, any>;
    readonly defaultOptions: any;
    options: ViewportInputOptions;
    protected newActorAdded: boolean;
    private _suppressCameraModifiedEvents;
    readonly suppressEvents: boolean;
    protected hasPixelSpacing: boolean;
    protected calibration: IImageCalibration;
    protected initialCamera: ICamera;
    private fitToCanvasCamera;
    constructor(props: ViewportInput);
    getRotation: () => number;
    getFrameOfReferenceUID: () => string;
    canvasToWorld: (canvasPos: Point2) => Point3;
    worldToCanvas: (worldPos: Point3) => Point2;
    customRenderViewportToCanvas: () => unknown;
    resize: () => void;
    getProperties: () => void;
    updateRenderingPipeline: () => void;
    static get useCustomRenderingPipeline(): boolean;
    setRendered(): void;
    getRenderingEngine(): IRenderingEngine;
    getRenderer(): any;
    render(): void;
    setOptions(options: ViewportInputOptions, immediate?: boolean): void;
    reset(immediate?: boolean): void;
    protected flip({ flipHorizontal, flipVertical }: FlipDirection): void;
    private getDefaultImageData;
    getDefaultActor(): ActorEntry;
    getActors(): Array<ActorEntry>;
    getActor(actorUID: string): ActorEntry;
    getActorUIDByIndex(index: number): string;
    getActorByIndex(index: number): ActorEntry;
    setActors(actors: Array<ActorEntry>): void;
    _removeActor(actorUID: string): void;
    removeActors(actorUIDs: Array<string>): void;
    addActors(actors: Array<ActorEntry>, resetCameraPanAndZoom?: boolean): void;
    addActor(actorEntry: ActorEntry): void;
    removeAllActors(): void;
    protected resetCameraNoEvent(): void;
    protected setCameraNoEvent(camera: ICamera): void;
    private _getViewImageDataIntersections;
    setDisplayArea(displayArea: DisplayArea, suppressEvents?: boolean): void;
    getDisplayArea(): DisplayArea | undefined;
    resetCamera(resetPan?: boolean, resetZoom?: boolean, resetToCenter?: boolean, storeAsInitialCamera?: boolean): boolean;
    protected setInitialCamera(camera: ICamera): void;
    protected setFitToCanvasCamera(camera: ICamera): void;
    getPan(): Point2;
    setPan(pan: Point2, storeAsInitialCamera?: boolean): void;
    getZoom(): number;
    setZoom(value: number, storeAsInitialCamera?: boolean): void;
    private _getFocalPointForViewPlaneReset;
    getCanvas(): HTMLCanvasElement;
    protected getVtkActiveCamera(): vtkCamera | vtkSlabCamera;
    getCamera(): ICamera;
    setCamera(cameraInterface: ICamera, storeAsInitialCamera?: boolean): void;
    triggerCameraModifiedEventIfNecessary(previousCamera: ICamera, updatedCamera: ICamera): void;
    protected updateClippingPlanesForActors(updatedCamera: ICamera): Promise<void>;
    protected posProcessNewActors(): void;
    setOrientationOfClippingPlanes(vtkPlanes: Array<vtkPlane>, slabThickness: number, viewPlaneNormal: Point3, focalPoint: Point3): void;
    private _getWorldDistanceViewUpAndViewRight;
    protected _shouldUseNativeDataType(): boolean;
    _getCorners(bounds: Array<number>): Array<number>[];
    _getFocalPointForResetCamera(centeredFocalPoint: Point3, previousCamera: ICamera, { resetPan, resetToCenter }: {
        resetPan?: boolean;
        resetToCenter?: boolean;
    }): Point3;
    _isInBounds(point: Point3, bounds: number[]): boolean;
    _getEdges(bounds: Array<number>): Array<[number[], number[]]>;
}

declare type Viewport_2 = IStackViewport | IVolumeViewport;

declare type ViewportInput = {
    id: string;
    element: HTMLDivElement;
    canvas: HTMLCanvasElement;
    renderingEngineId: string;
    type: ViewportType;
    sx: number;
    sy: number;
    sWidth: number;
    sHeight: number;
    defaultOptions: ViewportInputOptions;
};

declare type ViewportInputOptions = {
    background?: RGB;
    orientation?: OrientationAxis | OrientationVectors;
    displayArea?: DisplayArea;
    suppressEvents?: boolean;
    parallelProjection?: boolean;
};

declare interface ViewportPreset {
    name: string;
    gradientOpacity: string;
    specularPower: string;
    scalarOpacity: string;
    specular: string;
    shade: string;
    ambient: string;
    colorTransfer: string;
    diffuse: string;
    interpolation: string;
}

declare type ViewportProperties = {
    voiRange?: VOIRange;
    VOILUTFunction?: VOILUTFunctionType;
    invert?: boolean;
    colormap?: ColormapPublic;
    interpolationType?: InterpolationType;
};

declare enum ViewportStatus {
    NO_DATA = "noData",
    LOADING = "loading",
    PRE_RENDER = "preRender",
    RESIZE = "resize",
    RENDERED = "rendered"
}

declare enum ViewportType {
    STACK = "stack",
    ORTHOGRAPHIC = "orthographic",
    PERSPECTIVE = "perspective",
    VOLUME_3D = "volume3d",
    VIDEO = "video"
}

declare type VOI = {
    windowWidth: number;
    windowCenter: number;
};

declare enum VOILUTFunctionType {
    LINEAR = "LINEAR",
    SAMPLED_SIGMOID = "SIGMOID"
}

declare type VoiModifiedEvent = CustomEvent_2<VoiModifiedEventDetail>;

declare type VoiModifiedEventDetail = {
    viewportId: string;
    range: VOIRange;
    volumeId?: string;
    VOILUTFunction?: VOILUTFunctionType;
    invert?: boolean;
    invertStateChanged?: boolean;
};

declare type VOIRange = {
    upper: number;
    lower: number;
};

declare type VolumeActor = vtkVolume;

declare type VolumeCacheVolumeAddedEvent = CustomEvent_2<VolumeCacheVolumeAddedEventDetail>;

declare type VolumeCacheVolumeAddedEventDetail = {
    volume: ICachedVolume;
};

declare type VolumeCacheVolumeRemovedEvent = CustomEvent_2<VolumeCacheVolumeRemovedEventDetail>;

declare type VolumeCacheVolumeRemovedEventDetail = {
    volumeId: string;
};

declare type VolumeInputCallback = (params: {
    volumeActor: VolumeActor;
    volumeId: string;
}) => unknown;

declare type VolumeLoadedEvent = CustomEvent_2<VolumeLoadedEventDetail>;

declare type VolumeLoadedEventDetail = {
    volume: IImageVolume;
};

declare type VolumeLoadedFailedEvent = CustomEvent_2<VolumeLoadedFailedEventDetail>;

declare type VolumeLoadedFailedEventDetail = {
    volumeId: string;
    error: unknown;
};

declare namespace volumeLoader {
    export {
        loadVolume,
        createAndCacheVolume,
        createAndCacheDerivedVolume,
        createLocalVolume,
        registerVolumeLoader,
        getVolumeLoaderSchemes,
        registerUnknownVolumeLoader
    }
}
export { volumeLoader }

declare type VolumeLoaderFn = (volumeId: string, options?: Record<string, any>) => {
    promise: Promise<Record<string, any>>;
    cancelFn?: () => void | undefined;
    decache?: () => void | undefined;
};

declare interface VolumeLoaderOptions {
    imageIds: Array<string>;
}

declare type VolumeNewImageEvent = CustomEvent_2<VolumeNewImageEventDetail>;

declare type VolumeNewImageEventDetail = {
    imageIndex: number;
    numberOfSlices: number;
    viewportId: string;
    renderingEngineId: string;
};

declare type VolumeScalarData = Float32Array | Uint8Array | Uint16Array | Int16Array;

export declare class VolumeViewport extends BaseVolumeViewport {
    private _useAcquisitionPlaneForViewPlane;
    constructor(props: ViewportInput);
    setVolumes(volumeInputArray: Array<IVolumeInput>, immediate?: boolean, suppressEvents?: boolean): Promise<void>;
    addVolumes(volumeInputArray: Array<IVolumeInput>, immediate?: boolean, suppressEvents?: boolean): Promise<void>;
    setOrientation(orientation: OrientationAxis, immediate?: boolean): void;
    private _getAcquisitionPlaneOrientation;
    private _setViewPlaneToAcquisitionPlane;
    setBlendMode(blendMode: BlendModes, filterActorUIDs?: any[], immediate?: boolean): void;
    resetCamera(resetPan?: boolean, resetZoom?: boolean, resetToCenter?: boolean): boolean;
    setSlabThickness(slabThickness: number, filterActorUIDs?: any[]): void;
    getCurrentImageIdIndex: (volumeId?: string) => number;
    getCurrentImageId: () => string | undefined;
    getRotation: () => number;
    resetProperties(volumeId?: string): void;
    private _resetProperties;
}

export declare class VolumeViewport3D extends BaseVolumeViewport {
    constructor(props: ViewportInput);
    resetCamera(resetPan?: boolean, resetZoom?: boolean, resetToCenter?: boolean): boolean;
    getRotation: () => number;
    getCurrentImageIdIndex: () => number | undefined;
    getCurrentImageId: () => string;
    posProcessNewActors(): void;
    setSlabThickness(slabThickness: number, filterActorUIDs?: Array<string>): void;
    setBlendMode(blendMode: BlendModes, filterActorUIDs?: string[], immediate?: boolean): void;
    resetProperties(volumeId?: string): void;
}

declare type VolumeViewportProperties = ViewportProperties & {
    preset?: string;
    slabThickness?: number;
};

declare interface vtkSlabCamera extends vtkObject {
    /**
     * Apply a transform to the camera.
     * The camera position, focal-point, and view-up are re-calculated
     * using the transform's matrix to multiply the old points by the new transform.
     * @param transformMat4 -
     */
    applyTransform(transformMat4: mat4): void;

    /**
     * Rotate the camera about the view up vector centered at the focal point.
     * @param angle -
     */
    azimuth(angle: number): void;

    /**
     *
     * @param bounds -
     */
    computeClippingRange(bounds: number[]): number[];

    /**
     * This method must be called when the focal point or camera position changes
     */
    computeDistance(): void;

    /**
     * the provided matrix should include
     * translation and orientation only
     * mat is physical to view
     * @param mat -
     */
    computeViewParametersFromPhysicalMatrix(mat: mat4): void;

    /**
     *
     * @param vmat -
     */
    computeViewParametersFromViewMatrix(vmat: mat4): void;

    /**
     * Not implemented yet
     * @param sourceCamera -
     */
    deepCopy(sourceCamera: vtkSlabCamera): void;

    /**
     * Move the position of the camera along the view plane normal. Moving
     * towards the focal point (e.g., greater than 1) is a dolly-in, moving away
     * from the focal point (e.g., less than 1) is a dolly-out.
     * @param amount -
     */
    dolly(amount: number): void;

    /**
     * Rotate the camera about the cross product of the negative of the direction of projection and the view up vector, using the focal point as the center of rotation.
     * @param angle  -
     */
    elevation(angle: number): void;

    /**
     * Not implemented yet
     */
    getCameraLightTransformMatrix(): void;

    /**
     *
     * @defaultValue [0.01, 1000.01],
     */
    getClippingRange(): number[];

    /**
     *
     * @defaultValue [0.01, 1000.01],
     */
    getClippingRangeByReference(): number[];

    /**
     *
     * @param aspect - Camera frustum aspect ratio.
     * @param nearz - Camera frustum near plane.
     * @param farz - Camera frustum far plane.
     */
    getCompositeProjectionMatrix(
    aspect: number,
    nearz: number,
    farz: number
    ): mat4;

    /**
     * Get the vector in the direction from the camera position to the focal point.
     * @defaultValue [0, 0, -1],
     */
    getDirectionOfProjection(): number[];

    /**
     *
     * @defaultValue [0, 0, -1],
     */
    getDirectionOfProjectionByReference(): number[];

    /**
     * Get the distance from the camera position to the focal point.
     */
    getDistance(): number;

    /**
     *
     * @defaultValue [0, 0, 0]
     */
    getFocalPoint(): number[];

    /**
     *
     */
    getFocalPointByReference(): number[];

    /**
     *
     * @defaultValue false
     */
    getFreezeFocalPoint(): boolean;

    setFreezeFocalPoint(freeze: boolean): void;

    /**
     * Not implemented yet
     * @param aspect - Camera frustum aspect ratio.
     */
    getFrustumPlanes(aspect: number): void;

    /**
     * Not implemented yet
     */
    getOrientation(): void;

    /**
     * Not implemented yet
     */
    getOrientationWXYZ(): void;

    /**
     *
     * @defaultValue false
     */
    getParallelProjection(): boolean;

    /**
     *
     * @defaultValue 1
     */
    getParallelScale(): number;

    /**
     *
     * @defaultValue 1.0
     */
    getPhysicalScale(): number;

    /**
     *
     * @param result -
     */
    getPhysicalToWorldMatrix(result: mat4): void;

    /**
     *
     */
    getPhysicalTranslation(): number[];

    /**
     *
     */
    getPhysicalTranslationByReference(): number[];

    /**
     *
     * @defaultValue [0, 0, -1],
     */
    getPhysicalViewNorth(): number[];

    /**
     *
     */
    getPhysicalViewNorthByReference(): number[];

    /**
     *
     * @defaultValue [0, 1, 0]
     */
    getPhysicalViewUp(): number[];

    /**
     *
     */
    getPhysicalViewUpByReference(): number[];

    /**
     * Get the position of the camera in world coordinates.
     * @defaultValue [0, 0, 1]
     */
    getPosition(): number[];

    /**
     *
     */
    getPositionByReference(): number[];

    /**
     *
     * @param aspect - Camera frustum aspect ratio.
     * @param nearz - Camera frustum near plane.
     * @param farz - Camera frustum far plane.
     * @defaultValue null
     */
    getProjectionMatrix(aspect: number, nearz: number, farz: number): null | mat4;

    /**
     * Not implemented yet
     * Get the roll angle of the camera about the direction of projection.
     */
    getRoll(): void;

    /**
     * Get top left corner point of the screen.
     * @defaultValue [-0.5, -0.5, -0.5]
     */
    getScreenBottomLeft(): number[];

    /**
     *
     * @defaultValue [-0.5, -0.5, -0.5]
     */
    getScreenBottomLeftByReference(): number[];

    /**
     * Get bottom left corner point of the screen
     * @defaultValue [0.5, -0.5, -0.5]
     */
    getScreenBottomRight(): number[];

    /**
     *
     * @defaultValue [0.5, -0.5, -0.5]
     */
    getScreenBottomRightByReference(): number[];

    /**
     *
     * @defaultValue [0.5, 0.5, -0.5]
     */
    getScreenTopRight(): number[];

    /**
     *
     * @defaultValue [0.5, 0.5, -0.5]
     */
    getScreenTopRightByReference(): number[];

    /**
     * Get the center of the window in viewport coordinates.
     */
    getThickness(): number;

    /**
     * Get the value of the UseHorizontalViewAngle instance variable.
     * @defaultValue false
     */
    getUseHorizontalViewAngle(): boolean;

    /**
     * Get use offaxis frustum.
     * @defaultValue false
     */
    getUseOffAxisProjection(): boolean;

    /**
     * Get the camera view angle.
     * @defaultValue 30
     */
    getViewAngle(): number;

    /**
     *
     * @defaultValue null
     */
    getViewMatrix(): null | mat4;

    /**
     * Get the ViewPlaneNormal.
     * This vector will point opposite to the direction of projection,
     * unless you have created a sheared output view using SetViewShear/SetObliqueAngles.
     * @defaultValue [0, 0, 1]
     */
    getViewPlaneNormal(): number[];

    /**
     * Get the ViewPlaneNormal by reference.
     */
    getViewPlaneNormalByReference(): number[];

    /**
     * Get ViewUp vector.
     * @defaultValue [0, 1, 0]
     */
    getViewUp(): number[];

    /**
     * Get ViewUp vector by reference.
     * @defaultValue [0, 1, 0]
     */
    getViewUpByReference(): number[];

    /**
     * Get the center of the window in viewport coordinates.
     * The viewport coordinate range is ([-1,+1],[-1,+1]).
     * @defaultValue [0, 0]
     */
    getWindowCenter(): number[];

    /**
     *
     * @defaultValue [0, 0]
     */
    getWindowCenterByReference(): number[];

    /**
     *
     * @param result -
     */
    getWorldToPhysicalMatrix(result: mat4): void;

    /**
     *
     * @defaultValue false
     */
    getIsPerformingCoordinateTransformation(status: boolean): void;

    /**
     * Recompute the ViewUp vector to force it to be perpendicular to the camera's focalpoint vector.
     */
    orthogonalizeViewUp(): void;

    /**
     *
     * @param ori -
     */
    physicalOrientationToWorldDirection(ori: number[]): any;

    /**
     * Rotate the focal point about the cross product of the view up vector and the direction of projection, using the camera's position as the center of rotation.
     * @param angle -
     */
    pitch(angle: number): void;

    /**
     * Rotate the camera about the direction of projection.
     * @param angle -
     */
    roll(angle: number): void;

    /**
     * Set the location of the near and far clipping planes along the direction
     * of projection.
     * @param near -
     * @param far -
     */
    setClippingRange(near: number, far: number): boolean;

    /**
     * Set the location of the near and far clipping planes along the direction
     * of projection.
     * @param clippingRange -
     */
    setClippingRange(clippingRange: number[]): boolean;

    /**
     *
     * @param clippingRange -
     */
    setClippingRangeFrom(clippingRange: number[]): boolean;

    /**
     * used to handle convert js device orientation angles
     * when you use this method the camera will adjust to the
     * device orientation such that the physicalViewUp you set
     * in world coordinates looks up, and the physicalViewNorth
     * you set in world coorindates will (maybe) point north
     *
     * NOTE WARNING - much of the documentation out there on how
     * orientation works is seriously wrong. Even worse the Chrome
     * device orientation simulator is completely wrong and should
     * never be used. OMG it is so messed up.
     *
     * how it seems to work on iOS is that the device orientation
     * is specified in extrinsic angles with a alpha, beta, gamma
     * convention with axes of Z, X, Y (the code below substitutes
     * the physical coordinate system for these axes to get the right
     * modified coordinate system.
     * @param alpha -
     * @param beta -
     * @param gamma -
     * @param screen -
     */
    setDeviceAngles(
    alpha: number,
    beta: number,
    gamma: number,
    screen: number
    ): boolean;

    /**
     *
     * @param x - The x coordinate.
     * @param y - The y coordinate.
     * @param z - The z coordinate.
     */
    setDirectionOfProjection(x: number, y: number, z: number): boolean;

    /**
     *
     * @param distance -
     */
    setDistance(distance: number): boolean;

    /**
     *
     * @param x - The x coordinate.
     * @param y - The y coordinate.
     * @param z - The z coordinate.
     */
    setFocalPoint(x: number, y: number, z: number): boolean;

    /**
     *
     * @param focalPoint -
     */
    setFocalPointFrom(focalPoint: number[]): boolean;

    /**
     * Not implement yet
     * Set the oblique viewing angles.
     * The first angle, alpha, is the angle (measured from the horizontal) that rays along
     * the direction of projection will follow once projected onto the 2D screen.
     * The second angle, beta, is the angle between the view plane and the direction of projection.
     * This creates a shear transform x' = x + dz*cos(alpha)/tan(beta), y' = dz*sin(alpha)/tan(beta) where dz is the distance of the point from the focal plane.
     * The angles are (45,90) by default. Oblique projections commonly use (30,63.435).
     *
     * @param alpha -
     * @param beta -
     */
    setObliqueAngles(alpha: number, beta: number): boolean;

    /**
     *
     * @param degrees -
     * @param x - The x coordinate.
     * @param y - The y coordinate.
     * @param z - The z coordinate.
     */
    setOrientationWXYZ(degrees: number, x: number, y: number, z: number): boolean;

    /**
     *
     * @param parallelProjection -
     */
    setParallelProjection(parallelProjection: boolean): boolean;

    /**
     *
     * @param parallelScale -
     */
    setParallelScale(parallelScale: number): boolean;

    /**
     *
     * @param physicalScale -
     */
    setPhysicalScale(physicalScale: number): boolean;

    /**
     *
     * @param x - The x coordinate.
     * @param y - The y coordinate.
     * @param z - The z coordinate.
     */
    setPhysicalTranslation(x: number, y: number, z: number): boolean;

    /**
     *
     * @param physicalTranslation -
     */
    setPhysicalTranslationFrom(physicalTranslation: number[]): boolean;

    /**
     *
     * @param x - The x coordinate.
     * @param y - The y coordinate.
     * @param z - The z coordinate.
     */
    setPhysicalViewNorth(x: number, y: number, z: number): boolean;

    /**
     *
     * @param physicalViewNorth -
     */
    setPhysicalViewNorthFrom(physicalViewNorth: number[]): boolean;

    /**
     *
     * @param x - The x coordinate.
     * @param y - The y coordinate.
     * @param z - The z coordinate.
     */
    setPhysicalViewUp(x: number, y: number, z: number): boolean;

    /**
     *
     * @param physicalViewUp -
     */
    setPhysicalViewUpFrom(physicalViewUp: number[]): boolean;

    /**
     * Set the position of the camera in world coordinates.
     * @param x - The x coordinate.
     * @param y - The y coordinate.
     * @param z - The z coordinate.
     */
    setPosition(x: number, y: number, z: number): boolean;

    /**
     *
     * @param mat -
     */
    setProjectionMatrix(mat: mat4): boolean;

    /**
     * Set the roll angle of the camera about the direction of projection.
     * todo Not implemented yet
     * @param angle -
     */
    setRoll(angle: number): boolean;

    /**
     * Set top left corner point of the screen.
     *
     * This will be used only for offaxis frustum calculation.
     * @param x - The x coordinate.
     * @param y - The y coordinate.
     * @param z - The z coordinate.
     */
    setScreenBottomLeft(x: number, y: number, z: number): boolean;

    /**
     * Set top left corner point of the screen.
     *
     * This will be used only for offaxis frustum calculation.
     * @param screenBottomLeft -
     */
    setScreenBottomLeft(screenBottomLeft: number[]): boolean;

    /**
     *
     * @param screenBottomLeft -
     */
    setScreenBottomLeftFrom(screenBottomLeft: number[]): boolean;

    /**
     *
     * @param x - The x coordinate.
     * @param y - The y coordinate.
     * @param z - The z coordinate.
     */
    setScreenBottomRight(x: number, y: number, z: number): boolean;

    /**
     *
     * @param screenBottomRight -
     */
    setScreenBottomRight(screenBottomRight: number[]): boolean;

    /**
     *
     * @param screenBottomRight -
     */
    setScreenBottomRightFrom(screenBottomRight: number[]): boolean;

    /**
     * Set top right corner point of the screen.
     *
     * This will be used only for offaxis frustum calculation.
     * @param x - The x coordinate.
     * @param y - The y coordinate.
     * @param z - The z coordinate.
     */
    setScreenTopRight(x: number, y: number, z: number): boolean;

    /**
     * Set top right corner point of the screen.
     *
     * This will be used only for offaxis frustum calculation.
     * @param screenTopRight -
     */
    setScreenTopRight(screenTopRight: number[]): boolean;

    /**
     *
     * @param screenTopRight -
     */
    setScreenTopRightFrom(screenTopRight: number[]): boolean;

    /**
     * Set the distance between clipping planes.
     *
     * This method adjusts the far clipping plane to be set a distance 'thickness' beyond the near clipping plane.
     * @param thickness -
     */
    setThickness(thickness: number): boolean;

    /**
     *
     * @param thickness -
     */
    setThicknessFromFocalPoint(thickness: number): boolean;

    /**
     *
     * @param useHorizontalViewAngle -
     */
    setUseHorizontalViewAngle(useHorizontalViewAngle: boolean): boolean;

    /**
     * Set use offaxis frustum.
     *
     * OffAxis frustum is used for off-axis frustum calculations specifically for
     * stereo rendering. For reference see "High Resolution Virtual Reality", in
     * Proc. SIGGRAPH '92, Computer Graphics, pages 195-202, 1992.
     * @param useOffAxisProjection -
     */
    setUseOffAxisProjection(useOffAxisProjection: boolean): boolean;

    /**
     * Set the camera view angle, which is the angular height of the camera view measured in degrees.
     * @param viewAngle -
     */
    setViewAngle(viewAngle: number): boolean;

    /**
     *
     * @param mat -
     */
    setViewMatrix(mat: mat4): boolean;

    /**
     *
     * @param x - The x coordinate.
     * @param y - The y coordinate.
     * @param z - The z coordinate.
     */
    setViewUp(x: number, y: number, z: number): boolean;

    /**
     *
     * @param viewUp -
     */
    setViewUp(viewUp: number[]): boolean;

    /**
     *
     * @param viewUp -
     */
    setViewUpFrom(viewUp: number[]): boolean;

    /**
     * Set the center of the window in viewport coordinates.
     * The viewport coordinate range is ([-1,+1],[-1,+1]).
     * This method is for if you have one window which consists of several viewports, or if you have several screens which you want to act together as one large screen
     * @param x - The x coordinate.
     * @param y - The y coordinate.
     */
    setWindowCenter(x: number, y: number): boolean;

    /**
     * Set the center of the window in viewport coordinates from an array.
     * @param windowCenter -
     */
    setWindowCenterFrom(windowCenter: number[]): boolean;

    /**
     *
     * @param x - The x coordinate.
     * @param y - The y coordinate.
     * @param z - The z coordinate.
     */
    translate(x: number, y: number, z: number): void;

    /**
     * Rotate the focal point about the view up vector, using the camera's position as the center of rotation.
     * @param angle -
     */
    yaw(angle: number): void;

    /**
     * In perspective mode, decrease the view angle by the specified factor.
     * @param factor -
     */
    zoom(factor: number): void;

    /**
     * Activate camera clipping customization necessary when doing coordinate transformations
     * @param status -
     */
    setIsPerformingCoordinateTransformation(status: boolean): void;
}

/**
 * vtkCamera is a virtual camera for 3D rendering. It provides methods
 * to position and orient the view point and focal point. Convenience
 * methods for moving about the focal point also are provided. More
 * complex methods allow the manipulation of the computer graphics model
 * including view up vector, clipping planes, and camera perspective.
 */
declare const vtkSlabCamera: {
    newInstance: typeof newInstance;
    extend: typeof extend;
};

declare namespace windowLevel {
    export {
        toWindowLevel,
        toLowHighRange
    }
}

declare function worldToImageCoords(imageId: string, worldCoords: Point3): Point2 | undefined;

export { }
