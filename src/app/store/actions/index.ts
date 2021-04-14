import {
    ActionType, MouseType, DisplayDataType
} from "../types";
import {
    ClickedSidebarButtonActionType,
    MovedCanvasActionType,
    UpdatedBlockLibraryActionType,
    ZoomedCanvasActionType,
    MovedBlockActionType,
    MouseActionType,
    AddedBlockActionType,
    DraggingLibraryBlockActionType,
    ChangedContextMenuActionType,
    DeselectAllBlocksActionType,
    ToggleSelectedBlockActionType,
    AddedEdgeActionType,
    MirrorBlockActionType,
    DeleteBlockActionType,
    ChangedInternalDataActionType,
    AddedDisplayDataActionType,
    ClearedDisplayDataActionType, ChangedModalActionType

} from "../types/actionTypes";
import {PointType} from "../../../shared/types";
import {BlockStorageType} from "../../../shared/lib/GraphLibrary/types/BlockStorage";

// Block Library Actions -----------------------------------------------------------------------------------------------
export const UpdatedBlockLibraryAction = (newBlocks: BlockStorageType[]): ActionType => {
    return {
        type: UpdatedBlockLibraryActionType,
        payload: {newBlocks: newBlocks}
    }
}

// Canvas Actions ------------------------------------------------------------------------------------------------------
export const ClickedSidebarButtonAction = (buttonGroup: number, buttonId: number): ActionType => {
    return {
        type: ClickedSidebarButtonActionType,
        payload: {group: buttonGroup, id: buttonId}
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

export const ChangedContextMenuAction = (contextMenu?: React.ReactElement): ActionType => {
    return {
        type: ChangedContextMenuActionType,
        payload: {contextMenu: contextMenu}
    }
};

export const ChangedModalAction = (modal?: React.ReactElement): ActionType => {
    return {
        type: ChangedModalActionType,
        payload: {modal: modal}
    }
};


// Graph Actions -------------------------------------------------------------------------------------------------------
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

export const ChangedInternalDataAction = (blockId: string, internalDataId: string, value: any): ActionType => {
    return {
        type: ChangedInternalDataActionType,
        payload: {blockId: blockId, internalDataId: internalDataId, value: value}
    }
}

// Display Data Actions ------------------------------------------------------------------------------------------------------
export const AddedDisplayDataAction = (displayData: DisplayDataType): ActionType => {
    return {
        type: AddedDisplayDataActionType,
        payload: displayData
    }
};

export const ClearedDisplayDataAction = (): ActionType => {
    return {
        type: ClearedDisplayDataActionType,
        payload: undefined
    }
};
