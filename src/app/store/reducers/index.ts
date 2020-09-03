import {combineReducers} from "redux";

import SidebarButtonReducer from "./sidebarButtonReducer";
import ActiveSidebarButtonReducer from "./activeSidebarButtonsReducer";
import SplitReducer from "./splitReducers";
import canvasReducers from "./canvasReducers";

export default combineReducers({
    sidebarButtons: SidebarButtonReducer,
    activeSidebarButtons: ActiveSidebarButtonReducer,
    splitSizes: SplitReducer,
    canvas: canvasReducers
})
