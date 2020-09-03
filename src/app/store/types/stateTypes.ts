import {ActiveSidebarDictionary, SidebarButtonType} from "./sidebarTypes";
import {SplitSizeDictionaryType} from "./otherTypes";
import {CanvasType} from "./canvasTypes";

export type StateType = {
    sidebarButtons: SidebarButtonType[],
    activeSidebarButtons: ActiveSidebarDictionary,
    splitSizes: SplitSizeDictionaryType,
    canvas: CanvasType
}

export const defaultState: StateType = {
    sidebarButtons: [
        {groupId: 0, buttonId: 0, text: "button0"},
        {groupId: 0, buttonId: 1, text: "button1"},
        {groupId: 0, buttonId: 2, text: "button2"},
        {groupId: 1, buttonId: 0, text: "button3"}
    ],
    activeSidebarButtons: {},
    splitSizes: {
        "EditorTerminalSplit": 650,
        "FunctionalWorkSplit": 250
    },
    canvas: {
        zoom: 1,
        translation: {x: 0, y: 0}
    }
}
