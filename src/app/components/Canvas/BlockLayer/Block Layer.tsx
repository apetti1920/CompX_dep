// @flow
import * as React from 'react';
import {GraphVisualType} from "../../../store/types/graphTypes";
import {PointType} from "../../types";
import {BlockVisualType} from "../../../../types";
import {VisualBlockComponent} from "./VisualBlockComponent";

type Props = {
    graph: GraphVisualType,
    translate: PointType,
    zoom: number,
    selectedID?: string,
    onBlockSelected: (block: BlockVisualType)=>void
};

type State = never;

export class BlockLayer extends React.Component<Props, State> {
    // TODO: only render blocks and edges 2 screens out

    render(): React.ReactNode {
        return (
            <div style={{width: "100%", height: "100%", position: "absolute", zIndex: 2}}>
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    {this.props.graph.blocks.map((block) => {
                        const selected = this.props.selectedID !== undefined && this.props.selectedID === block.id;
                        return (
                            <VisualBlockComponent key={block.id} translate={this.props.translate} zoom={this.props.zoom}
                                                  selected={selected} block={block}
                                                  onBlockSelected={this.props.onBlockSelected}/>
                        )
                    })}
                </svg>
            </div>
        );
    }
}
