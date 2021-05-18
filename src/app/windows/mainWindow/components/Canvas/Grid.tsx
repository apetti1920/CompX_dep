// @flow
import * as React from 'react';
import theme from '../../../../theme'
import {PointType} from "../../../../../shared/types";

type Props = {
    canvasTranslation: PointType
    canvasZoom: number
    tickSpacing: number
};

export default class Grid extends React.Component<Props, never> {
    public static defaultProps = {
        tickSpacing: 80,
        canvasTranslation: {x: 0, y: 0},
        canvasZoom: 1
    }

    render(): React.ReactElement {
        const radius = Math.sqrt(2);
        
        return (
            <g id="BackgroundGrid" width="100%" height="100%" order={1}>
                <pattern id="grid" x={radius} y={radius} width={this.props.tickSpacing} height={this.props.tickSpacing}
                         patternUnits="userSpaceOnUse"
                         patternTransform={
                             `translate(${this.props.canvasTranslation.x} ${this.props.canvasTranslation.y})
                                     scale(${this.props.canvasZoom} ${this.props.canvasZoom})`}>
                    <circle cx={this.props.tickSpacing-radius} cy={this.props.tickSpacing-radius}
                            r={radius} fill={theme.palette.text} opacity={0.75}/>
                </pattern>
                <rect width="100%" height="100%" fill="url(#grid)"/>
                <g transform={`translate(${this.props.canvasTranslation.x} ${this.props.canvasTranslation.y})  
                                                    scale(${this.props.canvasZoom} ${this.props.canvasZoom})`}>
                    <path d={`M 0 0 L 0 ${-this.props.tickSpacing / this.props.canvasZoom}`} fill='none' stroke="red" strokeWidth="1"/>
                    <path d={`M 0 0 L ${this.props.tickSpacing / this.props.canvasZoom} 0`} fill='none' stroke="green" strokeWidth="1"/>
                </g>
            </g>
        );
    }
}
