import {ActionType, StateType} from "../types";
import {
    MovedCanvasActionType,
    ZoomedCanvasActionType,
    MouseActionType,
    DraggingLibraryBlockActionType,
    ChangedContextMenuActionType,
    ChangedModalActionType
} from "../types/actionTypes";

const _ = require('lodash');

export default function(state: StateType, action: ActionType): StateType {
    switch (action.type) {
        case MovedCanvasActionType: {
            const newTranslation = action.payload['newTranslation'];
            const tempState = _.cloneDeep(state);
            tempState.canvas.translation = newTranslation;
            tempState.canvas.oneOffElements.contextMenu = undefined;
            tempState.canvas.oneOffElements.modal = undefined;
            return tempState
        } case ZoomedCanvasActionType: {
            const newZoom = action.payload['newZoom'];
            const tempState = _.cloneDeep(state);
            tempState.canvas.zoom = newZoom;
            tempState.canvas.oneOffElements.contextMenu = undefined;
            tempState.canvas.oneOffElements.modal = undefined;
            return tempState;
        }  case (MouseActionType): {
            const tempState = _.cloneDeep(state);
            tempState.canvas.mouse = action.payload["newMouse"];
            tempState.canvas.oneOffElements.contextMenu = undefined;
            tempState.canvas.oneOffElements.modal = undefined;
            return tempState;
        } case (DraggingLibraryBlockActionType): {
            const tempState = _.cloneDeep(state);
            tempState.canvas.isDraggingFromBlockLibrary = action.payload["draggingState"];
            tempState.canvas.oneOffElements.contextMenu = undefined;
            tempState.canvas.oneOffElements.modal = undefined;
            return tempState;
        } case (ChangedContextMenuActionType): {
            const tempState = _.cloneDeep(state);
            tempState.canvas.oneOffElements.contextMenu = action.payload["contextMenu"];
            tempState.canvas.oneOffElements.modal = undefined;
            return tempState;
        } case (ChangedModalActionType): {
            const tempState = _.cloneDeep(state);
            tempState.canvas.oneOffElements.contextMenu = undefined;
            tempState.canvas.oneOffElements.modal = action.payload["modal"];
            return tempState;
        } default: {
            return _.cloneDeep(state);
        }
    }
}
