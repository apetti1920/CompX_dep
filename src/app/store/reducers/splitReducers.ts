import {MovedSplitPaneActionType} from "../actions/actionTypes";
import {ActionType, SplitSizeDictionaryType} from "../types";
import {defaultState} from "../types/stateTypes";

export default function(splitPaneElement0MovableSize: SplitSizeDictionaryType = defaultState.splitSizes, action: ActionType): SplitSizeDictionaryType {
    switch (action.type) {
        case MovedSplitPaneActionType: {
            const pane = action.payload;
            const tempState = {...splitPaneElement0MovableSize};
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            tempState[pane.name] = pane.size;
            return tempState
        }
        default:
            return splitPaneElement0MovableSize;
    }
}
