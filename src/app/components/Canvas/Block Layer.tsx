// @flow
import * as React from 'react';
import {GraphVisualType} from "../../store/types/graphTypes";
import {PointType} from "../types";
import {BlockVisualType} from "../../../types";

type Props = {
    graph: GraphVisualType
    translate: PointType
    zoom: number
};

type State = {
    selectedID?: string
};

export class BlockLayer extends React.Component<Props, State> {
    // TODO: only render blocks and edges 2 screens out

    constructor(props: Props) {
        super(props);

        this.state = {
            selectedID: undefined
        };
    }

    onBlockSelected = (block: BlockVisualType) => {
        const tempState = {...this.state};
        tempState.selectedID = block.id;
        this.setState(tempState);
    }

    render(): React.ReactNode {
        return (
            <div style={{width: "100%", height: "100%", position: "absolute", zIndex: 2}}>
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    {this.props.graph.blocks.map((block) => {
                        const selected = this.state.selectedID !== undefined && this.state.selectedID === block.id;
                        return (
                            <rect key={block.id} width={block.size.x} height={block.size.y} x={block.position.x} y={block.position.y}
                                  transform={`translate(${this.props.translate.x} ${this.props.translate.y}) 
                                                scale(${this.props.zoom.toString()} ${this.props.zoom.toString()})`}
                                  style={{cursor: "pointer", stroke: selected?"pink":"", strokeWidth: selected?"1":"0",
                                  strokeOpacity: selected?0.9:0.0}} onClick={() => this.onBlockSelected(block)}/>
                        )
                    })}
                </svg>
            </div>
        );
    }
}
