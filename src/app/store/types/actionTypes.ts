// Reducer Names
export const BlockLibraryReducerName = "block_library_reducer";
export const CanvasReducerName = "canvas_reducer";
export const GraphReducerName = "graph_reducer";

// Block Library Reducer Types
export const UpdatedBlockLibraryActionType = `@@${BlockLibraryReducerName}/UPDATED_BLOCK_LIBRARY`;

// Canvas Reducer Types
export const ClickedSidebarButtonActionType = `@@${CanvasReducerName}/CLICKED_SIDEBAR_BUTTON`;
export const MovedSplitPaneActionType = `@@${CanvasReducerName}/Moved_Split_Pane`;
export const MovedCanvasActionType = `@@${CanvasReducerName}/MOVED_CANVAS`;
export const MouseActionType = `@@${CanvasReducerName}/MOUSE_ACTION`;
export const ZoomedCanvasActionType = `@@${CanvasReducerName}/ZOOMED_CANVAS`;
export const DraggingLibraryBlockActionType = `@@${CanvasReducerName}/DRAGGING_LIBRARY_BLOCK`;

// Graph Reducer Types
export const MovedBlockActionType = `@@${GraphReducerName}/MOVED_BLOCK`;
export const ToggleSelectedBlockActionType = `@@${GraphReducerName}/TOGGLE_SELECTED_BLOCK`;
export const AddedBlockActionType = `@@${GraphReducerName}/ADDED_BLOCK`;
export const AddedEdgeActionType = `@@${GraphReducerName}/ADDED_EDGE`;
export const DeselectAllBlocksActionType = `@@${GraphReducerName}/DESELECT_ALL_BLOCKS`;
export const MirrorBlockActionType = `@@${GraphReducerName}/MIRROR_BLOCK`;
