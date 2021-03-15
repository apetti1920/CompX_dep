import React, {Component} from 'react';
import './App.css';

import ToolBar from "./components/BreadCrumbToolBar/Toolbar";
import {connect} from "react-redux";
import {StateType, SplitSizeDictionaryType, SidebarButtonType} from "../../store/types";
import Canvas from "./components/Canvas/Canvas";
import {IpcService} from "../../IPC/IpcService";
import {BlockStorageType} from "../../../shared/lib/GraphLibrary/types/BlockStorage";
import {BLOCK_LIBRARY_CHANNEL} from "../../../shared/Channels";
import store from "../../store"
import {UpdatedBlockLibraryActionType} from "../../store/types/actionTypes";

const pageWrapStyle: React.CSSProperties = {
    width: "100vw",
    height: "100vw"
};

const toolbarWrapStyle: React.CSSProperties = {
    height: "var(--toolbar-height)",
    width: "100%",
    borderBottom: "1px solid var(--custom-accent-color)"
};

const mainContainerWrapStyle: React.CSSProperties = {
    height: 'calc(100vh - var(--toolbar-height))',
    width: "100%"
};

type Props = {
    SidebarButtons: SidebarButtonType[],
    SplitSizes: SplitSizeDictionaryType
}

type State = {
    editBlockWindowOpen: boolean
}

class App extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            editBlockWindowOpen: false
        }
    }

    componentDidMount() {
        const ipc = new IpcService();
        ipc.send<BlockStorageType[]>(BLOCK_LIBRARY_CHANNEL)
            .then(res => {
                store.dispatch({type: UpdatedBlockLibraryActionType, payload: res});
            }).catch((err) => {
            console.log(err);
        });
    }

    render() {
        return (
            <div className="pageWrap" style={pageWrapStyle}>
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

function mapStateToProps(state: StateType): Props {
    return {
        SidebarButtons: state.canvas.sidebarButtons,
        SplitSizes: state.canvas.splitSizes
    };
}

export default connect(mapStateToProps, {})(App)
