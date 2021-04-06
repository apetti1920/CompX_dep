import {ActionType, StateType} from "../types";
import {AddedDisplayDataActionType, ClearedDisplayDataActionType} from "../types/actionTypes";

const _ = require('lodash');

export default function (state: StateType, action: ActionType): StateType {
    switch (action.type) {
        case AddedDisplayDataActionType: {
            const tempState  = _.cloneDeep(state);
            if (tempState.displayData === undefined) {
                tempState.displayData = [];
            }

            tempState.displayData.push(action.payload);
            return tempState
        } case ClearedDisplayDataActionType: {
            const tempState  = _.cloneDeep(state);
            tempState.displayData = undefined;
            return tempState
        } default: {
            return _.cloneDeep(state);
        }
    }
}
