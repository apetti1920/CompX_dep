// @flow
import * as React from 'react';
import {PointType} from "../../../../../shared/types";

type Props = {
    isDragging: boolean
    mousePosition: PointType
    zoomLevel: number
};

export class MouseCoordinatePosition extends React.Component<Props, never> {
    render(): React.ReactNode {
        if (this.props.isDragging && this.props.mousePosition.x !== null && this.props.mousePosition.y !== null) {
            return (
                <div style={{
                    width: "100px", height: "50px", position: "absolute", bottom: 0, right: 0,
                    backgroundColor: "var(--custom-background-color)", zIndex: 3, display: "flex",
                    alignItems: "center", flexDirection: "column", justifyContent: "center",
                    opacity: "75%", margin: "15px", borderRadius: "10px", color: "var(--custom-font-color)"
                }}>
                    <pre style={{margin: 0, marginBottom:"5px", color: "var(--custom-text-color)", fontSize: "12px",
                        fontFamily: "var(--custom-font-family)"}}>
                        { "x: " + Math.round(this.props.mousePosition.x).toString() +
                        "  y: " + Math.round(-this.props.mousePosition.y).toString()}</pre>
                    <pre style={{margin: 0, marginTop: "5px", color: "var(--custom-text-color)", fontSize: "12px",
                        fontFamily: "var(--custom-font-family)"}}>
                        {"zoom: " + this.props.zoomLevel.toFixed(1)}</pre>
                </div>
            );
        } else {
            return (<React.Fragment/>)
        }
    }
}
