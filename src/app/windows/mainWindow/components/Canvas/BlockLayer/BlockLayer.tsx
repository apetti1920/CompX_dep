// @flow
import * as React from 'react';
import {CanvasType, GraphVisualType, StateType} from "../../../../../store/types";
import {ScreenToWorld} from "../../../../../utilities";
import {bindActionCreators, Dispatch} from "redux";
import { AddedBlockAction } from "../../../../../store/actions";
import {connect} from "react-redux";
import {PointType} from "../../../../../../shared/types";
import {BlockStorageType} from "../../../../../../shared/lib/GraphLibrary/types/BlockStorage";
import VisualBlockComponent from "./VisualBlockComponent";

interface StateProps {
    canvas: CanvasType,
    graph: GraphVisualType,
    blockLibrary: BlockStorageType[]
}

interface DispatchProps {
    onAddedBlock: (blockStorageId: string, position: PointType, size: PointType) => void
}

type Props = StateProps & DispatchProps

type State = never

class BlockLayer extends React.Component<Props, State> {
    // TODO: only render blocks and edges 2 screens out
    // TODO: Add curves from redux
    // TODO: Add curve while dragging
    // TODO: reject curves for not connecting same type
    // TODO: Color curves depending on type

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

    render(): React.ReactNode {
        return (
            <div style={{width: "100%", height: "100%", position: "absolute", zIndex: 2,
                pointerEvents: this.props.canvas.isDraggingFromBlockLibrary?"auto":"none"}}
                 onDragEnter={this.onDragEnterHandler} onDragOver={this.onDragOverHandler}
                 onDragLeave={this.onDragLeaveHandler} onDrop={this.onDropHandler}>
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{pointerEvents: "none"}}>
                    {this.props.graph.blocks.map((block) => {
                        return (
                            <VisualBlockComponent key={block.id} id={block.id}/>
                        )}
                    )}
                 </svg>
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
        onAddedBlock: AddedBlockAction
    }, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(BlockLayer)
