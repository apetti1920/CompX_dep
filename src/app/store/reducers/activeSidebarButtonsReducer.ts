import {ClickedSidebarButtonActionType} from "../actions/actionTypes";
import { defaultState } from "../types/stateTypes";
import {ActionType, ActiveSidebarDictionary} from "../types";

export default function (activeSidebarButtons: ActiveSidebarDictionary = defaultState.activeSidebarButtons, action: ActionType): ActiveSidebarDictionary {
    switch (action.type) {
        case ClickedSidebarButtonActionType: {
            const button = action.payload;
            const tempActiveSidebarButtons = {...activeSidebarButtons};
            if (!(Object.prototype.hasOwnProperty.call(tempActiveSidebarButtons, button.groupId)) ||
                (tempActiveSidebarButtons[button.groupId] !== button.buttonId)) {
                tempActiveSidebarButtons[button.groupId] = button.buttonId
            } else {
                delete tempActiveSidebarButtons[button.groupId]
            }
            return tempActiveSidebarButtons;
        }
    }
    return activeSidebarButtons;
}
