import {PointType} from "../../../shared/types";
import {BlockStorageType, DataTransferType} from "../../../shared/lib/GraphLibrary/types/BlockStorage";
import React from "react";

export class BlockVisualType {
    id: string;
    position: PointType;
    size: PointType;
    mirrored: boolean;
    selected: boolean;
    blockStorage: BlockStorageType
    readonly displayStatic: ((displayData: DataTransferType[]) => React.ReactElement | undefined);
    readonly displayDynamic: ((displayData: DataTransferType[]) => React.ReactElement | undefined);

    public constructor(init?:Partial<BlockVisualType>) {
        Object.assign(this, init);

        if (this.blockStorage.display !== undefined && this.blockStorage.display.displayStatic !== undefined) {
            this.displayStatic = (new Function("React", "displayData", this.blockStorage.display.displayStatic)).bind(undefined, React);
        } else {
            this.displayStatic = undefined;
        }

        if (this.blockStorage.display !== undefined && this.blockStorage.display.displayDynamic !== undefined) {
            this.displayDynamic = (new Function("React", "displayData", this.blockStorage.display.displayDynamic)).bind(undefined, React);
        } else {
            this.displayDynamic = undefined;
        }
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
