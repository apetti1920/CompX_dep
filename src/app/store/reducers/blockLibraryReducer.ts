import {ActionType, StateType} from "../types";
import {UpdatedBlockLibraryActionType} from "../types/actionTypes";

const _ = require('lodash');

export default function (state: StateType, action: ActionType): StateType {
    switch (action.type) {
        case (UpdatedBlockLibraryActionType): {
            const tempState = _.cloneDeep(state);
            tempState.blockLibrary = action.payload;
            return tempState;
        } default: {
            return _.cloneDeep(state);
        }
    }
}
