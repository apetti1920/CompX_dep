import {PointType} from "../../../shared/types";
import {BlockStorageType, DataTransferType} from "@compx/sharedtypes";
import React from "react";
import * as d3 from 'd3';

interface IntBlockVisualType {
    id: string;
    position: PointType;
    size: PointType;
    mirrored: boolean;
    selected: boolean;
    blockStorage: BlockStorageType
}

export class BlockVisualType {
    id: string;
    position: PointType;
    size: PointType;
    mirrored: boolean;
    selected: boolean;
    blockStorage: BlockStorageType
    readonly displayStatic?: ((size: PointType, T?: number) => React.ReactElement | undefined);
    readonly displayDynamic?: ((displayData: DataTransferType[], size: PointType, T?: number) => React.ReactElement | undefined);

    public constructor(init: IntBlockVisualType) { //init?:Partial<BlockVisualType>
        this.id = init.id;
        this.position = init.position;
        this.size = init.size;
        this.mirrored = init.mirrored;
        this.selected = init.selected;
        this.blockStorage = init.blockStorage;

        if (this.blockStorage.display !== undefined && this.blockStorage.display.displayStatic !== undefined) {
            this.displayStatic = (new Function("React", "d3", "displayData", "size", "T",
                this.blockStorage.display.displayStatic)).bind(React, d3);
        } else {
            this.displayStatic = undefined;
        }

        if (this.blockStorage.display !== undefined && this.blockStorage.display.displayDynamic !== undefined) {
            this.displayDynamic = (new Function("React", "d3", "displayData", "size", "T",
                this.blockStorage.display.displayDynamic)).bind(undefined, React, d3);
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
