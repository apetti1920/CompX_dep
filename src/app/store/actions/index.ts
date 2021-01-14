import {
    ActionType,
    SidebarButtonType,
    SplitPaneName,
    GraphVisualType, MouseType,
} from "../types";
import {
    ClickedSidebarButtonActionType,
    MovedCanvasActionType,
    MovedSplitPaneActionType,
    UpdatedBlockLibraryActionType,
    ZoomedCanvasActionType,
    UpdatedGraphActionType, MovedBlockActionType, MouseActionType

} from "../types/actionTypes";
import {PointType} from "../../../shared/types";
import {BlockStorageType} from "../../../shared/lib/GraphLibrary/types/BlockStorage";

// Block Library Actions
export const UpdatedBlockLibraryAction = (newBlocks: BlockStorageType[]): ActionType => {
    return {
        type: UpdatedBlockLibraryActionType,
        payload: {newBlocks: newBlocks}
    }
}

// Canvas Actions
export const ClickedSidebarButtonAction = (button: SidebarButtonType): ActionType => {
    return {
        type: ClickedSidebarButtonActionType,
        payload: {button: button}
    }
};

export const MovedSplitPaneAction = (splitName: SplitPaneName, newSize: number): ActionType => {
    return {
        type: MovedSplitPaneActionType,
        payload: {name: splitName, size: newSize}
    }
};

export const MovedCanvasAction = (newTranslation: PointType): ActionType => {
    return {
        type: MovedCanvasActionType,
        payload: {newTranslation: newTranslation}
    }
};

export const ZoomedCanvasAction = (newZoom: number): ActionType => {
    return {
        type: ZoomedCanvasActionType,
        payload: {newZoom: newZoom}
    }
};

export const MouseAction = (newMouse: MouseType): ActionType => {
    return {
        type: MouseActionType,
        payload: {newMouse: newMouse}
    }
};


// Graph Actions
export const UpdatedGraphAction = (newGraph: GraphVisualType): ActionType => {
    return {
        type: UpdatedGraphActionType,
        payload: {newGraph: newGraph}
    }
}

export const MovedBlockAction = (delta: PointType): ActionType => {
    return {
        type: MovedBlockActionType,
        payload: {delta: delta}
    }
}
