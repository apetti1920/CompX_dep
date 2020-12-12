import {ActionType, SidebarButtonType, SplitPaneName, GraphVisualType, CanvasSelectedItemType} from "../types";
import {
    ClickedSidebarButtonActionType,
    MovedCanvasActionType,
    MovedSplitPaneActionType,
    UpdatedBlockLibraryActionType,
    ZoomedCanvasActionType,
    UpdatedGraphActionType, UpdatedCanvasSelectionType

} from "../types/actionTypes";
import {PointType} from "../../../shared/types";
import {BlockStorageType} from "../../../shared/lib/GraphLibrary/types/BlockStorage";

export const ClickedSidebarButtonAction = (button: SidebarButtonType): ActionType => {
    return {
        type: ClickedSidebarButtonActionType,
        payload: button
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

export const UpdatedBlockLibraryAction = (newBlocks: BlockStorageType[]): ActionType => {
    return {
        type: UpdatedBlockLibraryActionType,
        payload: {newBlocks: newBlocks}
    }
}

export const UpdatedGraphAction = (newGraph: GraphVisualType): ActionType => {
    return {
        type: UpdatedGraphActionType,
        payload: {newGraph: newGraph}
    }
}

export const UpdatedCanvasSelectionAction = (newSelections: CanvasSelectedItemType[]): ActionType => {
    return {
        type: UpdatedCanvasSelectionType,
        payload: {newSelections: newSelections}
    }
}
