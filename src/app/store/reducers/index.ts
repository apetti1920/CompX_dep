import {combineReducers} from "redux";

import SidebarButtonReducer from "./sidebarButtonReducer";
import ActiveSidebarButtonReducer from "./activeSidebarButtonsReducer";
import SplitReducer from "./splitReducers";
import canvasReducers from "./canvasReducers";
import blockLibraryReducer from "./blockLibraryReducer";
import GraphReducer from "./graphReducer";

export default combineReducers({
    sidebarButtons: SidebarButtonReducer,
    activeSidebarButtons: ActiveSidebarButtonReducer,
    splitSizes: SplitReducer,
    canvas: canvasReducers,
    blockLibrary: blockLibraryReducer,
    graph: GraphReducer
});
