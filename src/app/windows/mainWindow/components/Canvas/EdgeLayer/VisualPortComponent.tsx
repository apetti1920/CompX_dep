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
    private getCircle(portId: string) {
        const isHovering = false;

        const portPoint = PortToPoint(this.props.block.id, portId);

        const keyId = "b_" + this.props.block.id + "_" + portId;
        return <circle key={keyId} cx={portPoint.x} cy={portPoint.y} r="2"
                       stroke="red" strokeWidth={1} fill={isHovering?"red":"black"}
                       pointerEvents="auto" cursor={isHovering?"crosshair":"auto"}
                       onMouseDown={(event) =>
                           this.props.mouseDownPort(event, this.props.block.id, portId)}
                       onMouseUp={(event) =>
                           this.props.mouseUpPort(event, this.props.block.id, portId)}/>
    }

    render(): React.ReactNode {
        const InputPortComponents = this.props.block.blockStorage.inputPorts.map((port) => {
            return this.getCircle(port.id);
        });

        const OutputPortComponents = this.props.block.blockStorage.outputPorts.map((port) => {
            return this.getCircle(port.id);
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
