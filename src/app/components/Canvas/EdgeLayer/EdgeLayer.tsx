// @flow
import * as React from 'react';
import {GraphVisualType} from "../../../store/types/graphTypes";
import {VisualEdgeComponent} from "./VisualEdgeComponent";
import {PointType} from "../../types";

type Props = {
    graph: GraphVisualType
    translate: PointType,
    zoom: number,
    selectedID?: string,
    draggingPortCoords?: {start: PointType, end: PointType}
};

type State = {

};

export class EdgeLayer extends React.Component<Props, State> {
    // TODO: Implement Selecting Edges

    render(): React.ReactNode {
        let draggingEdge: React.ReactNode;
        if (this.props.draggingPortCoords !== undefined) {
            draggingEdge = <VisualEdgeComponent translate={this.props.translate} zoom={this.props.zoom}
                                                outputPoint={this.props.draggingPortCoords.start}
                                                inputPoint={this.props.draggingPortCoords.end} />;
        } else {
            draggingEdge = React.Fragment;
        }

        return (
            <div style={{width: "100%", height: "100%", position: "absolute", zIndex: 3, pointerEvents: "none"}}>
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    {this.props.graph.edges.map((edge) => {
                        //const selected = this.props.selectedID !== undefined && this.props.selectedID === edge.id;
                        const outputBlock = this.props.graph.blocks
                            .find(block => block.id === edge.outputBlockID);
                        const inputBlock = this.props.graph.blocks
                            .find(block => block.id === edge.inputBlockID);

                        if (outputBlock === undefined || inputBlock === undefined) { return; }
                        const outputPortIndex = outputBlock.blockData.outputPorts
                            .findIndex(port => (port.name === edge.outputPortID));
                        const inputPortIndex = inputBlock.blockData.inputPorts
                            .findIndex(port => port.name === edge.inputPortID);

                        const outputPortPos = {x: outputBlock.position.x + outputBlock.size.x,
                            y: outputBlock.position.y + ((outputBlock.size.y / (outputBlock.blockData.outputPorts.length + 1)) * (outputPortIndex + 1))};
                        const inputPortPos = {x: inputBlock.position.x,
                            y: inputBlock.position.y + ((inputBlock.size.y / (inputBlock.blockData.inputPorts.length + 1)) * (inputPortIndex + 1))};
                        return (
                            <VisualEdgeComponent key={edge.id} translate={this.props.translate} zoom={this.props.zoom}
                                                 outputPoint={outputPortPos} inputPoint={inputPortPos} />
                        )
                    })}
                    {draggingEdge}
                </svg>
            </div>
        );
    }
}
