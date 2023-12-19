"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getMinMax(storedPixelData) {
    let min = storedPixelData[0];
    let max = storedPixelData[0];
    let storedPixel;
    const numPixels = storedPixelData.length;
    for (let index = 1; index < numPixels; index++) {
        storedPixel = storedPixelData[index];
        min = Math.min(min, storedPixel);
        max = Math.max(max, storedPixel);
    }
    return {
        min,
        max,
    };
}
exports.default = getMinMax;
//# sourceMappingURL=getMinMax.js.map