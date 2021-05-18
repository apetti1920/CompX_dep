import {CanvasType} from "./canvasTypes";
import {BlockStorageType} from "@compx/sharedtypes";
import {GraphVisualType} from "./graphTypes";
import {MouseDownType} from "../../windows/mainWindow/components/types";
import {ContextMenu} from "../../windows/mainWindow/components/ComponentUtils/ContextMenu/ContextMenu";
import * as React from "react";

export type DisplayDataType = {
    time: number,
    data: Map<string, any>
}

export type StateType = {
    canvas: CanvasType,
    blockLibrary: BlockStorageType[],
    graph: GraphVisualType,
    displayData?: DisplayDataType[]
}

export const defaultState: StateType = {
    canvas: {
        zoom: 1,
        translation: {x: 0, y: 0},
        isDraggingFromBlockLibrary: false,
        mouse: {mouseDownOn: MouseDownType.NONE, currentMouseLocation: undefined},
        oneOffElements: {
            contextMenu: undefined,
            modal: undefined
        }
    },
    blockLibrary: [],
    graph: {blocks: [], edges: []},
    displayData: undefined
}
