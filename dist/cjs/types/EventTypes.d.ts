import type { mat4 } from 'gl-matrix';
import type { vtkImageData } from '@kitware/vtk.js/Common/DataModel/ImageData';
import type CustomEventType from '../types/CustomEventType';
import type ICachedImage from './ICachedImage';
import type ICachedVolume from './ICachedVolume';
import type ICamera from './ICamera';
import type IImage from './IImage';
import type IImageVolume from './IImageVolume';
import type { VOIRange } from './voi';
import type VOILUTFunctionType from '../enums/VOILUTFunctionType';
import type ViewportStatus from '../enums/ViewportStatus';
import type DisplayArea from './displayArea';
import IImageCalibration from './IImageCalibration';
declare type CameraModifiedEventDetail = {
    previousCamera: ICamera;
    camera: ICamera;
    element: HTMLDivElement;
    viewportId: string;
    renderingEngineId: string;
    rotation?: number;
};
declare type VoiModifiedEventDetail = {
    viewportId: string;
    range: VOIRange;
    volumeId?: string;
    VOILUTFunction?: VOILUTFunctionType;
    invert?: boolean;
    invertStateChanged?: boolean;
};
declare type DisplayAreaModifiedEventDetail = {
    viewportId: string;
    displayArea: DisplayArea;
    volumeId?: string;
    storeAsInitialCamera?: boolean;
};
declare type ElementDisabledEventDetail = {
    element: HTMLDivElement;
    viewportId: string;
    renderingEngineId: string;
};
declare type ElementEnabledEventDetail = {
    element: HTMLDivElement;
    viewportId: string;
    renderingEngineId: string;
};
declare type ImageRenderedEventDetail = {
    element: HTMLDivElement;
    viewportId: string;
    renderingEngineId: string;
    suppressEvents?: boolean;
    viewportStatus: ViewportStatus;
};
declare type ImageVolumeModifiedEventDetail = {
    imageVolume: IImageVolume;
    FrameOfReferenceUID: string;
};
declare type ImageVolumeLoadingCompletedEventDetail = {
    volumeId: string;
    FrameOfReferenceUID: string;
};
declare type ImageLoadedEventDetail = {
    image: IImage;
};
declare type ImageLoadedFailedEventDetail = {
    imageId: string;
    error: unknown;
};
declare type VolumeLoadedEventDetail = {
    volume: IImageVolume;
};
declare type VolumeLoadedFailedEventDetail = {
    volumeId: string;
    error: unknown;
};
declare type ImageCacheImageRemovedEventDetail = {
    imageId: string;
};
declare type ImageCacheImageAddedEventDetail = {
    image: ICachedImage;
};
declare type VolumeCacheVolumeRemovedEventDetail = {
    volumeId: string;
};
declare type VolumeCacheVolumeAddedEventDetail = {
    volume: ICachedVolume;
};
declare type PreStackNewImageEventDetail = {
    imageId: string;
    imageIdIndex: number;
    viewportId: string;
    renderingEngineId: string;
};
declare type StackNewImageEventDetail = {
    image: IImage;
    imageId: string;
    imageIdIndex: number;
    viewportId: string;
    renderingEngineId: string;
};
declare type VolumeNewImageEventDetail = {
    imageIndex: number;
    numberOfSlices: number;
    viewportId: string;
    renderingEngineId: string;
};
declare type ImageSpacingCalibratedEventDetail = {
    element: HTMLDivElement;
    viewportId: string;
    renderingEngineId: string;
    imageId: string;
    calibration: IImageCalibration;
    imageData: vtkImageData;
    worldToIndex: mat4;
};
declare type ImageLoadProgressEventDetail = {
    url: string;
    imageId: string;
    loaded: number;
    total: number;
    percent: number;
};
declare type StackViewportNewStackEventDetail = {
    imageIds: string[];
    viewportId: string;
    element: HTMLDivElement;
    currentImageIdIndex: number;
};
declare type StackViewportScrollEventDetail = {
    newImageIdIndex: number;
    imageId: string;
    direction: number;
};
declare type CameraModifiedEvent = CustomEventType<CameraModifiedEventDetail>;
declare type VoiModifiedEvent = CustomEventType<VoiModifiedEventDetail>;
declare type DisplayAreaModifiedEvent = CustomEventType<DisplayAreaModifiedEventDetail>;
declare type ElementDisabledEvent = CustomEventType<ElementDisabledEventDetail>;
declare type ElementEnabledEvent = CustomEventType<ElementEnabledEventDetail>;
declare type ImageRenderedEvent = CustomEventType<ElementEnabledEventDetail>;
declare type ImageVolumeModifiedEvent = CustomEventType<ImageVolumeModifiedEventDetail>;
declare type ImageVolumeLoadingCompletedEvent = CustomEventType<ImageVolumeLoadingCompletedEventDetail>;
declare type ImageLoadedEvent = CustomEventType<ImageLoadedEventDetail>;
declare type ImageLoadedFailedEvent = CustomEventType<ImageLoadedFailedEventDetail>;
declare type VolumeLoadedEvent = CustomEventType<VolumeLoadedEventDetail>;
declare type VolumeLoadedFailedEvent = CustomEventType<VolumeLoadedFailedEventDetail>;
declare type ImageCacheImageAddedEvent = CustomEventType<ImageCacheImageAddedEventDetail>;
declare type ImageCacheImageRemovedEvent = CustomEventType<ImageCacheImageRemovedEventDetail>;
declare type VolumeCacheVolumeAddedEvent = CustomEventType<VolumeCacheVolumeAddedEventDetail>;
declare type VolumeCacheVolumeRemovedEvent = CustomEventType<VolumeCacheVolumeRemovedEventDetail>;
declare type StackNewImageEvent = CustomEventType<StackNewImageEventDetail>;
declare type VolumeNewImageEvent = CustomEventType<VolumeNewImageEventDetail>;
declare type PreStackNewImageEvent = CustomEventType<PreStackNewImageEventDetail>;
declare type ImageSpacingCalibratedEvent = CustomEventType<ImageSpacingCalibratedEventDetail>;
declare type ImageLoadProgressEvent = CustomEventType<ImageLoadProgressEventDetail>;
declare type StackViewportNewStackEvent = CustomEventType<StackViewportNewStackEventDetail>;
declare type StackViewportScrollEvent = CustomEventType<StackViewportScrollEventDetail>;
export type { CameraModifiedEventDetail, CameraModifiedEvent, VoiModifiedEvent, VoiModifiedEventDetail, DisplayAreaModifiedEvent, DisplayAreaModifiedEventDetail, ElementDisabledEvent, ElementDisabledEventDetail, ElementEnabledEvent, ElementEnabledEventDetail, ImageRenderedEventDetail, ImageRenderedEvent, ImageVolumeModifiedEvent, ImageVolumeModifiedEventDetail, ImageVolumeLoadingCompletedEvent, ImageVolumeLoadingCompletedEventDetail, ImageLoadedEvent, ImageLoadedEventDetail, ImageLoadedFailedEventDetail, ImageLoadedFailedEvent, VolumeLoadedEvent, VolumeLoadedEventDetail, VolumeLoadedFailedEvent, VolumeLoadedFailedEventDetail, ImageCacheImageAddedEvent, ImageCacheImageAddedEventDetail, ImageCacheImageRemovedEvent, ImageCacheImageRemovedEventDetail, VolumeCacheVolumeAddedEvent, VolumeCacheVolumeAddedEventDetail, VolumeCacheVolumeRemovedEvent, VolumeCacheVolumeRemovedEventDetail, StackNewImageEvent, StackNewImageEventDetail, PreStackNewImageEvent, PreStackNewImageEventDetail, ImageSpacingCalibratedEvent, ImageSpacingCalibratedEventDetail, ImageLoadProgressEvent, ImageLoadProgressEventDetail, VolumeNewImageEvent, VolumeNewImageEventDetail, StackViewportNewStackEvent, StackViewportNewStackEventDetail, StackViewportScrollEvent, StackViewportScrollEventDetail, };
