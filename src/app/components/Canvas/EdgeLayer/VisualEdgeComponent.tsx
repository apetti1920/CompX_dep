// @flow
import * as React from 'react';
import {PointType} from "../../types";

type Props = {
    translate: PointType,
    zoom: number,
    outputPoint: PointType,
    inputPoint: PointType
};

type State = {

};

export class VisualEdgeComponent extends React.Component<Props, State> {
    render(): React.ReactNode {
        let halfXOut: number; let halfXIn: number;
        if (this.props.inputPoint.x > this.props.outputPoint.x) {
            halfXOut = this.props.outputPoint.x + (Math.abs(this.props.inputPoint.x - this.props.outputPoint.x) / 2.0);
            halfXIn = halfXOut;
        } else {
            halfXOut = this.props.outputPoint.x + (Math.abs(this.props.inputPoint.x - this.props.outputPoint.x) / 2.0);
            halfXIn = this.props.inputPoint.x - (Math.abs(this.props.inputPoint.x - this.props.outputPoint.x) / 2.0);
        }

        const lineCommand = `M ${this.props.outputPoint.x}, ${this.props.outputPoint.y} 
                             C ${halfXOut}, ${this.props.outputPoint.y} 
                             ${halfXIn}, ${this.props.inputPoint.y} 
                             ${this.props.inputPoint.x}, ${this.props.inputPoint.y}`;
        return (
            <g style={{pointerEvents: "none"}} transform={`translate(${this.props.translate.x} ${this.props.translate.y})
                                scale(${this.props.zoom.toString()} ${this.props.zoom.toString()})`}>
                <path d={lineCommand} stroke="red" fill="none" strokeWidth="1"/>
            </g>
        );
    }
}
