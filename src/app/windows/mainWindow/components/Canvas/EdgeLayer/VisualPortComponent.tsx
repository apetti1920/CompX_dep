// @flow
import * as React from 'react';
import {BlockVisualType} from "../../../../../store/types";
import {PointType} from "../../../../../../shared/types";
import {PortToPoint} from "../../../../../utilities";

type Props = {
    block: BlockVisualType,
    portId: string,
    connectedPorts: string[],
    translation: PointType,
    zoom: number,
    mouseDownPort: (e: React.MouseEvent, blockId: string, portId: string) => void
    mouseUpPort: (e: React.MouseEvent, blockId: string, portId: string) => void
};

type State = {
    isHovering: boolean
};

export class VisualPortComponent extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            isHovering: false
        }
    }

    render(): React.ReactNode {
        const portPoint = PortToPoint(this.props.block.id, this.props.portId);

        const r = 3.0;
        const xdelt = Math.cos(Math.PI/3) * r;
        const ydelt = Math.sin(Math.PI/3) * r;

        let path: string;
        if (!this.props.block.mirrored) {
            path = `M ${portPoint.x - xdelt} ${portPoint.y - ydelt} L ${portPoint.x + r} ${portPoint.y} 
            L ${portPoint.x - xdelt} ${portPoint.y + ydelt}`;
        } else {
            path = `M ${portPoint.x + xdelt} ${portPoint.y - ydelt} L ${portPoint.x - r} ${portPoint.y} 
            L ${portPoint.x + xdelt} ${portPoint.y + ydelt}`;
        }

        return (
            <path d={path} stroke="red" strokeWidth={1}
                  fill={(this.state.isHovering||((this.props.connectedPorts.indexOf(this.props.portId) >= 0)))?"red":"black"}
                  pointerEvents="auto" cursor={this.state.isHovering?"crosshair":"auto"}
                  onMouseDown={(event) =>
                      this.props.mouseDownPort(event, this.props.block.id, this.props.portId)}
                  onMouseUp={(event) =>
                      this.props.mouseUpPort(event, this.props.block.id, this.props.portId)}
                  onMouseEnter={() => {this.setState({...this.state, isHovering: true})}}
                  onMouseLeave={() => {this.setState({...this.state, isHovering: false})}}/>
        );
    }
}
