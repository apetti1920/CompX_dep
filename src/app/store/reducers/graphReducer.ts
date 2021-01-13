import {defaultState, ActionType, StateType, GraphVisualType} from "../types";
import {MovedBlockActionType, UpdatedGraphActionType} from "../types/actionTypes";
import {PointType} from "../../../shared/types";

export default function (state: StateType, action: ActionType): StateType {
    switch (action.type) {
        case UpdatedGraphActionType: {
            const tempState = {...state};
            tempState.graph = action.payload["newGraph"];
            return tempState;
        } case MovedBlockActionType: {
            const tempState  = {...state};
            const delta: PointType = action.payload['delta'];

            for (let i=0; i<tempState.graph.blocks.length; i++) {
                if (tempState.graph.blocks[i].selected) {
                    tempState.graph.blocks[i].position = {
                        x: tempState.graph.blocks[i].position.x + delta.x / (state.canvas.zoom),
                        y: tempState.graph.blocks[i].position.y + delta.y / (state.canvas.zoom),
                    }
                }
            }

            return tempState;
        } default: {
            return state;
        }
    }
}
