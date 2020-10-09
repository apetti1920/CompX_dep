import {PointType} from "../app/components/types";
import {BlockStorageType} from "../lib/GraphLibrary/types/BlockStorage";

export type BlockVisualType = {
    id: string,
    position: PointType,
    size: PointType,
    rotation: "0"|"90"|"180"|"270",
    blockData: BlockStorageType
}

export type EdgeVisualType = {
    id: string,
    outputBlockID: string,
    inputBlockID: string,
    type: "number"
}
