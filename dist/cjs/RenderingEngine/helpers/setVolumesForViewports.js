"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseVolumeViewport_1 = __importDefault(require("../BaseVolumeViewport"));
function setVolumesForViewports(renderingEngine, volumeInputs, viewportIds, immediateRender = false, suppressEvents = false) {
    return __awaiter(this, void 0, void 0, function* () {
        viewportIds.forEach((viewportId) => {
            const viewport = renderingEngine.getViewport(viewportId);
            if (!viewport) {
                throw new Error(`Viewport with Id ${viewportId} does not exist`);
            }
            if (!(viewport instanceof BaseVolumeViewport_1.default)) {
                throw new Error('setVolumesForViewports only supports VolumeViewport and VolumeViewport3D');
            }
        });
        const setVolumePromises = viewportIds.map((viewportId) => __awaiter(this, void 0, void 0, function* () {
            const viewport = renderingEngine.getViewport(viewportId);
            yield viewport.setVolumes(volumeInputs, immediateRender, suppressEvents);
        }));
        yield Promise.all(setVolumePromises);
        return;
    });
}
exports.default = setVolumesForViewports;
//# sourceMappingURL=setVolumesForViewports.js.map