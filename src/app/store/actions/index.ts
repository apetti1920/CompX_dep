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
    DraggingLibraryBlockActionType,
    DeselectAllBlocksActionType,
    ToggleSelectedBlockActionType,
    AddedEdgeActionType,
    MirrorBlockActionType, DeleteBlockActionType

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
export const ClickedSidebarButtonAction = (buttonGroup: number, buttonId: number): ActionType => {
    return {
        type: ClickedSidebarButtonActionType,
        payload: {group: buttonGroup, id: buttonId}
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

export const AddedEdgeAction = (block1VisualId: string, port1VisualId: string,
                                block2VisualId: string, port2VisualId: string): ActionType => {
    return {
        type: AddedEdgeActionType,
        payload: {
            block1VisualId: block1VisualId, port1VisualId: port1VisualId,
            block2VisualId: block2VisualId, port2VisualId: port2VisualId
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

export const MirrorBlockAction = (visualBlockId: string): ActionType => {
    return {
        type: MirrorBlockActionType,
        payload: {blockId: visualBlockId}
    }
}

export const DeleteBlockAction = (visualBlockId: string): ActionType => {
    return {
        type: DeleteBlockActionType,
        payload: {blockId: visualBlockId}
    }
}
