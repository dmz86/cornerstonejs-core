import { SurfaceData, Point3 } from '../../types';
declare type SurfaceProps = {
    id: string;
    data: SurfaceData;
    frameOfReferenceUID: string;
    color?: Point3;
};
export declare class Surface {
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
export {};
