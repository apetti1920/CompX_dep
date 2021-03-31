import React, {Component} from 'react';
import './App.css';

import ToolBar from "./components/ToolBar/Toolbar";
import Canvas from "./components/Canvas/Canvas";
import {IpcService} from "../../IPC/IpcService";
import {BlockStorageType} from "../../../shared/lib/GraphLibrary/types/BlockStorage";
import {BLOCK_LIBRARY_CHANNEL} from "../../../shared/Channels";
import store from "../../store"
import {UpdatedBlockLibraryActionType} from "../../store/types/actionTypes";

import theme, {GetGlassStyle} from "../../theme";
import {SetOpacity} from "../../utilities";

const pageWrapStyle: React.CSSProperties = {
    width: "100vw",
    height: "100vw",
    display: "flex",
    flexFlow: "column nowrap",
    backgroundColor: SetOpacity(theme.palette.background, 0.4),
    backgroundImage: `linear-gradient(to bottom right, ${SetOpacity(theme.palette.background, 0.2)}, ${SetOpacity(theme.palette.background, 0)})`,
    backdropFilter: "blur(7px)",
    boxShadow: "10px 10px 10px rgba(30, 30, 30, 0.1)"
};

const titlebarWrapStyle: React.CSSProperties = {
    height: `${theme.spacing.titlebarHeight}px`,
    width: "100%",
    userSelect: "none",
    ...GetGlassStyle(theme.palette.background, 0.4),
    border: `1px solid ${SetOpacity(theme.palette.shadow, 0.5)}`
};

// const workWindowWrapStyle: React.CSSProperties = {
//     position: 'relative',
//     width: "100%",
//     height: "100vh",
//     top: `-${theme.spacing.titlebarHeight}px`
// }

const toolbarWrapStyle: React.CSSProperties = {
    width: `100%`,
    height: `${theme.spacing.toolbarHeight}px`,
    overflow: "hidden",
    backgroundColor: SetOpacity(theme.palette.background, 0.1),
    backdropFilter: "blur(7px)",
    border: `1px solid ${SetOpacity(theme.palette.shadow, 0.5)}`
};

const mainContainerWrapStyle: React.CSSProperties = {
    width: "100%",
    flexGrow: 1,
    backgroundColor: theme.palette.background,
    padding: "0px",
    borderRadius: "7px 0px 0px 7px",
    boxShadow: `0px 0 3px ${theme.palette.shadow}`,
    overflow: "hidden"
};

class App extends Component {
    componentDidMount(): void {
        const ipc = new IpcService();
        ipc.send<BlockStorageType[]>(BLOCK_LIBRARY_CHANNEL)
            .then(res => {
                store.dispatch({type: UpdatedBlockLibraryActionType, payload: res});
            }).catch((err) => {
            console.log(err);
        });
    }

    render(): React.ReactElement {
        return (
            <div className="pageWrap" style={pageWrapStyle}>
                <div className="titlebarWrap" style={titlebarWrapStyle}/>
                <div className="toolbarWrap" style={toolbarWrapStyle}>
                    <ToolBar />
                </div>
                <div className="mainContainerWrap" style={mainContainerWrapStyle}>
                    <Canvas/>
                </div>
            </div>
        );
    }
}

export default App
