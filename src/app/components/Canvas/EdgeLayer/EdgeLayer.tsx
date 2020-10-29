// @flow
import * as React from 'react';
import {VisualBlockComponent} from "../BlockLayer/VisualBlockComponent";
import {GraphVisualType} from "../../../store/types/graphTypes";
import {VisualEdgeComponent} from "./VisualEdgeComponent";
import {PointType} from "../../types";

type Props = {
    graph: GraphVisualType
    translate: PointType,
    zoom: number,
    selectedID?: string,
};
type State = {

};

export class EdgeLayer extends React.Component<Props, State> {
    render(): React.ReactNode {
        return (
            <div style={{width: "100%", height: "100%", position: "absolute", zIndex: 3, pointerEvents: "none"}}>
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    {this.props.graph.edges.map((edge) => {
                        const selected = this.props.selectedID !== undefined && this.props.selectedID === edge.id;
                        const outputBlock = this.props.graph.blocks
                            .find(block => block.blockData.id === edge.outputBlockID);
                        const outputPortIndex = outputBlock.blockData.outputPorts
                            .findIndex(port => port.name === edge.outputPortID);
                        const inputBlock = this.props.graph.blocks
                            .find(block => block.blockData.id === edge.inputBlockID);
                        const inputPortIndex = outputBlock.blockData.outputPorts
                            .findIndex(port => port.name === edge.inputPortID);

                        const outputPortPos = {x: outputBlock.position.x + outputBlock.size.x,
                            y: outputBlock.position.y + ((outputBlock.size.y / (outputBlock.blockData.outputPorts.length + 1)) * (outputPortIndex + 1))};
                        const inputPortPos = {x: inputBlock.position.x,
                            y: inputBlock.position.y - ((inputBlock.size.y / (inputBlock.blockData.inputPorts.length + 1)) * (inputPortIndex))};
                        return (
                            <VisualEdgeComponent key={edge.id} translate={this.props.translate} zoom={this.props.zoom}
                                                 points={[outputPortPos, inputPortPos]} />
                        )
                    })}
                </svg>
            </div>
        );
    }
}
