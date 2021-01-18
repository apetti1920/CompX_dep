// @flow
import * as React from 'react';
import {PointType} from "../../../../../../shared/types";
import {BlockVisualType, EdgeVisualType, StateType} from "../../../../../store/types";
import {connect} from "react-redux";

interface StateProps {
    zoom: number,
    translate: PointType,
    blocks: BlockVisualType[]
}

type ComponentProps = {
    edge: EdgeVisualType
};

type Props = StateProps & ComponentProps

type State = {
    inputBlock?: BlockVisualType,
    outputBlock?: BlockVisualType
};

class VisualEdgeComponent extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            inputBlock: this.props.blocks.find(b => this.props.edge.inputBlockVisualID === b.id),
            outputBlock: this.props.blocks.find(b => this.props.edge.outputBlockVisualID === b.id)
        }
    }

    private getLineCommand() {
        if (this.state.outputBlock === undefined || this.state.inputBlock === undefined) {
            return "";
        }

        const outputPortIndex = this.state.outputBlock.blockStorage.outputPorts
            .findIndex(port => (port.name === this.props.edge.outputPortID));
        const inputPortIndex = this.state.inputBlock.blockStorage.inputPorts
            .findIndex(port => port.name === this.props.edge.inputPortID);

        const outputPoint = {
            x: !this.state.outputBlock.mirrored?this.state.outputBlock.position.x + this.state.outputBlock.size.x:this.state.outputBlock.position.x,
            y: this.state.outputBlock.position.y +
                ((this.state.outputBlock.size.y / (this.state.outputBlock.blockStorage.outputPorts.length + 1)) *
                    (outputPortIndex + 1))
        };
        const inputPoint = {
            x: !this.state.inputBlock.mirrored?this.state.inputBlock.position.x:this.state.inputBlock.position.x+this.state.inputBlock.size.x,
            y: this.state.inputBlock.position.y +
                ((this.state.inputBlock.size.y / (this.state.inputBlock.blockStorage.inputPorts.length + 1)) *
                    (inputPortIndex + 1))
        };

        console.log("here1")
        if (this.state.outputBlock.mirrored === this.state.inputBlock.mirrored) {
            let halfXOut: number; let halfXIn: number;
            if (inputPoint.x > outputPoint.x) {
                halfXOut = outputPoint.x + (Math.abs(inputPoint.x - outputPoint.x) / 2.0);
                halfXIn = halfXOut;
            } else {
                halfXOut = outputPoint.x + (Math.abs(inputPoint.x - outputPoint.x) / 2.0);
                halfXIn = inputPoint.x - (Math.abs(inputPoint.x - outputPoint.x) / 2.0);
            }

            return `M ${outputPoint.x}, ${outputPoint.y} 
                             C ${halfXOut}, ${outputPoint.y} 
                             ${halfXIn}, ${inputPoint.y} 
                             ${inputPoint.x}, ${inputPoint.y}`;
        } else if (this.state.inputBlock.mirrored) {
            console.log("here");
            const dist = Math.sqrt(((outputPoint.x - inputPoint.x) ** 2) + ((outputPoint.y - inputPoint.y) ** 2));
            return `M ${outputPoint.x}, ${outputPoint.y} 
                             Q ${outputPoint.x + dist} ${0.5 * (outputPoint.y + inputPoint.y)},
                             ${inputPoint.x}, ${inputPoint.y}`;
        } else {
            const dist = -Math.sqrt(((outputPoint.x - inputPoint.x) ** 2) + ((outputPoint.y - inputPoint.y) ** 2));
            return `M ${outputPoint.x}, ${outputPoint.y} 
                             C ${outputPoint.x + dist}, ${outputPoint.y} 
                             ${inputPoint.x + dist}, ${inputPoint.y} 
                             ${inputPoint.x}, ${inputPoint.y}`;
        }
    }

    render(): React.ReactNode {
        return (
            <g style={{pointerEvents: "auto"}}
               transform={`translate(${this.props.translate.x} ${this.props.translate.y})
                                scale(${this.props.zoom.toString()} ${this.props.zoom.toString()})`}>
                <path d={this.getLineCommand()} stroke="red" fill="none" strokeWidth="1"/>
            </g>
        );
    }
}

function mapStateToProps(state: StateType): StateProps {
    return {
        zoom: state.canvas.zoom,
        translate: state.canvas.translation,
        blocks: state.graph.blocks
    };
}


export default connect(mapStateToProps, {})(VisualEdgeComponent)
