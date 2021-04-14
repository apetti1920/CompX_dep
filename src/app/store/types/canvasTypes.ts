import {PointType} from "../../../shared/types";
import {MouseDownType} from "../../windows/mainWindow/components/types";
import React from "react";

export type MouseType = {mouseDownOn: MouseDownType, currentMouseLocation?: PointType}

export type CanvasType = {
    zoom: number,
    translation: PointType,
    isDraggingFromBlockLibrary: boolean
    mouse: MouseType,
    oneOffElements: {
        contextMenu?: React.ReactElement,
        modal?: React.ReactElement
    }
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
