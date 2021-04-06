// @flow
import * as React from 'react';
import theme, {GetGlassStyle} from "../../../../../../theme";
import _ from "lodash";
import {Children} from "react";
import ToolTip from "../../../ComponentUtils/ToolTip";
import {PlayFill as PlayIcon} from "@styled-icons/bootstrap/PlayFill";
import {StopFill as StopIcon} from '@styled-icons/bootstrap/StopFill'
import {DisplayDataType, GraphVisualType, StateType} from "../../../../../../store/types";
import {bindActionCreators, Dispatch} from "redux";
import {AddedDisplayDataAction, ClearedDisplayDataAction} from "../../../../../../store/actions";
import {connect} from "react-redux";
import {IpcService} from "../../../../../../IPC/IpcService";
import Edge from "../../../../../../../shared/lib/GraphLibrary/Edge";
import {ipcRenderer} from "electron";
import {GET_DISPLAY_CHANNEL, RUN_MODEL_CHANNEL} from "../../../../../../../shared/Channels";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ComponentProps {
}

interface StateProps {
    graph: GraphVisualType
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface DispatchProps {
    onAddedDisplayData: (displayData: DisplayDataType) => void
    onClearedDisplayData: () => void
}

type Props = StateProps & DispatchProps & ComponentProps

interface State {
    isPlaying: boolean
}

class PlayItemButton extends React.Component<Props, State> {
    private readonly buttonRef: React.RefObject<HTMLButtonElement>;

    constructor(props: Props) {
        super(props);

        this.buttonRef = React.createRef<HTMLButtonElement>();

        this.state = {
            isPlaying: false
        }
    }

    ButtonStyle: React.CSSProperties = {
        cursor: "pointer",
        outline: "none",
        boxShadow: "none",
        display: "flex",
        flexFlow: "column nowrap",
        justifyContent: "center",
        backgroundColor: "transparent",
        border: "none",
        borderRadius: "5px",
        paddingBottom: "2px"
    }

    TooltipStyle: React.CSSProperties = {
        height: "20px",
        pointerEvents: "none",
        color: theme.palette.text,
        fontSize: "small",
        borderRadius: "4px",
        paddingLeft: "5px",
        paddingRight: "5px",
        ...GetGlassStyle(theme.palette.accent, 0.4)
    }

    handlePLayClick = (): void => {
        this.props.onClearedDisplayData();

        const edges: Edge[] = this.props.graph.edges.map(edge => {
            return {
                id: edge.id, outputBlock: edge.outputBlockVisualID,
                outputPort: edge.outputPortID, inputBlock: edge.inputBlockVisualID,
                inputPort: edge.inputPortID
            }
        });

        const ipc = new IpcService();
        ipcRenderer.on(GET_DISPLAY_CHANNEL, (event, message) => {
            if (message["cmd"] === "display_data") {
                this.props.onAddedDisplayData(message['data']);
            } else if (message["cmd"] === "run_progress") {
                if (message['data']['progress'] === "starting") {
                    console.log("registered");
                    // clear display data
                } else {
                    ipcRenderer.removeAllListeners(GET_DISPLAY_CHANNEL);
                    this.setState({...this.state, isPlaying: false});
                    console.log("Removed");
                }
            } else {
                ipcRenderer.removeAllListeners(GET_DISPLAY_CHANNEL);
                this.setState({...this.state, isPlaying: false});
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
    }

    handleStopClick = (): void => {
        console.log("Stop Clicked")
    }

    handleClick = (e: React.MouseEvent): void => {
        const tempState: State = _.cloneDeep(this.state);
        !tempState.isPlaying ? this.handlePLayClick() : this.handleStopClick()
        tempState.isPlaying = !tempState.isPlaying;
        this.setState(tempState);
    }

    render(): React.ReactElement {
        return (
            Children.only(
                <ToolTip placement="bottom">
                    {{
                        MasterObject: (
                            <button ref={this.buttonRef}
                                    style={this.ButtonStyle}
                                    onClick={this.handleClick}>
                                {!this.state.isPlaying?<PlayIcon color={theme.palette.success} size="30px"/>:
                                    <StopIcon color={theme.palette.error} size="30px"/>}
                            </button>
                        ),
                        TooltipElement: <label style={this.TooltipStyle}>Play</label>
                    }}
                </ToolTip>
            )
        )
    }
}

function mapStateToProps(state: StateType): StateProps {
    return {
        graph: state.graph,
    };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
    return bindActionCreators({
        onAddedDisplayData: AddedDisplayDataAction,
        onClearedDisplayData: ClearedDisplayDataAction
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayItemButton);
