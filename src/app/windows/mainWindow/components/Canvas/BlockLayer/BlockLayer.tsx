// @flow
import * as React from 'react';
import {GraphVisualType} from "../../../../../store/types";
import VisualBlockComponent from "./VisualBlockComponent";

type Props = {
    graph: GraphVisualType,
    selectedIDs?: string[],
    onMouseUpHandlerPort: (e: React.MouseEvent, output: boolean, blockID: string, ioName: string)=>void,
    onContextMenuBlock: (e: React.MouseEvent, blockID: string)=>void,
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
                            <VisualBlockComponent key={block.id} block={block}
                                                  onMouseDownHandlerPort={this.props.onMouseDownHandlerPort}
                                                  onMouseUpHandlerPort={this.props.onMouseUpHandlerPort}
                                                  onContextMenuBlock={this.props.onContextMenuBlock} />
                        )}
                    )}
                 </svg>
            </div>
        );
    }
}
