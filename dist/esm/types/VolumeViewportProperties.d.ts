import { ViewportProperties } from './ViewportProperties';
declare type VolumeViewportProperties = ViewportProperties & {
    preset?: string;
    slabThickness?: number;
};
export default VolumeViewportProperties;
