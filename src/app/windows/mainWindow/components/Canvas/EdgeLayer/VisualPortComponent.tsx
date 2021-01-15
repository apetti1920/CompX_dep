// @flow
import * as React from 'react';
import {BlockVisualType} from "../../../../../store/types";
import {PointType} from "../../../../../../shared/types";

type Props = {
    block: BlockVisualType,
    translation: PointType
    zoom: number
};

type State = never;

export class VisualPortComponent extends React.Component<Props, State> {
    private getCircle(keyId: string, output: boolean, deltaYo: number, index: number, portName: string) {
        // const isHovering = this.state.hovering==undefined?
        //     false:((this.state.hovering.portName==portName&&this.state.hovering.output==output));
        const isHovering = false;
        let cx = this.props.block.position.x;
        if (!this.props.block.mirrored) {
            if (output) { cx += this.props.block.size.x; }
        } else {
            if (!output) { cx += this.props.block.size.x; }
        }
        return <circle key={keyId} cx={cx} cy={this.props.block.position.y + (deltaYo * (index + 1))} r="2"
                       stroke="red" strokeWidth={1} fill={isHovering?"red":"black"}
                       pointerEvents="auto" cursor={isHovering?"crosshair":"auto"} onClick={()=>{console.log("clicked")}}/>
    }

    render(): React.ReactNode {
        const deltaYi = this.props.block.size.y / (this.props.block.blockStorage.inputPorts.length + 1);
        const InputPortComponents = this.props.block.blockStorage.inputPorts.map((port, index) => {
            const keyId = "b_" + this.props.block.id + "_pi_" + index;
            return this.getCircle(keyId, false, deltaYi, index, port.name);
        });

        const deltaYo = this.props.block.size.y / (this.props.block.blockStorage.outputPorts.length + 1);
        const OutputPortComponents = this.props.block.blockStorage.outputPorts.map((port, index) => {
            const keyId = "b_" + this.props.block.id + "_po_" + index;
            return this.getCircle(keyId, true, deltaYo, index, port.name);
        });

        return (
            <g style={{pointerEvents: "none"}}
               transform={`translate(${this.props.translation.x} ${this.props.translation.y})
                                scale(${this.props.zoom.toString()} ${this.props.zoom.toString()})`}>
                {InputPortComponents}
                {OutputPortComponents}
            </g>
        );
    }
}
