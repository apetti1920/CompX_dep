import {CanvasSelectionType} from "../../windows/mainWindow/components/types";
import {PointType} from "../../../shared/types";

export type CanvasType = {
    zoom: number,
    translation: PointType,
    splitSizes: SplitSizeDictionaryType,
    activeSidebarButtons: ActiveSidebarDictionary,
    sidebarButtons: SidebarButtonType[],
    canvasSelectedItems: CanvasSelectedItemType[]
}

export type ActiveSidebarDictionary = {[groupId: number] : number}

export type SidebarButtonType = {
    groupId: number,
    buttonId: number,
    text: string
}

export type SplitPaneName = "EditorTerminalSplit" | "FunctionalWorkSplit" | "EditCanvasSplit"

export type SplitSizeDictionaryType = {
    "EditorTerminalSplit": number,
    "FunctionalWorkSplit": number,
    "EditCanvasSplit": number
}

export type CanvasSelectedItemType = {
    selectedType: CanvasSelectionType,
    id: string
}
