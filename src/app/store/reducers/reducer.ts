import {ActionType, defaultState, StateType} from "../types";
import BlockLibraryReducer from "./blockLibraryReducer";
import CanvasReducer from "./canvasReducers";
import GraphReducer from "./graphReducer";
import DisplayDataReducer from "./displayDataReducers"
import {
    BlockLibraryReducerName,
    CanvasReducerName,
    DisplayDataReducerName,
    GraphReducerName
} from "../types/actionTypes";

export default function (state: StateType = defaultState, action: ActionType): StateType {
    let reducer = action.type.split("/")[0];
    if (reducer.substring(0, 2) != "@@") return state;
    reducer = reducer.substring(2);

    switch (reducer) {
        case (BlockLibraryReducerName): {
            return BlockLibraryReducer(state, action);
        } case (CanvasReducerName): {
            return CanvasReducer(state, action);
        } case (GraphReducerName): {
            return GraphReducer(state, action);
        } case (DisplayDataReducerName): {
            return DisplayDataReducer(state, action);
        } default: {
            return state
        }
    }
}
