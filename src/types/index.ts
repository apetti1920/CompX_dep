import {PointType} from "../app/components/types";
import {BlockStorageType} from "../lib/GraphLibrary/types/BlockStorage";

export type BlockVisualType = {
    id: string,
    position: PointType,
    size: PointType,
    mirrored: boolean,
    blockData: BlockStorageType
}

export type EdgeVisualType = {
    id: string,
    outputBlockID: string,
    outputPortID: string,
    inputBlockID: string,
    inputPortID: string,
    type: "number"
}
