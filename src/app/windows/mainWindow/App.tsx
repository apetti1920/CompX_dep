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

const pageWrapStyle: React.CSSProperties = {
    width: "100vw",
    height: "100vh",
    display: "flex",
    flexFlow: "column nowrap",
    ...GetGlassStyle(theme.palette.background, 0.4)
};

const titlebarWrapStyle: React.CSSProperties = {
    height: `${theme.spacing.titlebarHeight}px`,
    width: "100%",
    userSelect: "none"
};

const toolbarWrapStyle: React.CSSProperties = {
    width: `100%`,
    height: `${theme.spacing.toolbarHeight}px`
};

const mainContainerWrapStyle: React.CSSProperties = {
    width: "100%",
    flexGrow: 1,
    backgroundColor: theme.palette.background,
    padding: "0px",
    borderRadius: "10px 10px 0px 0px",
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
