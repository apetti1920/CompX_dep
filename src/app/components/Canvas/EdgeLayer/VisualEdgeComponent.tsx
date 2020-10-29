// @flow
import * as React from 'react';
import {PointType} from "../../types";

type Props = {
    translate: PointType,
    zoom: number,
    points: PointType[]
};

type State = {

};

export class VisualEdgeComponent extends React.Component<Props, State> {
    render(): React.ReactNode {
        const lineCommand = `M ${this.props.points[0].x} ${this.props.points[0].y} ${this.props.points
            .slice(1, this.props.points.length).map(pt => `L ${pt.x} ${pt.y}`)}`;
        return (
            <g style={{pointerEvents: "none"}} transform={`translate(${this.props.translate.x} ${this.props.translate.y})
                                scale(${this.props.zoom.toString()} ${this.props.zoom.toString()})`}>
                <path d={lineCommand} stroke="red"/>
            </g>
        );
    }
}
