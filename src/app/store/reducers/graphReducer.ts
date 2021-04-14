import {ActionType, BlockVisualType, StateType} from "../types";
import {
    AddedBlockActionType, AddedEdgeActionType, ChangedInternalDataActionType, DeleteBlockActionType,
    DeselectAllBlocksActionType, MirrorBlockActionType, MovedBlockActionType, ToggleSelectedBlockActionType
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
            const block = new BlockVisualType({
                id: uuidv4(),
                position: action.payload['position'],
                mirrored: false,
                size: action.payload['size'],
                selected: false,
                blockStorage: _.cloneDeep(tempState.blockLibrary.find(b => b.id === action.payload['blockStorageId']))
            });
            tempState.graph.blocks.push(block);
            return tempState;
        } case (AddedEdgeActionType): {
            let is1Output: boolean|undefined;

            const tempState: StateType  = _.cloneDeep(state);
            const b1 = tempState.graph.blocks.find(b => b.id === action.payload['block1VisualId']);
            if (b1 != undefined){
                is1Output = b1.blockStorage.outputPorts
                    .find(p => p.id === action.payload['port1VisualId']) !== undefined;

                if (is1Output) {
                    const b2 = tempState.graph.blocks.find(b => b.id === action.payload['block2VisualId']);
                    if (b2 !== undefined) {
                        const is2Input = b2.blockStorage.inputPorts
                            .find(p => p.id === action.payload['port2VisualId']) !== undefined;
                        if (!is2Input) {
                            return tempState;
                        }
                    }

                } else {
                    const b2 = tempState.graph.blocks.find(b => b.id === action.payload['block2VisualId']);
                    if (b2 !== undefined) {
                        const is2Output = b2.blockStorage.outputPorts
                            .find(p => p.id === action.payload['port2VisualId']) !== undefined;
                        if (!is2Output) {
                            return tempState;
                        }
                    }
                }
            }

            if (is1Output !== undefined) {
                tempState.graph.edges.push({
                    id: uuidv4(),
                    outputBlockVisualID: is1Output?action.payload['block1VisualId']:action.payload['block2VisualId'],
                    outputPortID: is1Output?action.payload['port1VisualId']:action.payload['port2VisualId'],
                    inputBlockVisualID: is1Output?action.payload['block2VisualId']:action.payload['block1VisualId'],
                    inputPortID: is1Output?action.payload['port2VisualId']:action.payload['port1VisualId'],
                    type: "number"
                });
            }
            return tempState;
        } case (ToggleSelectedBlockActionType): {
            const tempState: StateType  = _.cloneDeep(state);
            const blockIndex = tempState.graph.blocks.findIndex(b => b.id === action.payload['visualBlockId']);
            tempState.graph.blocks[blockIndex].selected = action.payload['selected'];
            return tempState;
        } case (DeselectAllBlocksActionType): {
            const tempState: StateType  = _.cloneDeep(state);
            if (tempState.graph.blocks.map(b => b.selected).some(s => s === true)) {
                for (let i=0; i<tempState.graph.blocks.length; i++) {
                    if (tempState.graph.blocks[i].selected) {
                        tempState.graph.blocks[i].selected = false;
                    }
                }
            }
            return tempState;
        } case (MirrorBlockActionType): {
            const tempState: StateType  = _.cloneDeep(state);
            const blockId = tempState.graph.blocks.findIndex(b => b.id === action.payload['blockId']);
            tempState.graph.blocks[blockId].mirrored = !tempState.graph.blocks[blockId].mirrored;
            return tempState;
        } case (DeleteBlockActionType): {
            const tempState: StateType = _.cloneDeep(state);
            tempState.graph.edges.filter(e => e.inputBlockVisualID === action.payload['blockId'] ||
                e.outputBlockVisualID === action.payload['blockId']).forEach(e => {
                    const index = tempState.graph.edges.findIndex(e2 => e2.id === e.id);
                    tempState.graph.edges.splice(index, 1);
            })
            const index = tempState.graph.blocks.findIndex(b => b.id === action.payload['blockId']);
            tempState.graph.blocks.splice(index, 1);
            return tempState;
        }  case (ChangedInternalDataActionType): {
            const tempState: StateType = _.cloneDeep(state);
            const blockIndex = tempState.graph.blocks.findIndex(b => b.id === action.payload['blockId']);
            const dataIndex = tempState.graph.blocks[blockIndex].blockStorage.internalData
                .findIndex(i => i.id === action.payload['internalDataId']);
            tempState.graph.blocks[blockIndex].blockStorage.internalData[dataIndex].value = action.payload['value'];
            return tempState;
        } default: {
            return _.cloneDeep(state);
        }
    }
}
