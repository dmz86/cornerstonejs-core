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
exports.registerUnknownVolumeLoader = exports.getVolumeLoaderSchemes = exports.registerVolumeLoader = exports.createLocalVolume = exports.createAndCacheDerivedVolume = exports.createAndCacheVolume = exports.loadVolume = void 0;
require("@kitware/vtk.js/Rendering/Profiles/Volume");
const ImageData_1 = __importDefault(require("@kitware/vtk.js/Common/DataModel/ImageData"));
const DataArray_1 = __importDefault(require("@kitware/vtk.js/Common/Core/DataArray"));
const lodash_clonedeep_1 = __importDefault(require("lodash.clonedeep"));
const ImageVolume_1 = require("../cache/classes/ImageVolume");
const cache_1 = __importDefault(require("../cache/cache"));
const Events_1 = __importDefault(require("../enums/Events"));
const eventTarget_1 = __importDefault(require("../eventTarget"));
const triggerEvent_1 = __importDefault(require("../utilities/triggerEvent"));
const utilities_1 = require("../utilities");
const init_1 = require("../init");
function addScalarDataToImageData(imageData, scalarData, dataArrayAttrs) {
    const scalarArray = DataArray_1.default.newInstance(Object.assign({ name: `Pixels`, values: scalarData }, dataArrayAttrs));
    imageData.getPointData().setScalars(scalarArray);
}
function addScalarDataArraysToImageData(imageData, scalarDataArrays, dataArrayAttrs) {
    scalarDataArrays.forEach((scalarData, i) => {
        const vtkScalarArray = DataArray_1.default.newInstance(Object.assign({ name: `timePoint-${i}`, values: scalarData }, dataArrayAttrs));
        imageData.getPointData().addArray(vtkScalarArray);
    });
    imageData.getPointData().setActiveScalars('timePoint-0');
}
function createInternalVTKRepresentation(volume) {
    const { dimensions, metadata, spacing, direction, origin } = volume;
    const { PhotometricInterpretation } = metadata;
    let numComponents = 1;
    if (PhotometricInterpretation === 'RGB') {
        numComponents = 3;
    }
    const imageData = ImageData_1.default.newInstance();
    const dataArrayAttrs = { numberOfComponents: numComponents };
    imageData.setDimensions(dimensions);
    imageData.setSpacing(spacing);
    imageData.setDirection(direction);
    imageData.setOrigin(origin);
    if (volume.isDynamicVolume()) {
        const scalarDataArrays = (volume).getScalarDataArrays();
        addScalarDataArraysToImageData(imageData, scalarDataArrays, dataArrayAttrs);
    }
    else {
        const scalarData = volume.getScalarData();
        addScalarDataToImageData(imageData, scalarData, dataArrayAttrs);
    }
    return imageData;
}
const volumeLoaders = {};
let unknownVolumeLoader;
function loadVolumeFromVolumeLoader(volumeId, options) {
    const colonIndex = volumeId.indexOf(':');
    const scheme = volumeId.substring(0, colonIndex);
    const loader = volumeLoaders[scheme];
    if (loader === undefined || loader === null) {
        if (unknownVolumeLoader !== undefined) {
            return unknownVolumeLoader(volumeId, options);
        }
        throw new Error('loadVolumeFromVolumeLoader: no volume loader for volumeId');
    }
    const volumeLoadObject = loader(volumeId, options);
    volumeLoadObject.promise.then(function (volume) {
        (0, triggerEvent_1.default)(eventTarget_1.default, Events_1.default.VOLUME_LOADED, { volume });
    }, function (error) {
        const errorObject = {
            volumeId,
            error,
        };
        (0, triggerEvent_1.default)(eventTarget_1.default, Events_1.default.VOLUME_LOADED_FAILED, errorObject);
    });
    return volumeLoadObject;
}
function loadVolume(volumeId, options = { imageIds: [] }) {
    if (volumeId === undefined) {
        throw new Error('loadVolume: parameter volumeId must not be undefined');
    }
    let volumeLoadObject = cache_1.default.getVolumeLoadObject(volumeId);
    if (volumeLoadObject !== undefined) {
        return volumeLoadObject.promise;
    }
    volumeLoadObject = loadVolumeFromVolumeLoader(volumeId, options);
    return volumeLoadObject.promise.then((volume) => {
        volume.imageData = createInternalVTKRepresentation(volume);
        return volume;
    });
}
exports.loadVolume = loadVolume;
function createAndCacheVolume(volumeId, options) {
    return __awaiter(this, void 0, void 0, function* () {
        if (volumeId === undefined) {
            throw new Error('createAndCacheVolume: parameter volumeId must not be undefined');
        }
        let volumeLoadObject = cache_1.default.getVolumeLoadObject(volumeId);
        if (volumeLoadObject !== undefined) {
            return volumeLoadObject.promise;
        }
        volumeLoadObject = loadVolumeFromVolumeLoader(volumeId, options);
        volumeLoadObject.promise.then((volume) => {
            volume.imageData = createInternalVTKRepresentation(volume);
        });
        cache_1.default.putVolumeLoadObject(volumeId, volumeLoadObject).catch((err) => {
            throw err;
        });
        return volumeLoadObject.promise;
    });
}
exports.createAndCacheVolume = createAndCacheVolume;
function createAndCacheDerivedVolume(referencedVolumeId, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const referencedVolume = cache_1.default.getVolume(referencedVolumeId);
        if (!referencedVolume) {
            throw new Error(`Cannot created derived volume: Referenced volume with id ${referencedVolumeId} does not exist.`);
        }
        let { volumeId } = options;
        const { targetBuffer } = options;
        if (volumeId === undefined) {
            volumeId = (0, utilities_1.uuidv4)();
        }
        const { metadata, dimensions, spacing, origin, direction } = referencedVolume;
        const scalarData = referencedVolume.getScalarData();
        const scalarLength = scalarData.length;
        let numBytes, TypedArray;
        const { useNorm16Texture } = (0, init_1.getConfiguration)().rendering;
        if (targetBuffer) {
            if (targetBuffer.type === 'Float32Array') {
                numBytes = scalarLength * 4;
                TypedArray = Float32Array;
            }
            else if (targetBuffer.type === 'Uint8Array') {
                numBytes = scalarLength;
                TypedArray = Uint8Array;
            }
            else if (useNorm16Texture && targetBuffer.type === 'Uint16Array') {
                numBytes = scalarLength * 2;
                TypedArray = Uint16Array;
            }
            else if (useNorm16Texture && targetBuffer.type === 'Int16Array') {
                numBytes = scalarLength * 2;
                TypedArray = Uint16Array;
            }
            else {
                throw new Error('TargetBuffer should be Float32Array or Uint8Array');
            }
        }
        else {
            numBytes = scalarLength * 4;
            TypedArray = Float32Array;
        }
        const isCacheable = cache_1.default.isCacheable(numBytes);
        if (!isCacheable) {
            throw new Error(Events_1.default.CACHE_SIZE_EXCEEDED);
        }
        let volumeScalarData;
        if (targetBuffer === null || targetBuffer === void 0 ? void 0 : targetBuffer.sharedArrayBuffer) {
            const buffer = new SharedArrayBuffer(numBytes);
            volumeScalarData = new TypedArray(buffer);
        }
        else {
            volumeScalarData = new TypedArray(scalarLength);
        }
        const scalarArray = DataArray_1.default.newInstance({
            name: 'Pixels',
            numberOfComponents: 1,
            values: volumeScalarData,
        });
        const derivedImageData = ImageData_1.default.newInstance();
        derivedImageData.setDimensions(dimensions);
        derivedImageData.setSpacing(spacing);
        derivedImageData.setDirection(direction);
        derivedImageData.setOrigin(origin);
        derivedImageData.getPointData().setScalars(scalarArray);
        const derivedVolume = new ImageVolume_1.ImageVolume({
            volumeId,
            metadata: (0, lodash_clonedeep_1.default)(metadata),
            dimensions: [dimensions[0], dimensions[1], dimensions[2]],
            spacing,
            origin,
            direction,
            imageData: derivedImageData,
            scalarData: volumeScalarData,
            sizeInBytes: numBytes,
            referencedVolumeId,
        });
        const volumeLoadObject = {
            promise: Promise.resolve(derivedVolume),
        };
        yield cache_1.default.putVolumeLoadObject(volumeId, volumeLoadObject);
        return derivedVolume;
    });
}
exports.createAndCacheDerivedVolume = createAndCacheDerivedVolume;
function createLocalVolume(options, volumeId, preventCache = false) {
    const { scalarData, metadata, dimensions, spacing, origin, direction } = options;
    if (!scalarData ||
        !(scalarData instanceof Uint8Array ||
            scalarData instanceof Float32Array ||
            scalarData instanceof Uint16Array ||
            scalarData instanceof Int16Array)) {
        throw new Error('To use createLocalVolume you should pass scalarData of type Uint8Array, Uint16Array, Int16Array or Float32Array');
    }
    if (volumeId === undefined) {
        volumeId = (0, utilities_1.uuidv4)();
    }
    const cachedVolume = cache_1.default.getVolume(volumeId);
    if (cachedVolume) {
        return cachedVolume;
    }
    const scalarLength = dimensions[0] * dimensions[1] * dimensions[2];
    const numBytes = scalarData ? scalarData.buffer.byteLength : scalarLength * 4;
    const isCacheable = cache_1.default.isCacheable(numBytes);
    if (!isCacheable) {
        throw new Error(Events_1.default.CACHE_SIZE_EXCEEDED);
    }
    const scalarArray = DataArray_1.default.newInstance({
        name: 'Pixels',
        numberOfComponents: 1,
        values: scalarData,
    });
    const imageData = ImageData_1.default.newInstance();
    imageData.setDimensions(dimensions);
    imageData.setSpacing(spacing);
    imageData.setDirection(direction);
    imageData.setOrigin(origin);
    imageData.getPointData().setScalars(scalarArray);
    const derivedVolume = new ImageVolume_1.ImageVolume({
        volumeId,
        metadata: (0, lodash_clonedeep_1.default)(metadata),
        dimensions: [dimensions[0], dimensions[1], dimensions[2]],
        spacing,
        origin,
        direction,
        imageData: imageData,
        scalarData,
        sizeInBytes: numBytes,
    });
    if (preventCache) {
        return derivedVolume;
    }
    const volumeLoadObject = {
        promise: Promise.resolve(derivedVolume),
    };
    cache_1.default.putVolumeLoadObject(volumeId, volumeLoadObject);
    return derivedVolume;
}
exports.createLocalVolume = createLocalVolume;
function registerVolumeLoader(scheme, volumeLoader) {
    volumeLoaders[scheme] = volumeLoader;
}
exports.registerVolumeLoader = registerVolumeLoader;
function getVolumeLoaderSchemes() {
    return Object.keys(volumeLoaders);
}
exports.getVolumeLoaderSchemes = getVolumeLoaderSchemes;
function registerUnknownVolumeLoader(volumeLoader) {
    const oldVolumeLoader = unknownVolumeLoader;
    unknownVolumeLoader = volumeLoader;
    return oldVolumeLoader;
}
exports.registerUnknownVolumeLoader = registerUnknownVolumeLoader;
//# sourceMappingURL=volumeLoader.js.map