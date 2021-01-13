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
export const ZoomedCanvasActionType = `@@${CanvasReducerName}/ZOOMED_CANVAS`;

// Graph Reducer Types
export const UpdatedGraphActionType = `@@${GraphReducerName}/UPDATED_GRAPH`;
export const MovedBlockActionType = `@@${GraphReducerName}/MOVED_BLOCK`;
