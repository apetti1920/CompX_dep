import {CanvasType} from "./canvasTypes";
import {BlockStorageType} from "../../../shared/lib/GraphLibrary/types/BlockStorage";
import {GraphVisualType} from "./graphTypes";
import {MouseDownType} from "../../windows/mainWindow/components/types";

export type StateType = {
    canvas: CanvasType,
    blockLibrary: BlockStorageType[]
    graph: GraphVisualType
}

export const defaultState: StateType = {
    canvas: {
        zoom: 1,
        translation: {x: 0, y: 0},
        splitSizes: {
            "EditorTerminalSplit": 650,
            "FunctionalWorkSplit": 250,
            "EditCanvasSplit": 250
        },
        sidebarButtons: [
            {groupId: 0, buttonId: 0, text: "Block Library", selected: false},
            {groupId: 0, buttonId: 1, text: "Block Editor", selected: false},
            {groupId: 0, buttonId: 2, text: "button2", selected: false},
            {groupId: 1, buttonId: 0, text: "button3", selected: false}
        ],
        mouse: {mouseDownOn: MouseDownType.NONE, currentMouseLocation: undefined}
    },
    blockLibrary: [],
    graph: {blocks: [], edges: []},

}
