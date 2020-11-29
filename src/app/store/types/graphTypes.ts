import {PointType} from "../../mainWindow/components/types";
import {BlockStorageType} from "../../../shared/lib/GraphLibrary/types/BlockStorage";
import store from "../index"

export class BlockVisualType {
    id: string;
    position: PointType;
    size: PointType;
    mirrored: boolean;
    blockStorageID: string;

    public constructor(init?:Partial<BlockVisualType>) {
        Object.assign(this, init);
    }

    getBlock(): BlockStorageType {
        return store.getState().blockLibrary.find(storageBlock => storageBlock.id === this.blockStorageID);
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
