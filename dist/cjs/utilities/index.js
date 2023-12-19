"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyPreset = exports.hasNaNValues = exports.getViewportImageCornersInWorld = exports.spatialRegistrationMetadataProvider = exports.calculateViewportsSpatialRegistration = exports.getClosestStackImageIndexForPoint = exports.getViewportsWithImageURI = exports.actorIsA = exports.isPTPrescaledWithSUV = exports.isImageActor = exports.getImageSliceDataForVolumeViewport = exports.snapFocalPointToSlice = exports.getSliceRange = exports.getVolumeViewportScrollInfo = exports.getVolumeSliceRangeInfo = exports.imageToWorldCoords = exports.worldToImageCoords = exports.renderToCanvasGPU = exports.renderToCanvasCPU = exports.loadImageToCanvas = exports.transformWorldToIndex = exports.getViewportsWithVolumeId = exports.getVolumeViewportsContainingSameVolumes = exports.indexWithinDimensions = exports.getVolumeActorCorners = exports.getTargetVolumeAndSpacingInNormalDir = exports.getSpacingInNormalDirection = exports.getClosestImageId = exports.windowLevel = exports.getViewportModality = exports.createInt16SharedArray = exports.createUint16SharedArray = exports.createUint8SharedArray = exports.createFloat32SharedArray = exports.isOpposite = exports.isEqual = exports.getRuntimeId = exports.getMinMax = exports.planar = exports.uuidv4 = exports.clamp = exports.calibratedPixelSpacingMetadataProvider = exports.imageIdToURI = exports.triggerEvent = exports.scaleRgbTransferFunction = exports.createLinearRGBTransferFunction = exports.getVoiFromSigmoidRGBTransferFunction = exports.createSigmoidRGBTransferFunction = exports.invertRgbTransferFunction = exports.eventListener = void 0;
exports.transferFunctionUtils = exports.getImageLegacy = exports.colormap = exports.getScalarDataType = exports.getScalingParameters = exports.deepMerge = void 0;
const eventListener = __importStar(require("./eventListener"));
exports.eventListener = eventListener;
const invertRgbTransferFunction_1 = __importDefault(require("./invertRgbTransferFunction"));
exports.invertRgbTransferFunction = invertRgbTransferFunction_1.default;
const createSigmoidRGBTransferFunction_1 = __importDefault(require("./createSigmoidRGBTransferFunction"));
exports.createSigmoidRGBTransferFunction = createSigmoidRGBTransferFunction_1.default;
const getVoiFromSigmoidRGBTransferFunction_1 = __importDefault(require("./getVoiFromSigmoidRGBTransferFunction"));
exports.getVoiFromSigmoidRGBTransferFunction = getVoiFromSigmoidRGBTransferFunction_1.default;
const createLinearRGBTransferFunction_1 = __importDefault(require("./createLinearRGBTransferFunction"));
exports.createLinearRGBTransferFunction = createLinearRGBTransferFunction_1.default;
const scaleRgbTransferFunction_1 = __importDefault(require("./scaleRgbTransferFunction"));
exports.scaleRgbTransferFunction = scaleRgbTransferFunction_1.default;
const triggerEvent_1 = __importDefault(require("./triggerEvent"));
exports.triggerEvent = triggerEvent_1.default;
const uuidv4_1 = __importDefault(require("./uuidv4"));
exports.uuidv4 = uuidv4_1.default;
const getMinMax_1 = __importDefault(require("./getMinMax"));
exports.getMinMax = getMinMax_1.default;
const getRuntimeId_1 = __importDefault(require("./getRuntimeId"));
exports.getRuntimeId = getRuntimeId_1.default;
const imageIdToURI_1 = __importDefault(require("./imageIdToURI"));
exports.imageIdToURI = imageIdToURI_1.default;
const calibratedPixelSpacingMetadataProvider_1 = __importDefault(require("./calibratedPixelSpacingMetadataProvider"));
exports.calibratedPixelSpacingMetadataProvider = calibratedPixelSpacingMetadataProvider_1.default;
const clamp_1 = __importDefault(require("./clamp"));
exports.clamp = clamp_1.default;
const isEqual_1 = __importDefault(require("./isEqual"));
exports.isEqual = isEqual_1.default;
const isOpposite_1 = __importDefault(require("./isOpposite"));
exports.isOpposite = isOpposite_1.default;
const createUint8SharedArray_1 = __importDefault(require("./createUint8SharedArray"));
exports.createUint8SharedArray = createUint8SharedArray_1.default;
const createFloat32SharedArray_1 = __importDefault(require("./createFloat32SharedArray"));
exports.createFloat32SharedArray = createFloat32SharedArray_1.default;
const createUInt16SharedArray_1 = __importDefault(require("./createUInt16SharedArray"));
exports.createUint16SharedArray = createUInt16SharedArray_1.default;
const createInt16SharedArray_1 = __importDefault(require("./createInt16SharedArray"));
exports.createInt16SharedArray = createInt16SharedArray_1.default;
const getViewportModality_1 = __importDefault(require("./getViewportModality"));
exports.getViewportModality = getViewportModality_1.default;
const getClosestImageId_1 = __importDefault(require("./getClosestImageId"));
exports.getClosestImageId = getClosestImageId_1.default;
const getSpacingInNormalDirection_1 = __importDefault(require("./getSpacingInNormalDirection"));
exports.getSpacingInNormalDirection = getSpacingInNormalDirection_1.default;
const getTargetVolumeAndSpacingInNormalDir_1 = __importDefault(require("./getTargetVolumeAndSpacingInNormalDir"));
exports.getTargetVolumeAndSpacingInNormalDir = getTargetVolumeAndSpacingInNormalDir_1.default;
const getVolumeActorCorners_1 = __importDefault(require("./getVolumeActorCorners"));
exports.getVolumeActorCorners = getVolumeActorCorners_1.default;
const indexWithinDimensions_1 = __importDefault(require("./indexWithinDimensions"));
exports.indexWithinDimensions = indexWithinDimensions_1.default;
const getVolumeViewportsContainingSameVolumes_1 = __importDefault(require("./getVolumeViewportsContainingSameVolumes"));
exports.getVolumeViewportsContainingSameVolumes = getVolumeViewportsContainingSameVolumes_1.default;
const getViewportsWithVolumeId_1 = __importDefault(require("./getViewportsWithVolumeId"));
exports.getViewportsWithVolumeId = getViewportsWithVolumeId_1.default;
const transformWorldToIndex_1 = __importDefault(require("./transformWorldToIndex"));
exports.transformWorldToIndex = transformWorldToIndex_1.default;
const loadImageToCanvas_1 = __importDefault(require("./loadImageToCanvas"));
exports.loadImageToCanvas = loadImageToCanvas_1.default;
const renderToCanvasCPU_1 = __importDefault(require("./renderToCanvasCPU"));
exports.renderToCanvasCPU = renderToCanvasCPU_1.default;
const renderToCanvasGPU_1 = __importDefault(require("./renderToCanvasGPU"));
exports.renderToCanvasGPU = renderToCanvasGPU_1.default;
const worldToImageCoords_1 = __importDefault(require("./worldToImageCoords"));
exports.worldToImageCoords = worldToImageCoords_1.default;
const imageToWorldCoords_1 = __importDefault(require("./imageToWorldCoords"));
exports.imageToWorldCoords = imageToWorldCoords_1.default;
const getVolumeSliceRangeInfo_1 = __importDefault(require("./getVolumeSliceRangeInfo"));
exports.getVolumeSliceRangeInfo = getVolumeSliceRangeInfo_1.default;
const getVolumeViewportScrollInfo_1 = __importDefault(require("./getVolumeViewportScrollInfo"));
exports.getVolumeViewportScrollInfo = getVolumeViewportScrollInfo_1.default;
const getSliceRange_1 = __importDefault(require("./getSliceRange"));
exports.getSliceRange = getSliceRange_1.default;
const snapFocalPointToSlice_1 = __importDefault(require("./snapFocalPointToSlice"));
exports.snapFocalPointToSlice = snapFocalPointToSlice_1.default;
const getImageSliceDataForVolumeViewport_1 = __importDefault(require("./getImageSliceDataForVolumeViewport"));
exports.getImageSliceDataForVolumeViewport = getImageSliceDataForVolumeViewport_1.default;
const actorCheck_1 = require("./actorCheck");
Object.defineProperty(exports, "isImageActor", { enumerable: true, get: function () { return actorCheck_1.isImageActor; } });
Object.defineProperty(exports, "actorIsA", { enumerable: true, get: function () { return actorCheck_1.actorIsA; } });
const getViewportsWithImageURI_1 = __importDefault(require("./getViewportsWithImageURI"));
exports.getViewportsWithImageURI = getViewportsWithImageURI_1.default;
const getClosestStackImageIndexForPoint_1 = __importDefault(require("./getClosestStackImageIndexForPoint"));
exports.getClosestStackImageIndexForPoint = getClosestStackImageIndexForPoint_1.default;
const calculateViewportsSpatialRegistration_1 = __importDefault(require("./calculateViewportsSpatialRegistration"));
exports.calculateViewportsSpatialRegistration = calculateViewportsSpatialRegistration_1.default;
const spatialRegistrationMetadataProvider_1 = __importDefault(require("./spatialRegistrationMetadataProvider"));
exports.spatialRegistrationMetadataProvider = spatialRegistrationMetadataProvider_1.default;
const getViewportImageCornersInWorld_1 = __importDefault(require("./getViewportImageCornersInWorld"));
exports.getViewportImageCornersInWorld = getViewportImageCornersInWorld_1.default;
const hasNaNValues_1 = __importDefault(require("./hasNaNValues"));
exports.hasNaNValues = hasNaNValues_1.default;
const applyPreset_1 = __importDefault(require("./applyPreset"));
exports.applyPreset = applyPreset_1.default;
const deepMerge_1 = __importDefault(require("./deepMerge"));
exports.deepMerge = deepMerge_1.default;
const getScalingParameters_1 = __importDefault(require("./getScalingParameters"));
exports.getScalingParameters = getScalingParameters_1.default;
const getScalarDataType_1 = __importDefault(require("./getScalarDataType"));
exports.getScalarDataType = getScalarDataType_1.default;
const isPTPrescaledWithSUV_1 = __importDefault(require("./isPTPrescaledWithSUV"));
exports.isPTPrescaledWithSUV = isPTPrescaledWithSUV_1.default;
const getImageLegacy_1 = __importDefault(require("./getImageLegacy"));
exports.getImageLegacy = getImageLegacy_1.default;
const planar = __importStar(require("./planar"));
exports.planar = planar;
const windowLevel = __importStar(require("./windowLevel"));
exports.windowLevel = windowLevel;
const colormap = __importStar(require("./colormap"));
exports.colormap = colormap;
const transferFunctionUtils = __importStar(require("./transferFunctionUtils"));
exports.transferFunctionUtils = transferFunctionUtils;
//# sourceMappingURL=index.js.map