// @flow
import * as React from 'react';
import {GraphVisualType} from "../../../store/types/graphTypes";
import {VisualEdgeComponent} from "./VisualEdgeComponent";
import {PointType} from "../../types";
import {EdgeVisualType} from "../../../../types";

type Props = {
    graph: GraphVisualType
    translate: PointType,
    zoom: number,
    selectedIDs?: string[],
    onMouseDownHandlerEdge: (e: React.MouseEvent, blockID: string)=>void,
    onMouseUpHandlerEdge: (e: React.MouseEvent)=>void,
    draggingPortCoords?: {beginningPort: {blockID: string, portID: string}, mouseCoords: PointType}
};

type State = {

};

export class EdgeLayer extends React.Component<Props, State> {
    // TODO: Implement Selecting Edges

    render(): React.ReactNode {
         const draggingEdge = this.getDraggingEdge();

        return (
            <div style={{width: "100%", height: "100%", position: "absolute", zIndex: 3, pointerEvents: "none"}}>
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    {this.props.graph.edges.map((edge) => {
                        return this.convertEdgeToVisual(edge);
                    })}
                    {draggingEdge}
                </svg>
            </div>
        );
    }

    private convertEdgeToVisual(edge: EdgeVisualType) {
        //const selected = this.props.selectedIDs !== undefined && this.props.selectedIDs === edge.id;
        const outputBlock = this.props.graph.blocks
            .find(block => block.id === edge.outputBlockID);
        const inputBlock = this.props.graph.blocks
            .find(block => block.id === edge.inputBlockID);

        if (outputBlock === undefined || inputBlock === undefined) {
            return;
        }
        const outputPortIndex = outputBlock.blockData.outputPorts
            .findIndex(port => (port.name === edge.outputPortID));
        const inputPortIndex = inputBlock.blockData.inputPorts
            .findIndex(port => port.name === edge.inputPortID);

        const outputPortPos = {
            x: outputBlock.position.x + outputBlock.size.x,
            y: outputBlock.position.y +
                ((outputBlock.size.y / (outputBlock.blockData.outputPorts.length + 1)) *
                    (outputPortIndex + 1))
        };
        const inputPortPos = {
            x: inputBlock.position.x,
            y: inputBlock.position.y +
                ((inputBlock.size.y / (inputBlock.blockData.inputPorts.length + 1)) *
                    (inputPortIndex + 1))
        };

        const selected = this.props.selectedIDs !== undefined && this.props.selectedIDs
            .includes(edge.id);
        return (
            <VisualEdgeComponent key={edge.id} translate={this.props.translate} zoom={this.props.zoom}
                                 outputPoint={outputPortPos} inputPoint={inputPortPos}
                                 selected={selected} edge={edge}
                                 onMouseDown={this.props.onMouseDownHandlerEdge}
                                 onMouseUp={this.props.onMouseUpHandlerEdge}/>
        )
    }

    private getDraggingEdge() {
        if (this.props.draggingPortCoords !== undefined) {
            // find the coordinates of start node
            const startBlock = this.props.graph.blocks
                .find(block => block.id === this.props.draggingPortCoords.beginningPort.blockID);
            if (startBlock !== undefined) {
                let startPortInd = startBlock.blockData.outputPorts
                    .findIndex(port => port.name === this.props.draggingPortCoords.beginningPort.portID);
                let outputPort = true;
                if (startPortInd === -1) {
                    startPortInd = startBlock.blockData.inputPorts
                        .findIndex(port => port.name === this.props.draggingPortCoords.beginningPort.portID);
                    outputPort = false;
                }

                if (outputPort) {
                    const startCoords = {
                        x: startBlock.position.x + (startBlock.mirrored ? 0 : startBlock.size.x),
                        y: startBlock.position.y +
                            ((startBlock.size.y / (startBlock.blockData.outputPorts.length + 1)) * (startPortInd + 1))
                    };
                    return <VisualEdgeComponent translate={this.props.translate} zoom={this.props.zoom}
                                                        outputPoint={startCoords}
                                                        inputPoint={this.props.draggingPortCoords.mouseCoords}
                                                        selected={false}/>;
                } else {
                    const startCoords = {
                        x: startBlock.position.x + (startBlock.mirrored ? startBlock.size.x : 0),
                        y: startBlock.position.y +
                            ((startBlock.size.y / (startBlock.blockData.inputPorts.length + 1)) * (startPortInd + 1))
                    };
                    return <VisualEdgeComponent translate={this.props.translate} zoom={this.props.zoom}
                                                        outputPoint={this.props.draggingPortCoords.mouseCoords}
                                                        inputPoint={startCoords}
                                                        selected={false}/>;
                }
            } else {
                return React.Fragment;
            }
        } else {
            return React.Fragment;
        }
    }
}
