import {PointType} from "../../../shared/types";
import {BlockStorageType} from "../../../shared/lib/GraphLibrary/types/BlockStorage";

export class BlockVisualType {
    id: string;
    position: PointType;
    size: PointType;
    mirrored: boolean;
    blockStorage: BlockStorageType

    public constructor(init?:Partial<BlockVisualType>) {
        Object.assign(this, init);
    }
}

export type EdgeVisualType = {
    id: string,
    outputBlockVisualID: string,
    outputPortID: string,
    inputBlockVisualID: string,
    inputPortID: string,
    type: "number"
}

export type GraphVisualType = {
    blocks: BlockVisualType[];
    edges: EdgeVisualType[];
}
