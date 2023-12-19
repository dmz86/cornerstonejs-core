import { InterpolationType, VOILUTFunctionType } from '../enums';
import { VOIRange } from './voi';
import { ColormapPublic } from './Colormap';
declare type ViewportProperties = {
    voiRange?: VOIRange;
    VOILUTFunction?: VOILUTFunctionType;
    invert?: boolean;
    colormap?: ColormapPublic;
    interpolationType?: InterpolationType;
};
export type { ViewportProperties };
