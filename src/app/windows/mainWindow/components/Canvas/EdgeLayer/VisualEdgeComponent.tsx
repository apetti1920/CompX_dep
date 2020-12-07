// @flow
import * as React from 'react';
import {PointType} from "../../types";
import {EdgeVisualType} from "../../../../../store/types/graphTypes";

type Props = {
    translate: PointType,
    zoom: number,
    selected: boolean,
    edge?: EdgeVisualType,
    outputPoint: PointType,
    inputPoint: PointType,
    mirrored: {outputBlock: boolean, inputBlock: boolean},
    onMouseDown?: (e: React.MouseEvent, blockID: string)=>void,
    onMouseUp?: (e: React.MouseEvent)=>void,
};

type State = {
    hovering: boolean
};

export class VisualEdgeComponent extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            hovering: false
        }
    }

    render(): React.ReactNode {
        const lineCommand = this.getLineCommand();
        return (
            <g style={{pointerEvents: "auto", cursor: (this.state.hovering)?"pointer":""}}
               transform={`translate(${this.props.translate.x} ${this.props.translate.y})
                                scale(${this.props.zoom.toString()} ${this.props.zoom.toString()})`}
               onMouseDown={(e)=> {
                   if (this.props.edge!==undefined && this.props.onMouseDown(e, this.props.edge.id)!==undefined) {
                       return this.props.onMouseDown(e, this.props.edge.id);
                   }
                   return {};
               }}

               onMouseUp={()=>((this.props.edge!==undefined&&this.props.onMouseUp!==undefined)?this.props.onMouseUp:{})}
               onMouseOver={()=>{
                   const tempState = {...this.state};
                   tempState.hovering=!tempState.hovering;
                   this.setState(tempState);
               }}>
                <path d={lineCommand} stroke="red" fill="none"
                      strokeWidth={(this.props.selected||this.state.hovering)?"2":"1"}/>
            </g>
        );
    }

    private getLineCommand() {
        if (this.props.mirrored.outputBlock === this.props.mirrored.inputBlock) {
            let halfXOut: number; let halfXIn: number;
            if (this.props.inputPoint.x > this.props.outputPoint.x) {
                halfXOut = this.props.outputPoint.x + (Math.abs(this.props.inputPoint.x - this.props.outputPoint.x) / 2.0);
                halfXIn = halfXOut;
            } else {
                halfXOut = this.props.outputPoint.x + (Math.abs(this.props.inputPoint.x - this.props.outputPoint.x) / 2.0);
                halfXIn = this.props.inputPoint.x - (Math.abs(this.props.inputPoint.x - this.props.outputPoint.x) / 2.0);
            }

            return `M ${this.props.outputPoint.x}, ${this.props.outputPoint.y} 
                             C ${halfXOut}, ${this.props.outputPoint.y} 
                             ${halfXIn}, ${this.props.inputPoint.y} 
                             ${this.props.inputPoint.x}, ${this.props.inputPoint.y}`;
        } else if (this.props.mirrored.inputBlock) {
            const dist = Math.sqrt(((this.props.outputPoint.x - this.props.inputPoint.x) ** 2) + ((this.props.outputPoint.y - this.props.inputPoint.y) ** 2));
            return `M ${this.props.outputPoint.x}, ${this.props.outputPoint.y} 
                             C ${this.props.outputPoint.x + dist}, ${this.props.outputPoint.y} 
                             ${this.props.inputPoint.x + dist}, ${this.props.inputPoint.y} 
                             ${this.props.inputPoint.x}, ${this.props.inputPoint.y}`;
        } else {
            const dist = -Math.sqrt(((this.props.outputPoint.x - this.props.inputPoint.x) ** 2) + ((this.props.outputPoint.y - this.props.inputPoint.y) ** 2));
            return `M ${this.props.outputPoint.x}, ${this.props.outputPoint.y} 
                             C ${this.props.outputPoint.x + dist}, ${this.props.outputPoint.y} 
                             ${this.props.inputPoint.x + dist}, ${this.props.inputPoint.y} 
                             ${this.props.inputPoint.x}, ${this.props.inputPoint.y}`;
        }
    }
}
