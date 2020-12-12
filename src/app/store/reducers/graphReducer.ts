import {defaultState, ActionType, GraphVisualType} from "../types";

export default function (graph: GraphVisualType = defaultState.graph, action: ActionType): GraphVisualType {
    return graph;
}
