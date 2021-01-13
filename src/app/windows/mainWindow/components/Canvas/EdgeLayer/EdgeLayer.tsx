// @flow
import * as React from 'react';
import {GraphVisualType} from "../../../../../store/types";
import VisualEdgeComponent from "./VisualEdgeComponent";
import {PointType} from "../../../../../../shared/types";

type ComponentProps = {
    graph: GraphVisualType
    translate: PointType,
    zoom: number,
    selectedIDs?: string[],
    draggingPortCoords?: {beginningPort: {blockID: string, portID: string}, mouseCoords: PointType}
};

type State = {
};

export class EdgeLayer extends React.Component<ComponentProps, State> {
    // TODO: Implement Selecting Edges

    render(): React.ReactNode {
         //const draggingEdge = this.getDraggingEdge();

        return (
            <div style={{width: "100%", height: "100%", position: "absolute", zIndex: 3, pointerEvents: "none"}}>
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    {this.props.graph.edges.map((edge) => {
                        return (
                            <VisualEdgeComponent key={edge.id} edge={edge} />
                        )
                    })}
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
