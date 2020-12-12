import React, {Component} from 'react';
import './App.css';

import Split from "./components/ComponentUtils/Split";
import BreadCrumbToolBar from "./components/BreadCrumbToolBar/BreadCrumbToolBar";
import Sidebar from "./components/Sidebar/Sidebar";
import {connect} from "react-redux";
import {StateType, ActiveSidebarDictionary, SplitSizeDictionaryType} from "../../store/types";
import Canvas from "./components/Canvas/Canvas";
import BrowserWindow from "./components/BrowserWindow/BrowserWindow";
import {Terminal} from "./components/Terminal/Terminal";
import {IpcService} from "../../IPC/IpcService";
import {BlockStorageType} from "../../../shared/lib/GraphLibrary/types/BlockStorage";
import {BLOCK_LIBRARY_CHANNEL} from "../../../shared/Channels";
import store from "../../store"
import {UpdatedBlockLibraryActionType} from "../../store/types/actionTypes";

const pageWrapStyle: React.CSSProperties = {
    width: "calc(100vw - 2 * var(--border-width)",
    height: "calc(100vh - 2 * var(--border-width)",
    float: "left",
    border: "var(--border-width) solid var(--custom-accent-color)"
};

const breadcrumbToolbarWrapStyle: React.CSSProperties = {
    height: "var(--breadcrumb-toolbar-height)",
    borderBottom: "var(--border-width) solid var(--custom-accent-color)"
};

const mainContainerWrapStyle: React.CSSProperties = {
    height: 'calc(100vh - var(--breadcrumb-toolbar-height))',
    width: "100%"
};

const smallSidebarWrapStyle: React.CSSProperties = {
    height: "100%",
    width: "var(--sidebar-width)",
    borderRight: "var(--border-width) solid var(--custom-accent-color)",
    float: "left"
};

const workWindowWrapStyle: React.CSSProperties = {
    height: "100%",
    marginLeft: "var(--sidebar-width)"
};

const editorWrapStyle: React.CSSProperties = {
    height: "75%"
};

const terminalWrapStyle: React.CSSProperties = {
    height: "25%",
    width: "100%",
    borderTop: "var(--border-width) solid var(--custom-accent-color)"
};

const canvasWrapStyle: React.CSSProperties = {
    height: "100%",
    marginLeft: "var(--browser-bar-width)"
};

type Props = {
    activeSidebarButtons: ActiveSidebarDictionary
    splitSizes: SplitSizeDictionaryType
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

  toggleEditWindow = (editWindowOpen: boolean): void => {
      const tmpState = {...this.state};
      tmpState.editBlockWindowOpen = editWindowOpen;
      this.setState(tmpState);
  }

    componentDidMount() {
        const ipc = new IpcService();
        ipc.send<BlockStorageType[]>(BLOCK_LIBRARY_CHANNEL)
            .then(res => store.dispatch({type: UpdatedBlockLibraryActionType, payload: res}));
    }

    render() {
        let functional: React.ReactNode;
        const canvasComponent = <Canvas/>
        if (Object.keys(this.props.activeSidebarButtons).includes("0")) {
            functional = (
                <Split name="FunctionalWorkSplit"
                       direction="row"
                       firstElementDefault={this.props.splitSizes === undefined ?
                           "250px" : this.props.splitSizes.FunctionalWorkSplit.toString() + "px"}
                       firstElementMax="250px" firstElementMin="103px">
                    {{
                        element0: (<BrowserWindow/>),
                        element1: canvasComponent
                    }}
                </Split>
            )
        } else {
            functional = canvasComponent
        }

        return (
            <div className="pageWrap" style={pageWrapStyle}>
                <div className="breadcrumbToolbarWrap" style={breadcrumbToolbarWrapStyle}>
                    <BreadCrumbToolBar/>
                </div>
                <div className="mainContainerWrap" style={mainContainerWrapStyle}>
                    <div className="smallSidebarWrap" style={smallSidebarWrapStyle}>
                        <Sidebar/>
                    </div>
                    <div className="workWindowWrap" style={workWindowWrapStyle}>
                        <Split name="EditorTerminalSplit"
                               direction="column"
                               firstElementDefault={this.props.splitSizes === undefined ?
                                   "650px" : this.props.splitSizes.EditorTerminalSplit.toString() + "px"}
                               firstElementMin="350px">
                            {{
                                element0: (functional),
                                element1: (<Terminal/>)
                            }}
                        </Split>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state: StateType): Props {
    return {
        activeSidebarButtons: state.canvas.activeSidebarButtons,
        splitSizes: state.canvas.splitSizes
    };
}

export default connect(mapStateToProps, {})(App)
