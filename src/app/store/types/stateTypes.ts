import {CanvasType} from "./canvasTypes";
import {BlockStorageType} from "../../../shared/lib/GraphLibrary/types/BlockStorage";
import {GraphVisualType} from "./graphTypes";
import {MouseDownType} from "../../windows/mainWindow/components/types";

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
        mouse: {mouseDownOn: MouseDownType.NONE, currentMouseLocation: undefined}
    },
    blockLibrary: [],
    graph: {blocks: [], edges: []},
    displayData: undefined
}
