// @flow
import * as React from 'react';
import {BlockVisualType} from "../../../../../store/types";
import {PointType} from "../../../../../../shared/types";
import {PortToPoint} from "../../../../../utilities";

type Props = {
    block: BlockVisualType,
    translation: PointType,
    zoom: number,
    mouseDownPort: (e: React.MouseEvent, blockId: string, portId: string) => void
    mouseUpPort: (e: React.MouseEvent, blockId: string, portId: string) => void
};

type State = never;

export class VisualPortComponent extends React.Component<Props, State> {
    private drawPort(portId: string) {
        const isHovering = false;
        const portPoint = PortToPoint(this.props.block.id, portId);
        const keyId = "b_" + this.props.block.id + "_" + portId;

        const r = 3.0;
        const xdelt = Math.cos(Math.PI/3) * r;
        const ydelt = Math.sin(Math.PI/3) * r;

        let path: string;
        if (!this.props.block.mirrored) {
            path = `M ${portPoint.x - xdelt} ${portPoint.y - ydelt} L ${portPoint.x + r} ${portPoint.y} L ${portPoint.x - xdelt} ${portPoint.y + ydelt}`;
        } else {
            path = `M ${portPoint.x + xdelt} ${portPoint.y - ydelt} L ${portPoint.x - r} ${portPoint.y} L ${portPoint.x + xdelt} ${portPoint.y + ydelt}`;
        }

        return <path key={keyId} d={path} stroke="red" strokeWidth={1} fill={isHovering?"red":"black"}
                     pointerEvents="auto" cursor={isHovering?"crosshair":"auto"}
                     onMouseDown={(event) =>
                         this.props.mouseDownPort(event, this.props.block.id, portId)}
                     onMouseUp={(event) =>
                         this.props.mouseUpPort(event, this.props.block.id, portId)}/>
    }



    render(): React.ReactNode {
        const InputPortComponents = this.props.block.blockStorage.inputPorts.map((port) => {
            return this.drawPort(port.id);
        });

        const OutputPortComponents = this.props.block.blockStorage.outputPorts.map((port) => {
            return this.drawPort(port.id);
        });

        return (
            <g>
                {InputPortComponents}
                {OutputPortComponents}
            </g>
        );
    }
}
