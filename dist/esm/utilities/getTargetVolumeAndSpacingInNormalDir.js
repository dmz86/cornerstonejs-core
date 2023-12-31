import cache from '../cache/cache';
import { EPSILON } from '../constants';
import getSpacingInNormalDirection from './getSpacingInNormalDirection';
import { getVolumeLoaderSchemes } from '../loaders/volumeLoader';
const EPSILON_PART = 1 + EPSILON;
const startsWith = (str, starts) => starts === str.substring(0, Math.min(str.length, starts.length));
const isPrimaryVolume = (volume) => !!getVolumeLoaderSchemes().find((scheme) => startsWith(volume.volumeId, scheme));
export default function getTargetVolumeAndSpacingInNormalDir(viewport, camera, targetVolumeId) {
    const { viewPlaneNormal } = camera;
    const volumeActors = viewport.getActors();
    if (!volumeActors || !volumeActors.length) {
        return {
            spacingInNormalDirection: null,
            imageVolume: null,
            actorUID: null,
        };
    }
    const imageVolumes = volumeActors
        .map((va) => {
        const actorUID = va.referenceId ?? va.uid;
        return cache.getVolume(actorUID);
    })
        .filter((iv) => !!iv);
    if (targetVolumeId) {
        const imageVolumeIndex = imageVolumes.findIndex((iv) => iv.volumeId === targetVolumeId);
        const imageVolume = imageVolumes[imageVolumeIndex];
        const { uid: actorUID } = volumeActors[imageVolumeIndex];
        const spacingInNormalDirection = getSpacingInNormal(imageVolume, viewPlaneNormal, viewport);
        return { imageVolume, spacingInNormalDirection, actorUID };
    }
    if (!imageVolumes.length) {
        return {
            spacingInNormalDirection: null,
            imageVolume: null,
            actorUID: null,
        };
    }
    const smallest = {
        spacingInNormalDirection: Infinity,
        imageVolume: null,
        actorUID: null,
    };
    const hasPrimaryVolume = imageVolumes.find(isPrimaryVolume);
    for (let i = 0; i < imageVolumes.length; i++) {
        const imageVolume = imageVolumes[i];
        if (hasPrimaryVolume && !isPrimaryVolume(imageVolume)) {
            continue;
        }
        const spacingInNormalDirection = getSpacingInNormal(imageVolume, viewPlaneNormal, viewport);
        if (spacingInNormalDirection * EPSILON_PART <
            smallest.spacingInNormalDirection) {
            smallest.spacingInNormalDirection = spacingInNormalDirection;
            smallest.imageVolume = imageVolume;
            smallest.actorUID = volumeActors[i].uid;
        }
    }
    return smallest;
}
function getSpacingInNormal(imageVolume, viewPlaneNormal, viewport) {
    const { slabThickness } = viewport.getProperties();
    let spacingInNormalDirection = slabThickness;
    if (!slabThickness) {
        spacingInNormalDirection = getSpacingInNormalDirection(imageVolume, viewPlaneNormal);
    }
    return spacingInNormalDirection;
}
//# sourceMappingURL=getTargetVolumeAndSpacingInNormalDir.js.map