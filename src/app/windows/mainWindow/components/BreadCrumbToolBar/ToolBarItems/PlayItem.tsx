import React, {Component} from 'react';
import {IpcService} from "../../../../../IPC/IpcService";
import {GET_DISPLAY_CHANNEL, RUN_MODEL_CHANNEL} from "../../../../../../shared/Channels";
import {connect} from "react-redux";
import {StateType, GraphVisualType, DisplayDataType} from "../../../../../store/types";
import Edge from "../../../../../../shared/lib/GraphLibrary/Edge";
import {ipcRenderer} from "electron";
import {bindActionCreators, Dispatch} from "redux";
import {AddedDisplayDataAction} from "../../../../../store/actions";

interface StateProps {
    graph: GraphVisualType
}

interface DispatchProps {
    onAddedDisplayData: (displayData: DisplayDataType) => void
}

type Props = StateProps & DispatchProps

interface State {
    clicked: boolean
}

class PlayItem extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            clicked: false
        }
    }

    render(): React.ReactElement {
        let pathButton;
        if (!this.state.clicked) {
            pathButton = <path
                d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 010 1.393z"/>
        } else {
            pathButton = <path
                d="M5 3.5h6A1.5 1.5 0 0112.5 5v6a1.5 1.5 0 01-1.5 1.5H5A1.5 1.5 0 013.5 11V5A1.5 1.5 0 015 3.5z"/>
        }

        return (
            <svg className="bi bi-play-fill" width="50px" height="50px" viewBox="0 0 15 15" fill="currentColor"
                 color={!this.state.clicked ? "#006a4e" : "#960018"}
                 xmlns="http://www.w3.org/2000/svg" onClick={() => {
                const tempState = {...this.state};
                tempState.clicked = !tempState.clicked;

                if (tempState.clicked) {
                    const ipc = new IpcService();

                    const edges: Edge[] = this.props.graph.edges.map(edge => {
                        return {
                            id: edge.id, outputBlock: edge.outputBlockVisualID,
                            outputPort: edge.outputPortID, inputBlock: edge.inputBlockVisualID,
                            inputPort: edge.inputPortID
                        }
                    });

                    //  Needs to return some kind of stream object
                    ipcRenderer.on(GET_DISPLAY_CHANNEL, (event, message) => {
                        if (message["cmd"] === "display_data") {
                            this.props.onAddedDisplayData(message['data']);
                        } else if (message["cmd"] === "run_progress") {
                            if (message['data']['progress'] === "starting") {
                                console.log("registered");
                                // clear display data
                            } else {
                                ipcRenderer.removeAllListeners(GET_DISPLAY_CHANNEL);
                                this.setState({...this.state, clicked: false});
                                console.log("Removed");
                            }
                        } else {
                            ipcRenderer.removeAllListeners(GET_DISPLAY_CHANNEL);
                            this.setState({...this.state, clicked: false});
                            console.log("Removed");
                        }
                    });
                    ipc.send<void>(RUN_MODEL_CHANNEL, {
                        params:
                            {
                                blocks: this.props.graph.blocks.map(block => {
                                    const storageBlock = block.blockStorage;
                                    storageBlock.id = block.id;
                                    return storageBlock;
                                }),
                                edges: edges
                            }
                    });
                    this.setState(tempState);
                } else {
                    this.setState({...this.state, clicked: false})
                }
            }}>
                {pathButton}
            </svg>
        );
    }
}

function mapStateToProps(state: StateType): StateProps {
    return {
        graph: state.graph,
    };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
    return bindActionCreators({
        onAddedDisplayData: AddedDisplayDataAction
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayItem);
