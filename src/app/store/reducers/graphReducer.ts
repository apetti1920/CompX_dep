import {GraphVisualType} from "../types/graphTypes";
import {defaultState} from "../types/stateTypes";
import {ActionType} from "../types";
import {UpdatedGraphActionType} from "../actions/actionTypes";

export default function (graph: GraphVisualType = defaultState.graph, action: ActionType): GraphVisualType {
    return graph;
}
