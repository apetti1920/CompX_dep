import {
    ActionType,
    SidebarButtonType,
    SplitPaneName,
    GraphVisualType, MouseType, BlockVisualType,
} from "../types";
import {
    ClickedSidebarButtonActionType,
    MovedCanvasActionType,
    MovedSplitPaneActionType,
    UpdatedBlockLibraryActionType,
    ZoomedCanvasActionType,
    MovedBlockActionType,
    MouseActionType,
    AddedBlockActionType,
    UpdatedBlockActionType,
    DraggingLibraryBlockActionType, DeselectAllBlocksType

} from "../types/actionTypes";
import {PointType} from "../../../shared/types";
import {BlockStorageType} from "../../../shared/lib/GraphLibrary/types/BlockStorage";
import {Simulate} from "react-dom/test-utils";
import drag = Simulate.drag;

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

export const DraggingLibraryBlockAction = (draggingState: boolean): ActionType => {
    return {
        type: DraggingLibraryBlockActionType,
        payload: {draggingState: draggingState}
    }
};


// Graph Actions
export const MovedBlockAction = (delta: PointType): ActionType => {
    return {
        type: MovedBlockActionType,
        payload: {delta: delta}
    }
}

export const AddedBlockAction = (blockStorageId: string, position: PointType, size: PointType): ActionType => {
    return {
        type: AddedBlockActionType,
        payload: {
            blockStorageId: blockStorageId,
            position: position,
            size: size
        }
    }
}

export const UpdatedBlockAction = (block: BlockVisualType): ActionType => {
    return {
        type: UpdatedBlockActionType,
        payload: {
            block: block
        }
    }
}

export const DeselectAllBlocksAction = (): ActionType => {
    return {
        type: DeselectAllBlocksType,
        payload: null
    }
}
