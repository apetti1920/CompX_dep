import {ActionType, SidebarButtonType} from "../types";
import {defaultState} from "../types/stateTypes";
import {ClickedSidebarButtonActionType} from "../actions/actionTypes";

export default function (sidebarButtons: SidebarButtonType[] = defaultState.sidebarButtons, action: ActionType): SidebarButtonType[] {
    return sidebarButtons;
}
