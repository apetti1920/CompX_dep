// @flow
import * as React from 'react';
import {BlockVisualType} from "../../../../types";
import {PointType} from "../../types";

type Props = {
    translate: PointType,
    zoom: number,
    selected: boolean,
    block: BlockVisualType,
    onClickBlock: (e: React.MouseEvent, blockID: string)=>void,
    onMouseDownBlock: (e: React.MouseEvent, blockID: string)=>void
    onMouseUpBlock: (e: React.MouseEvent)=>void
};

type State = never;

export class VisualBlockComponent extends React.Component<Props, State> {
    render(): React.ReactNode {
        const deltaYi = this.props.block.size.y / (this.props.block.blockData.inputPorts.length + 1);
        const inputPortComponents = this.props.block.blockData.inputPorts.map((port, index) => {
            const keyId = "b_" + this.props.block.id + "_pi_" + index;
            return <circle key={keyId} cx={this.props.block.position.x} cy={this.props.block.position.y +
            (deltaYi * (index + 1))} r="4" fill="red"/>
        });

        const deltaYo = this.props.block.size.y / (this.props.block.blockData.outputPorts.length + 1);
        const outputPortComponents = this.props.block.blockData.outputPorts.map((port, index) => {
            const keyId = "b_" + this.props.block.id + "_po_" + index;
            return <circle key={keyId} cx={this.props.block.position.x + this.props.block.size.x}
                           cy={this.props.block.position.y + (deltaYo * (index + 1))} r="4" fill="red"/>
        });

        return (
            <g style={{pointerEvents: "none"}}
               transform={`translate(${this.props.translate.x} ${this.props.translate.y})
                                scale(${this.props.zoom.toString()} ${this.props.zoom.toString()})`}>
                <rect x={this.props.block.position.x} y={this.props.block.position.y}
                      width={this.props.block.size.x} height={this.props.block.size.y}
                      style={{cursor: "pointer", stroke: this.props.selected?"pink":"", pointerEvents: "auto",
                          strokeWidth: this.props.selected?"1":"0", strokeOpacity: this.props.selected?0.9:0.0}}
                      onClick={(e) => this.props.onClickBlock(e, this.props.block.id)}
                      onMouseDown={(e)=>this.props.onMouseDownBlock(e, this.props.block.id)}
                      onMouseUp={this.props.onMouseUpBlock}/>
                {inputPortComponents}
                {outputPortComponents}
            </g>
        );
    }
}
