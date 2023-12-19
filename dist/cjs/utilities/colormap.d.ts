import { ColormapRegistration } from '../types';
declare function registerColormap(colormap: ColormapRegistration): void;
declare function getColormap(name: any): any;
declare function getColormapNames(): any[];
export { getColormap, getColormapNames, registerColormap };
