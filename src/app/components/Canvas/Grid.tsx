// @flow
import * as React from 'react';
import {linearInterp} from "../../../helpers/utils";
import {PointType} from "../types";

type Props = {
    majorTickSpacing: number
    minorTickSpacing: number
    translate: PointType
    zoom: number
};

export class Grid extends React.Component<Props, never> {
    render(): React.ReactElement {
        const opacity = linearInterp(this.props.zoom, 0, 100, 0.3, 0.75);

        const smallGrid = `M ${this.props.minorTickSpacing} 0 L 0 0 0 ${this.props.minorTickSpacing}`
        const grid = `M ${this.props.majorTickSpacing} 0 L 0 0 0 ${this.props.majorTickSpacing}`

        return (
            <div style={{width: "100%", height: "100%", position: "absolute", zIndex: 1}}>
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="smallGrid" width={this.props.minorTickSpacing} height={this.props.minorTickSpacing}
                                 patternUnits="userSpaceOnUse">
                            <path d={smallGrid} fill="none" stroke="var(--custom-text-color)" strokeWidth="0.5"
                                  opacity={opacity}/>
                        </pattern>
                        <pattern id="grid" width={this.props.majorTickSpacing}
                                 height={this.props.majorTickSpacing} patternUnits="userSpaceOnUse"
                                 patternTransform={`translate(${this.props.translate.x} ${this.props.translate.y}) 
                                                    scale(${this.props.zoom.toString()} ${this.props.zoom.toString()})`}>
                            <rect width={this.props.majorTickSpacing} height={this.props.majorTickSpacing}
                                  fill="url(#smallGrid)"/>
                            <path d={grid} fill="none" stroke="var(--custom-text-color)" strokeWidth="1"/>
                        </pattern>
                    </defs>

                    <rect width="100%" height="100%" fill="url(#grid)" />
                    <g transform={`translate(${this.props.translate.x} ${this.props.translate.y})  
                                                    scale(${this.props.zoom.toString()} ${this.props.zoom.toString()})`}>
                        <path d={`M 0 0 L 0 ${-this.props.majorTickSpacing / this.props.zoom}`} fill='none' stroke="red" strokeWidth="1"/>
                        <path d={`M 0 0 L ${this.props.majorTickSpacing / this.props.zoom} 0`} fill='none' stroke="green" strokeWidth="1"/>
                    </g>
                </svg>
            </div>
        );
    }
}
