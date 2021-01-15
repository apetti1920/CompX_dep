// @flow
import * as React from 'react';
import VisualEdgeComponent from "./VisualEdgeComponent";
import {CanvasType, GraphVisualType, StateType} from "../../../../../store/types";
import {bindActionCreators, Dispatch} from "redux";
import {connect} from "react-redux";
import {PointType} from "../../../../../../shared/types";
import VisualBlockComponent from "../BlockLayer/VisualBlockComponent";
import {VisualPortComponent} from "./VisualPortComponent";


interface StateProps {
    canvas: CanvasType,
    graph: GraphVisualType
}

// interface DispatchProps {
//     onAddedEdge: (inputBlockVisualId: string, position: PointType, size: PointType) => void
// }

type Props = StateProps //& DispatchProps

type State = never;

class EdgeLayer extends React.Component<Props, State> {
    // TODO: Implement Selecting Edges

    render(): React.ReactNode {
        return (
            <div style={{width: "100%", height: "100%", position: "absolute", zIndex: 3,
                pointerEvents: "none"}}>
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{pointerEvents: "none"}}>
                    {
                        this.props.graph.blocks.map(b => {
                            return (
                                <VisualPortComponent key={b.id} block={b} zoom={this.props.canvas.zoom}
                                                     translation={this.props.canvas.translation}/>
                            )
                        })
                    }
                </svg>
            </div>
        );
    }

    // private getDraggingEdge() {
    //     if (this.props.draggingPortCoords !== undefined) {
    //         // find the coordinates of start node
    //         const startBlock = this.props.graph.blocks
    //             .find(block => block.id === this.props.draggingPortCoords.beginningPort.blockID);
    //         if (startBlock !== undefined) {
    //             let startPortInd = startBlock.blockStorage.outputPorts
    //                 .findIndex(port => port.name === this.props.draggingPortCoords.beginningPort.portID);
    //             let outputPort = true;
    //             if (startPortInd === -1) {
    //                 startPortInd = startBlock.blockStorage.inputPorts
    //                     .findIndex(port => port.name === this.props.draggingPortCoords.beginningPort.portID);
    //                 outputPort = false;
    //             }
    //
    //             if (outputPort) {
    //                 const startCoords = {
    //                     x: startBlock.position.x + (startBlock.mirrored ? 0 : startBlock.size.x),
    //                     y: startBlock.position.y +
    //                         ((startBlock.size.y / (startBlock.blockStorage.outputPorts.length + 1)) * (startPortInd + 1))
    //                 };
    //                 return <VisualEdgeComponent translate={this.props.translate} zoom={this.props.zoom}
    //                                                     outputPoint={startCoords}
    //                                                     inputPoint={this.props.draggingPortCoords.mouseCoords}
    //                                                     mirrored={{outputBlock: outputPort?startBlock.mirrored:false,
    //                                                         inputBlock:!outputPort?startBlock.mirrored:false}}
    //                                                     selected={false}/>;
    //             } else {
    //                 const startCoords = {
    //                     x: startBlock.position.x + (startBlock.mirrored ? startBlock.size.x : 0),
    //                     y: startBlock.position.y +
    //                         ((startBlock.size.y / (startBlock.blockStorage.inputPorts.length + 1)) * (startPortInd + 1))
    //                 };
    //                 return <VisualEdgeComponent translate={this.props.translate} zoom={this.props.zoom}
    //                                                     mirrored={{outputBlock: outputPort?startBlock.mirrored:false,
    //                                                         inputBlock:!outputPort?startBlock.mirrored:false}}
    //                                                     outputPoint={this.props.draggingPortCoords.mouseCoords}
    //                                                     inputPoint={startCoords}
    //                                                     selected={false}/>;
    //             }
    //         } else {
    //             return React.Fragment;
    //         }
    //     } else {
    //         return React.Fragment;
    //     }
    // }
}

function mapStateToProps(state: StateType): StateProps {
    return {
        canvas: state.canvas,
        graph: state.graph
    };
}

// function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
//     return bindActionCreators({
//     }, dispatch)
// }


export default connect(mapStateToProps, null)(EdgeLayer)
