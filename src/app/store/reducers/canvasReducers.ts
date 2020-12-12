import {defaultState, ActionType, CanvasType} from "../types";
import {
    MovedCanvasActionType,
    ZoomedCanvasActionType,
    ClickedSidebarButtonActionType,
    MovedSplitPaneActionType,
    UpdatedCanvasSelectionType
} from "../types/actionTypes";

export default function(canvas: CanvasType = defaultState.canvas, action: ActionType): CanvasType {
    switch (action.type) {
        case MovedCanvasActionType: {
            const newTranslation = action.payload;
            const tempState = {...canvas};
            tempState.translation = newTranslation.newTranslation;
            return tempState
        } case ZoomedCanvasActionType: {
            const newZoom = action.payload;
            const tempState = {...canvas};
            tempState.zoom = newZoom.newZoom;
            return tempState
        } case ClickedSidebarButtonActionType: {
            const button = action.payload;
            const tempActiveSidebarButtons = {...canvas.activeSidebarButtons};
            if (!(Object.prototype.hasOwnProperty.call(tempActiveSidebarButtons, button.groupId)) ||
                (tempActiveSidebarButtons[button.groupId] !== button.buttonId)) {
                tempActiveSidebarButtons[button.groupId] = button.buttonId
            } else {
                delete tempActiveSidebarButtons[button.groupId]
            }
            const tempState = {...canvas};
            tempState.activeSidebarButtons = tempActiveSidebarButtons;
            return tempState;
        } case MovedSplitPaneActionType: {
            const pane = action.payload;
            const tempState = {...canvas};
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            tempState.splitSizes[pane.name] = pane.size;
            return tempState
        } case UpdatedCanvasSelectionType: {
            const newSelection = action.payload;
            const tempCanvas = {...canvas};
            tempCanvas.canvasSelectedItems = newSelection["newSelections"];
            return tempCanvas;
        } default: {
            return canvas;
        }
    }
}
