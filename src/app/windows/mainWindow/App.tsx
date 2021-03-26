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
    height: "100vw",
    backgroundColor: SetOpacity(theme.palette.background, 0.4),
    backgroundImage: `linear-gradient(to bottom right, ${SetOpacity(theme.palette.background, 0.2)}, ${SetOpacity(theme.palette.background, 0)})`,
    backdropFilter: "blur(7px)",
    boxShadow: "10px 10px 10px rgba(30, 30, 30, 0.1)"
};

const titlebarWrapStyle: React.CSSProperties = {
    height: theme.spacing.titlebarHeight,
    width: "100%",
    userSelect: "none",
    position: "relative",
    zIndex: 10,
    backgroundColor: SetOpacity(theme.palette.background, 0.1),
    backdropFilter: "blur(7px)",
    border: `1px solid ${SetOpacity(theme.palette.shadow, 0.5)}`
};

const workWindowWrapStyle: React.CSSProperties = {
    position: 'relative',
    width: "100%",
    height: "100vh",
    top: `-${theme.spacing.titlebarHeight}`
}

const toolbarWrapStyle: React.CSSProperties = {
    height: `100%`,
    width: theme.spacing.toolbarWidth,
    float: "left",
    paddingTop: theme.spacing.titlebarHeight
};

const mainContainerWrapStyle: React.CSSProperties = {
    backgroundColor: theme.palette.background,
    height: `100%`,
    width: "auto",
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
                <div className="workWindow" style={workWindowWrapStyle}>
                    <div className="toolbarWrap" style={toolbarWrapStyle}>
                        <ToolBar/>
                    </div>
                    <div className="mainContainerWrap" style={mainContainerWrapStyle}>
                        <Canvas/>
                    </div>
                </div>
            </div>
        );
    }
}

export default App
