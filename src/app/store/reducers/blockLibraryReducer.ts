import {ActionType, StateType} from "../types";
import {UpdatedBlockLibraryActionType} from "../types/actionTypes";

export default function (state: StateType, action: ActionType): StateType {
    switch (action.type) {
        case (UpdatedBlockLibraryActionType): {
            const tempState = {...state};
            tempState.blockLibrary = action.payload;
            return tempState;
        } default: {
            return state;
        }
    }
}
