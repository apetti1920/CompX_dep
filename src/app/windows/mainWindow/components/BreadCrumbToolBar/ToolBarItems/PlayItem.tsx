import React, {Component} from 'react';
import {IpcService} from "../../../../../IPC/IpcService";
import {Graph} from "../../../../../../shared/lib/GraphLibrary";
import {RUN_MODEL_CHANNEL} from "../../../../../../shared/Channels";
import {RunModelChannel} from "../../../../../../electron/IPC/Channels/RunModelChannel";
import {IpcRequest} from "../../../../../../shared/types";
import {StateType} from "../../../../../store/types/stateTypes";
import {connect} from "react-redux";
import {PointType} from "../../types";
import {GraphVisualType} from "../../../../../store/types/graphTypes";
import Edge from "../../../../../../shared/lib/GraphLibrary/Edge";
import {BlockStorageType} from "../../../../../../shared/lib/GraphLibrary/types/BlockStorage";

interface StateProps {
    graph: GraphVisualType
}

interface State {
    clicked: boolean
}

class PlayItem extends Component<StateProps, State> {
    constructor(props: StateProps) {
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
            <svg className="bi bi-play-fill" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor"
                 color={!this.state.clicked ? "#006a4e" : "#960018"}
                 xmlns="http://www.w3.org/2000/svg" onClick={() => {
                const tempState = {...this.state};
                tempState.clicked = !tempState.clicked;

                if (tempState.clicked) {
                    console.log("clicked")

                    const ipc = new IpcService();

                    const edges: Edge[] = this.props.graph.edges.map(edge => {
                        return {
                            id: edge.id, outputBlock: edge.outputBlockVisualID,
                            outputPort: edge.outputPortID, inputBlock: edge.inputBlockVisualID,
                            inputPort: edge.inputPortID
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

export default connect(mapStateToProps)(PlayItem);
