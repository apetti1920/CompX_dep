import {PointType} from "../../../shared/types";
import {MouseDownType} from "../../windows/mainWindow/components/types";

export type MouseType = {mouseDownOn: MouseDownType, currentMouseLocation?: PointType}

export type CanvasType = {
    zoom: number,
    translation: PointType,
    splitSizes: SplitSizeDictionaryType,
    sidebarButtons: SidebarButtonType[],
    isDraggingFromBlockLibrary: boolean
    mouse: MouseType
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
