import {GraphVisualType} from "../types/graphTypes";
import {defaultState} from "../types/stateTypes";
import {ActionType} from "../types";

export default function (graph: GraphVisualType = defaultState.graph, action: ActionType): GraphVisualType {
    return graph;
}
