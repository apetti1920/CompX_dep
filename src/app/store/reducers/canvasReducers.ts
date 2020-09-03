import {defaultState} from "../types/stateTypes";
import {CanvasType} from "../types/canvasTypes";
import {MovedCanvas, ZoomedCanvas} from "../actions/actionTypes";
import {ActionType} from "../types";

export default function(canvas: CanvasType = defaultState.canvas, action: ActionType): CanvasType {
    switch (action.type) {
        case MovedCanvas: {
            const newTranslation = action.payload;
            const tempState1 = {...canvas};
            tempState1.translation = newTranslation.newTranslation;
            return tempState1
        }
        case ZoomedCanvas: {
            const newZoom = action.payload;
            const tempState2 = {...canvas};
            tempState2.zoom = newZoom.newZoom;
            return tempState2
        }
        default:
            return canvas;
    }
}
