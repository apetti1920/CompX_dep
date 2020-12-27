// @flow
import * as React from 'react';
import {BlockVisualType} from "../../../../../store/types";
import {PointType} from "../../../../../../shared/types";

type NamedIO = {
    output: boolean,
    portName: string
}

type Props = {
    translate: PointType,
    zoom: number,
    selected: boolean,
    block: BlockVisualType,
    onMouseDownBlock: (e: React.MouseEvent, blockID: string)=>void,
    onMouseUpBlock: (e: React.MouseEvent)=>void,
    onContextMenuBlock: (e: React.MouseEvent, blockID: string)=>void,
    onMouseDownHandlerPort: (e: React.MouseEvent, output: boolean, blockID: string, ioName: string)=>void,
    onMouseUpHandlerPort: (e: React.MouseEvent, output: boolean, blockID: string, ioName: string)=>void,
    onDoubleClickBlock: (e: React.MouseEvent, blockID: string)=>void
};

type State = {
    hovering?: NamedIO
};

export class VisualBlockComponent extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            hovering: undefined
        }
    }

    onMouseEnterHandler = (e: React.MouseEvent, output: boolean, portName: string) => {
        const tempState = {...this.state};
        tempState.hovering = {output: output, portName: portName};
        this.setState(tempState);
    }

    onMouseLeaveHandler = (e: React.MouseEvent) => {
        const tempState = {...this.state};
        tempState.hovering = undefined;
        this.setState(tempState);
    }

    render(): React.ReactNode {
        const deltaYi = this.props.block.size.y / (this.props.block.blockStorage.inputPorts.length + 1);
        const inputPortComponents = this.props.block.blockStorage.inputPorts.map((port, index) => {
            const keyId = "b_" + this.props.block.id + "_pi_" + index;
            return this.getCircle(keyId, false, deltaYi, index, port.name);
        });

        const deltaYo = this.props.block.size.y / (this.props.block.blockStorage.outputPorts.length + 1);
        const outputPortComponents = this.props.block.blockStorage.outputPorts.map((port, index) => {
            const keyId = "b_" + this.props.block.id + "_po_" + index;
            return this.getCircle(keyId, true, deltaYo, index, port.name);
        });

        return (
            <g style={{pointerEvents: "none"}}
               transform={`translate(${this.props.translate.x} ${this.props.translate.y})
                                scale(${this.props.zoom.toString()} ${this.props.zoom.toString()})`}>
                <rect x={this.props.block.position.x} y={this.props.block.position.y}
                      width={this.props.block.size.x} height={this.props.block.size.y}
                      style={{cursor: "pointer", stroke: this.props.selected?"pink":"", pointerEvents: "auto",
                          strokeWidth: this.props.selected?"1":"0", strokeOpacity: this.props.selected?0.9:0.0}}
                      onMouseDown={(e)=>this.props.onMouseDownBlock(e, this.props.block.id)}
                      onMouseUp={this.props.onMouseUpBlock}
                      onContextMenu={(e)=>
                          this.props.onContextMenuBlock(e, this.props.block.id)}/>
                {inputPortComponents}
                {outputPortComponents}
            </g>
        );
    }

    private getCircle(keyId: string, output: boolean, deltaYo: number, index: number, portName: string) {
        const isHovering = this.state.hovering==undefined?
            false:((this.state.hovering.portName==portName&&this.state.hovering.output==output));
        let cx = this.props.block.position.x;
        if (!this.props.block.mirrored) {
            if (output) { cx += this.props.block.size.x; }
        } else {
            if (!output) { cx += this.props.block.size.x; }
        }
        return <circle key={keyId} cx={cx} cy={this.props.block.position.y + (deltaYo * (index + 1))} r="2"
                       stroke={isHovering?"none":"red"} strokeWidth={1} fill={isHovering?"red":"none"}
                       pointerEvents="auto" cursor={isHovering?"crosshair":"auto"}
                       onMouseDown={(e) =>
                           this.props.onMouseDownHandlerPort(e, output, this.props.block.id, portName)}
                       onMouseUp={(e) =>
                           this.props.onMouseUpHandlerPort(e, output, this.props.block.id, portName)}
                       onMouseEnter={(e)=>this.onMouseEnterHandler(e, output, portName)}
                       onMouseLeave={this.onMouseLeaveHandler}/>;
    }
}
