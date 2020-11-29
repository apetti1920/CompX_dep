// @flow
import * as React from 'react';
import {GraphVisualType, BlockVisualType} from "../../../../store/types/graphTypes";
import {PointType} from "../../types";
import {VisualBlockComponent} from "./VisualBlockComponent";

type Props = {
    graph: GraphVisualType,
    translate: PointType,
    zoom: number,
    selectedIDs?: string[],
    onMouseDownHandlerBlock: (e: React.MouseEvent, blockID: string)=>void,
    onMouseUpHandlerPort: (e: React.MouseEvent, output: boolean, blockID: string, ioName: string)=>void,
    onContextMenuBlock: (e: React.MouseEvent, blockID: string)=>void,
    onMouseUpHandlerBlock: (e: React.MouseEvent)=>void,
    onMouseDownHandlerPort: (e: React.MouseEvent, output: boolean, blockID: string, ioName: string)=>void
};

type State = never;

export class BlockLayer extends React.Component<Props, State> {
    // TODO: only render blocks and edges 2 screens out
    // TODO: Add curves from redux
    // TODO: Add curve while dragging
    // TODO: reject curves for not connecting same type
    // TODO: Color curves depending on type

    render(): React.ReactNode {
        return (
            <div style={{width: "100%", height: "100%", position: "absolute", zIndex: 2, pointerEvents: "none"}}>
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    {this.props.graph.blocks.map((block) => {
                        const selected = this.props.selectedIDs !== undefined &&
                            this.props.selectedIDs.includes(block.id);
                        return (
                            <VisualBlockComponent key={block.id} translate={this.props.translate} zoom={this.props.zoom}
                                                  selected={selected} block={block}
                                                  onMouseDownBlock={this.props.onMouseDownHandlerBlock}
                                                  onMouseUpBlock={this.props.onMouseUpHandlerBlock}
                                                  onMouseDownHandlerPort={this.props.onMouseDownHandlerPort}
                                                  onMouseUpHandlerPort={this.props.onMouseUpHandlerPort}
                                                  onContextMenuBlock={this.props.onContextMenuBlock}/>
                        )
                    })}
                </svg>
            </div>
        );
    }
}
