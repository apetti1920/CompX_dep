// @flow
import * as React from 'react';
import {CanvasType, GraphVisualType, StateType} from "../../../../../store/types";
import {ScreenToWorld} from "../../../../../utilities";
import {bindActionCreators, Dispatch} from "redux";
import {
    AddedBlockAction,
    ClickedSidebarButtonAction,
    MirrorBlockAction,
    ToggleSelectedBlockAction
} from "../../../../../store/actions";
import {connect} from "react-redux";
import {PointType} from "../../../../../../shared/types";
import {BlockStorageType} from "../../../../../../shared/lib/GraphLibrary/types/BlockStorage";
import VisualBlockComponent from "./VisualBlockComponent";
import {ContextMenu} from "../../ComponentUtils/ContextMenu"
import {Delete, Repeat, Settings} from 'react-feather';

interface StateProps {
    canvas: CanvasType,
    graph: GraphVisualType,
    blockLibrary: BlockStorageType[]
}

interface DispatchProps {
    onAddedBlock: (blockStorageId: string, position: PointType, size: PointType) => void,
    clickedButton: (buttonGroup: number, buttonId: number) => void,
    onToggleBlockSelection: (visualBlockId: string, selected: boolean) => void,
    onMirrorBlock: (visualBlockId: string) => void
}

type Props = StateProps & DispatchProps

type State = {
    contextMenu?: React.ReactNode
}

class BlockLayer extends React.Component<Props, State> {
    // TODO: only render blocks and edges 2 screens out
    // TODO: Add curves from redux
    // TODO: Add curve while draggingFromPoint
    // TODO: reject curves for not connecting same type
    // TODO: Color curves depending on type

    constructor(props: Props) {
        super(props);

        this.state = {
            contextMenu: undefined
        }
    }

    onDragEnterHandler = (e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        e.stopPropagation();
    }

    onDragOverHandler = (e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        e.stopPropagation();
    }

    onDragLeaveHandler = (e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        e.stopPropagation();
    }

    onDropHandler = (e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        const cardID = e.dataTransfer.getData("cardID");
        const defaultBlockSize: PointType = {x: 40, y: 40};
        const worldPos = ScreenToWorld({x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY}, this.props.canvas.translation, this.props.canvas.zoom);
        const position: PointType = {
            x: worldPos.x - defaultBlockSize.x / 2.0,
            y: worldPos.y - defaultBlockSize.y / 2.0,
        }
        this.props.onAddedBlock(cardID, position, defaultBlockSize);
        e.stopPropagation();
    }

    onContextMenuBlockHandler = (e: React.MouseEvent, blockID: string): void => {
        e.preventDefault();
        const tmpState = {...this.state};
        const mir = this.props.graph.blocks.find(block => block.id === blockID).mirrored;

        this.props.onToggleBlockSelection(blockID, true);

        tmpState.contextMenu = <ContextMenu position={{ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY }} items={[
            {
                icon: <Settings height="100%" style={{flexGrow: 1}}/>, name: "Edit",
                action: () => {
                    const tmpState = {...this.state};
                    if (!this.props.canvas.sidebarButtons.find(b => b.groupId === 0 && b.buttonId === 1).selected) {
                        this.props.clickedButton(0, 1);
                    }
                    tmpState.contextMenu = undefined;
                    this.setState(tmpState);
                }
            },
            {
                icon: <Repeat height="100%" style={{flexGrow: 1}}/>,
                name: !mir ? "Mirror" : "Un-Mirror",
                action: () => {
                    const tmpState = {...this.state};
                    this.props.onMirrorBlock(blockID);
                    tmpState.contextMenu = undefined;
                    this.setState(tmpState);
                }
            },
            "Spacer",
            {
                icon: <Delete height="100%" style={{flexGrow: 1}}/>, name: "Delete",
                action: () => {
                    console.log("Clicked");
                    const tmpState = {...this.state};
                    // const tmpProps = {...this.props};
                    // const graph = tmpProps.graph;
                    //
                    // const delBlockInd = graph.blocks.findIndex(block => block.id === blockID);
                    // const delBlock = graph.blocks[delBlockInd];
                    // delBlock.blockStorage.outputPorts.forEach(port => {
                    //     graph.edges = graph.edges.filter(edge => !(edge.outputBlockVisualID === delBlock.id &&
                    //         edge.outputPortID === port.name));
                    // })
                    // delBlock.blockStorage.inputPorts.forEach(port => {
                    //     graph.edges = graph.edges.filter(edge => !(edge.inputBlockVisualID === delBlock.id &&
                    //         edge.inputPortID === port.name));
                    // })
                    // graph.blocks = graph.blocks.filter(block => block.id !== blockID);
                    // tmpProps.onUpdatedGraph(graph);
                    tmpState.contextMenu = undefined;
                    this.setState(tmpState);
                }
            }
        ]}/>;
        this.setState(tmpState);
        e.stopPropagation();
    }

    render(): React.ReactNode {
        return (
            <div style={{width: "100%", height: "100%", position: "absolute", zIndex: 2,
                pointerEvents: this.props.canvas.isDraggingFromBlockLibrary?"auto":"none"}}
                 onDragEnter={this.onDragEnterHandler} onDragOver={this.onDragOverHandler}
                 onDragLeave={this.onDragLeaveHandler} onDrop={this.onDropHandler}>
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{pointerEvents: "none"}}>
                    {this.props.graph.blocks.map((block) => {
                        return (
                            <VisualBlockComponent key={block.id} id={block.id} onContextMenu={this.onContextMenuBlockHandler}/>
                        )}
                    )}
                 </svg>
                {this.state.contextMenu??<React.Fragment/>}
            </div>
        );
    }
}

function mapStateToProps(state: StateType): StateProps {
    return {
        canvas: state.canvas,
        graph: state.graph,
        blockLibrary: state.blockLibrary
    };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
    return bindActionCreators({
        onAddedBlock: AddedBlockAction,
        clickedButton: ClickedSidebarButtonAction,
        onToggleBlockSelection: ToggleSelectedBlockAction,
        onMirrorBlock: MirrorBlockAction
    }, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(BlockLayer)
