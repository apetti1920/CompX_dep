// @flow
import * as React from 'react';
import {PointType} from "../types";

type Props = {
    isDragging: boolean
    mousePosition: PointType
};

export class MouseCoordinatePosition extends React.Component<Props, never> {
    render(): React.ReactNode {
        if (this.props.isDragging && this.props.mousePosition.x !== null && this.props.mousePosition.y !== null) {
            return (
                <div style={{
                    width: "200px", height: "30px", position: "absolute", bottom: 0, right: 0,
                    backgroundColor: "white", zIndex: 2, display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                    <h3>{"x:" + Math.round(this.props.mousePosition.x).toString() +
                    " y:" + Math.round(this.props.mousePosition.y).toString()}</h3>
                </div>
            );
        } else {
            return (<React.Fragment/>)
        }
    }
}
