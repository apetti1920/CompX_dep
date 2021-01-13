import {ActionType, SidebarButtonType, StateType} from "../types";
import {
    MovedCanvasActionType,
    ZoomedCanvasActionType,
    ClickedSidebarButtonActionType,
    MovedSplitPaneActionType
} from "../types/actionTypes";

export default function(state: StateType, action: ActionType): StateType {
    switch (action.type) {
        case MovedCanvasActionType: {
            const newTranslation = action.payload['newTranslation'];
            const tempState = {...state};
            tempState.canvas.translation = newTranslation;
            return tempState
        } case ZoomedCanvasActionType: {
            const newZoom = action.payload['newZoom'];
            const tempState = {...state};
            tempState.canvas.zoom = newZoom;
            return tempState;
        } case ClickedSidebarButtonActionType: {
            const tempState = {...state};
            const button: SidebarButtonType = action.payload['button'];

            for (let i=0; i<tempState.canvas.sidebarButtons.length; i++) {
                if (tempState.canvas.sidebarButtons[i].groupId === button.groupId) {
                    if (tempState.canvas.sidebarButtons[i].buttonId === button.buttonId) {
                        tempState.canvas.sidebarButtons[i].selected = !tempState.canvas.sidebarButtons[i].selected
                    } else {
                        tempState.canvas.sidebarButtons[i].selected = false;
                    }
                }
            }

            return tempState
        } case MovedSplitPaneActionType: {
            const pane = action.payload;
            const tempState = {...state};
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            tempState.canvas.splitSizes[pane['name']] = pane['size'];
            return tempState;
        } default: {
            return state;
        }
    }
}
