import {ActionType, SidebarButtonType} from "../types";
import {defaultState} from "../types/stateTypes";

export default function (sidebarButtons: SidebarButtonType[] = defaultState.sidebarButtons, action: ActionType): SidebarButtonType[] {
    return sidebarButtons;
}
