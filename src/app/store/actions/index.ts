import {
    ActionType,
    SidebarButtonType,
    SplitPaneName, MouseType
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
    DraggingLibraryBlockActionType, DeselectAllBlocksActionType, ToggleSelectedBlockActionType

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

export const ToggleSelectedBlockAction = (visualBlockId: string, selected: boolean): ActionType => {
    return {
        type: ToggleSelectedBlockActionType,
        payload: {visualBlockId: visualBlockId, selected: selected}
    }
}

export const DeselectAllBlocksAction = (): ActionType => {
    return {
        type: DeselectAllBlocksActionType,
        payload: null
    }
}
