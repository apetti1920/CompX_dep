import {PointType} from "../../../shared/types";
import {BlockStorageType, DataTransferType} from "../../../shared/lib/GraphLibrary/types/BlockStorage";
import React from "react";
import * as d3 from 'd3';

export class BlockVisualType {
    id: string;
    position: PointType;
    size: PointType;
    mirrored: boolean;
    selected: boolean;
    blockStorage: BlockStorageType
    readonly displayStatic: ((displayData: DataTransferType[], size: PointType, T?: number) => React.ReactElement | undefined);
    readonly displayDynamic: ((displayData: DataTransferType[], size: PointType, T?: number) => React.ReactElement | undefined);

    public constructor(init?:Partial<BlockVisualType>) {
        Object.assign(this, init);

        if (this.blockStorage.display !== undefined && this.blockStorage.display.displayStatic !== undefined) {
            this.displayStatic = (new Function("React", "d3", "displayData", "size", "T", this.blockStorage.display.displayStatic)).bind(undefined, React, d3);
        } else {
            this.displayStatic = undefined;
        }

        if (this.blockStorage.display !== undefined && this.blockStorage.display.displayDynamic !== undefined) {
            this.displayDynamic = (new Function("React", "d3", "displayData", "size", "T", this.blockStorage.display.displayDynamic)).bind(undefined, React, d3);
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
