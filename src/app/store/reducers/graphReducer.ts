import {ActionType, StateType} from "../types";
import {
    AddedBlockActionType,
    DeselectAllBlocksType,
    MovedBlockActionType,
    UpdatedBlockActionType
} from "../types/actionTypes";
import {PointType} from "../../../shared/types";
import { v4 as uuidv4 } from 'uuid';

const _ = require('lodash');

export default function (state: StateType, action: ActionType): StateType {
    switch (action.type) {
        case MovedBlockActionType: {
            const tempState  = _.cloneDeep(state);
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
        } case (AddedBlockActionType): {
            const tempState: StateType  = _.cloneDeep(state);
            tempState.graph.blocks.push({
                id: uuidv4(),
                position: action.payload['position'],
                mirrored: false,
                size: action.payload['size'],
                selected: false,
                blockStorage: _.cloneDeep(tempState.blockLibrary.find(b => b.id === action.payload['blockStorageId']))
            });
            return tempState;
        } case (UpdatedBlockActionType): {
            const tempState: StateType  = _.cloneDeep(state);
            const blockIndex = tempState.graph.blocks.findIndex(b => b.id === action.payload['block'].id);
            tempState.graph.blocks[blockIndex] = action.payload['block'];
            return tempState;
        } case (DeselectAllBlocksType): {
            const tempState: StateType  = _.cloneDeep(state);
            if (tempState.graph.blocks.map(b => b.selected).some(s => s === true)) {
                for (let i=0; i<tempState.graph.blocks.length; i++) {
                    if (tempState.graph.blocks[i].selected) {
                        tempState.graph.blocks[i].selected = false;
                    }
                }
            }
            return tempState;
        } default: {
            return _.cloneDeep(state);
        }
    }
}
