import {SidebarButtonType, SplitPaneName} from "../types";
import {ClickedSidebarButtonActionType, MovedCanvas, MovedSplitPaneActionType, ZoomedCanvas} from "./actionTypes";
import {PointType} from "../../components/types";

export const ClickedSidebarButtonAction = (button: SidebarButtonType) => {
    return {
        type: ClickedSidebarButtonActionType,
        payload: button
    }
};

export const MovedSplitPaneAction = (splitName: SplitPaneName, newSize: number) => {
    return {
        type: MovedSplitPaneActionType,
        payload: {name: splitName, size: newSize}
    }
};

export const MovedCanvasAction = (newTranslation: PointType) => {
    return {
        type: MovedCanvas,
        payload: {newTranslation: newTranslation}
    }
};

export const ZoomedCanvasAction = (newZoom: number) => {
    return {
        type: ZoomedCanvas,
        payload: {newZoom: newZoom}
    }
};
