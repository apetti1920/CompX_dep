import {combineReducers} from "redux";

import canvasReducers from "./canvasReducers";
import blockLibraryReducer from "./blockLibraryReducer";
import GraphReducer from "./graphReducer";

export default combineReducers({
    canvas: canvasReducers,
    blockLibrary: blockLibraryReducer,
    graph: GraphReducer,
});
