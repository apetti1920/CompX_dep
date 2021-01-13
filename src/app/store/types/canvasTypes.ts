import {PointType} from "../../../shared/types";

export type CanvasType = {
    zoom: number,
    translation: PointType,
    splitSizes: SplitSizeDictionaryType,
    sidebarButtons: SidebarButtonType[]
}

export type SidebarButtonType = {
    groupId: number,
    buttonId: number,
    text: string,
    selected: boolean
}

export type SplitPaneName = "EditorTerminalSplit" | "FunctionalWorkSplit" | "EditCanvasSplit"

export type SplitSizeDictionaryType = {
    "EditorTerminalSplit": number,
    "FunctionalWorkSplit": number,
    "EditCanvasSplit": number
}
