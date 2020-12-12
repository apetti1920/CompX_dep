// @flow
import * as React from 'react';
import {GraphVisualType, EdgeVisualType} from "../../../../../store/types";
import {VisualEdgeComponent} from "./VisualEdgeComponent";
import {PointType} from "../../../../../../shared/types";

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
        //const selectedItem = this.props.selectedIDs !== undefined && this.props.selectedIDs === edge.id;
        const outputBlock = this.props.graph.blocks
            .find(block => block.id === edge.outputBlockVisualID);
        const inputBlock = this.props.graph.blocks
            .find(block => block.id === edge.inputBlockVisualID);

        if (outputBlock === undefined || inputBlock === undefined) {
            return <React.Fragment/>;
        }
        const outputPortIndex = outputBlock.blockStorage.outputPorts
            .findIndex(port => (port.name === edge.outputPortID));
        const inputPortIndex = inputBlock.blockStorage.inputPorts
            .findIndex(port => port.name === edge.inputPortID);

        const outputPortPos = {
            x: !outputBlock.mirrored?outputBlock.position.x + outputBlock.size.x:outputBlock.position.x,
            y: outputBlock.position.y +
                ((outputBlock.size.y / (outputBlock.blockStorage.outputPorts.length + 1)) *
                    (outputPortIndex + 1))
        };
        const inputPortPos = {
            x: !inputBlock.mirrored?inputBlock.position.x:inputBlock.position.x+inputBlock.size.x,
            y: inputBlock.position.y +
                ((inputBlock.size.y / (inputBlock.blockStorage.inputPorts.length + 1)) *
                    (inputPortIndex + 1))
        };

        const selected = this.props.selectedIDs !== undefined && this.props.selectedIDs
            .includes(edge.id);
        return (
            <VisualEdgeComponent key={edge.id} translate={this.props.translate} zoom={this.props.zoom}
                                 outputPoint={outputPortPos} inputPoint={inputPortPos}
                                 selected={selected} edge={edge}
                                 mirrored={{outputBlock: outputBlock.mirrored, inputBlock: inputBlock.mirrored}}
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
                let startPortInd = startBlock.blockStorage.outputPorts
                    .findIndex(port => port.name === this.props.draggingPortCoords.beginningPort.portID);
                let outputPort = true;
                if (startPortInd === -1) {
                    startPortInd = startBlock.blockStorage.inputPorts
                        .findIndex(port => port.name === this.props.draggingPortCoords.beginningPort.portID);
                    outputPort = false;
                }

                if (outputPort) {
                    const startCoords = {
                        x: startBlock.position.x + (startBlock.mirrored ? 0 : startBlock.size.x),
                        y: startBlock.position.y +
                            ((startBlock.size.y / (startBlock.blockStorage.outputPorts.length + 1)) * (startPortInd + 1))
                    };
                    return <VisualEdgeComponent translate={this.props.translate} zoom={this.props.zoom}
                                                        outputPoint={startCoords}
                                                        inputPoint={this.props.draggingPortCoords.mouseCoords}
                                                        mirrored={{outputBlock: outputPort?startBlock.mirrored:false,
                                                            inputBlock:!outputPort?startBlock.mirrored:false}}
                                                        selected={false}/>;
                } else {
                    const startCoords = {
                        x: startBlock.position.x + (startBlock.mirrored ? startBlock.size.x : 0),
                        y: startBlock.position.y +
                            ((startBlock.size.y / (startBlock.blockStorage.inputPorts.length + 1)) * (startPortInd + 1))
                    };
                    return <VisualEdgeComponent translate={this.props.translate} zoom={this.props.zoom}
                                                        mirrored={{outputBlock: outputPort?startBlock.mirrored:false,
                                                            inputBlock:!outputPort?startBlock.mirrored:false}}
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
