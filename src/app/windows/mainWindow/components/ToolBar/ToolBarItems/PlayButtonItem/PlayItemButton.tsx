// @flow
import * as React from 'react';
import theme from "../../../../../../theme";
import _ from "lodash";
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
import {SetOpacity} from "../../../../../../utilities";
import styled from "styled-components";


const InputButtonStyle: React.CSSProperties = {
    verticalAlign: "middle",
    padding: 0,
    background: "none",
    border: "none",
    outline: "none"
}

interface StateProps {
    graph: GraphVisualType
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface DispatchProps {
    onAddedDisplayData: (displayData: DisplayDataType) => void
    onClearedDisplayData: () => void
}

type Props = StateProps & DispatchProps

interface State {
    isPlaying: boolean,
    inputText: string
}

class PlayItemButton extends React.Component<Props, State> {
    private InputField: any

    constructor(props: Props) {
        super(props);

        this.SetInputField(false);
        this.state = {
            isPlaying: false,
            inputText: ""
        }
    }

    SetInputField = (isPlaying: boolean) => {
        this.InputField = styled.input`
            flex-grow: 1;
            max-width: 60px;
            vertical-align: middle;
            border-style: none;
            background: transparent;
            outline: none;
            text-align: right;
            color: ${!isPlaying?theme.palette.text:SetOpacity(theme.palette.text, 0.5)};
            &::placeholder {
                color: ${SetOpacity(theme.palette.text, 0.5)};;
            }
            &::-webkit-search-cancel-button {
              appearance: none;
            }
        `
    }

    handlePlayClick = (): void => {
        let runTime: number | "inf";
        if (!isNaN(parseFloat(this.state.inputText))) {
            runTime = parseFloat(this.state.inputText);
        } else if (this.state.inputText === "" || this.state.inputText.toLowerCase() == "inf") {
            runTime = -1;
        } else {
            alert("Bad Number");
            return;
        }
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
                    runTime: runTime,
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
        !tempState.isPlaying ? this.handlePlayClick() : this.handleStopClick()
        this.SetInputField(!tempState.isPlaying);
        tempState.isPlaying = !tempState.isPlaying;
        this.setState(tempState);
    }

    render(): React.ReactElement {
        return (
            <div style={{borderRadius: "2px", paddingBottom: "5px"}}>
                <div style={{backgroundColor: !this.state.isPlaying?SetOpacity(theme.palette.accent, 0.8):
                        SetOpacity(theme.palette.shadow, 0.8)}}>
                    <this.InputField disabled={this.state.isPlaying} placeholder="inf" type="text" value={this.state.inputText}
                                     onChange={(e: React.ChangeEvent<HTMLInputElement>)=>{
                                         this.setState({inputText: e.currentTarget.value})
                                     }}/>
                    <button style={InputButtonStyle} onClick={this.handleClick}>
                        {
                            !this.state.isPlaying ? (
                                <PlayIcon color={theme.palette.success} size="30px"/>
                            ) : (
                                <StopIcon color={theme.palette.error} size="30px"/>
                            )
                        }
                    </button>
                </div>
            </div>
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
