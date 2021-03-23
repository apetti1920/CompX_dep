import React, {Component} from 'react';
import './App.css';

import ToolBar from "./components/BreadCrumbToolBar/Toolbar";
import Canvas from "./components/Canvas/Canvas";
import {IpcService} from "../../IPC/IpcService";
import {BlockStorageType} from "../../../shared/lib/GraphLibrary/types/BlockStorage";
import {BLOCK_LIBRARY_CHANNEL} from "../../../shared/Channels";
import store from "../../store"
import {UpdatedBlockLibraryActionType} from "../../store/types/actionTypes";

import theme from "../../theme";
import {SetOpacity} from "../../utilities";

const pageWrapStyle: React.CSSProperties = {
    width: "100vw",
    height: "100vw"
};

const glass: React.CSSProperties = {
    backgroundColor: SetOpacity(theme.palette.background, 0.4),
    backgroundImage: `linear-gradient(to bottom right, ${SetOpacity(theme.palette.background, 0.2)}, ${SetOpacity(theme.palette.background, 0)})`,
    backdropFilter: "blur(7px)",
    boxShadow: "10px 10px 10px rgba(30, 30, 30, 0.1)"
}

const titlebarWrapStyle: React.CSSProperties = {
    ...glass,
    height: "35px",
    width: "100%",
    userSelect: "none",
};

const toolbarWrapStyle: React.CSSProperties = {
    ...glass,
    position: "relative",
    height: `calc(${theme.spacing.toolbarHeight} + 45px)`,
    width: "100%",
    zIndex: -1
};

const mainContainerWrapStyle: React.CSSProperties = {
    backgroundColor: theme.palette.background,
    position: 'relative',
    height: `calc(100vh - ${theme.spacing.toolbarHeight} - 35px)`,
    width: "100%",
    top: `-45px`,
    padding: "0px",
    borderRadius: "45px 45px 0px 0px",
    boxShadow: `0px 0 10px ${theme.palette.shadow}`,
    borderTop: `1px solid ${theme.palette.accent}`,
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
                    <ToolBar/>
                </div>
                <div className="mainContainerWrap" style={mainContainerWrapStyle}>
                    <Canvas/>
                </div>
            </div>
        );
    }
}

export default App
