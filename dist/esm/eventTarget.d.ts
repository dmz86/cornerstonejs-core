declare class CornerstoneEventTarget implements EventTarget {
    private listeners;
    constructor();
    reset(): void;
    addEventListener(type: any, callback: any): void;
    removeEventListener(type: any, callback: any): void;
    dispatchEvent(event: any): boolean;
}
declare const eventTarget: CornerstoneEventTarget;
export default eventTarget;
