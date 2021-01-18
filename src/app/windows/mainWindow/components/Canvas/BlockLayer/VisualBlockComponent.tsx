// @flow
import * as React from 'react';
import JsxParser from 'react-jsx-parser'
import {BlockVisualType, CanvasType, MouseType, StateType} from "../../../../../store/types";
import {PointType} from "../../../../../../shared/types";
import {bindActionCreators, Dispatch} from "redux";
import {
    DeselectAllBlocksAction,
    MouseAction,
    MovedBlockAction,
    ToggleSelectedBlockAction
} from "../../../../../store/actions";
import {connect} from "react-redux";
import {ScreenToWorld} from "../../../../../utilities";
import {MouseDownType} from "../../types";
import {ContextMenu} from "../../ComponentUtils/ContextMenu";

interface StateProps {
    canvas: CanvasType,
    block: BlockVisualType
}

interface DispatchProps {
    onMovedBlock: (delta: PointType) => void,
    onMouseAction: (newMouse: MouseType) => void,
    onToggleBlockSelection: (visualBlockId: string, selected: boolean) => void,
    onDeselectAllBlocks: () => void
}

type ComponentProps = {
    id: string,
    onContextMenu: (e: React.MouseEvent, blockID: string) => void
};

type Props = StateProps & DispatchProps & ComponentProps

type State = {
    didMove: boolean
}

class VisualBlockComponent extends React.Component<Props, State> {
    private margin = {top: 2, right: 2, bottom: 2, left: 2};
    private cornerRadius = 5;

    constructor(props: Props) {
        super(props);

        this.state = {
            didMove: false
        }
    }

    /* Overrides the mouse down event of a block */
    onMouseDownHandlerBlock = (e: React.MouseEvent): void => {
        e.preventDefault();
        if (e.button === 0) {
            this.props.onMouseAction({
                mouseDownOn: MouseDownType.BLOCK,
                currentMouseLocation: ScreenToWorld({x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY},
                    this.props.canvas.translation, this.props.canvas.zoom)
            });

            if (!this.props.block.selected) {
                if (!e.shiftKey) {
                    this.props.onDeselectAllBlocks();
                }
                this.props.onToggleBlockSelection(this.props.block.id, true);
            }

            this.setState({...this.state, didMove: false});
        }
        e.stopPropagation();
    };

    onMouseDragBlockHandler = (e: React.MouseEvent): void => {
        if (this.props.canvas.mouse.mouseDownOn === MouseDownType.BLOCK) {
            this.props.onMovedBlock({x: e.nativeEvent.movementX, y: e.nativeEvent.movementY});

            this.props.onMouseAction({
                mouseDownOn: MouseDownType.BLOCK,
                currentMouseLocation: ScreenToWorld({x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY},
                    this.props.canvas.translation, this.props.canvas.zoom)
            });

            this.setState({...this.state, didMove: true});
        }
    }

    /* Overrides the mouse down event of a block */
    onMouseUpHandlerBlock = (e: React.MouseEvent): void => {
        e.preventDefault();

        if (e.button === 0) {
            this.props.onMouseAction({
                mouseDownOn: MouseDownType.NONE,
                currentMouseLocation: ScreenToWorld({x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY},
                    this.props.canvas.translation, this.props.canvas.zoom)
            });
        }
        e.stopPropagation();
    };

    render(): React.ReactNode {
        let dragComponents = <React.Fragment/>
        if (this.props.block.selected) {
            dragComponents = (
                <g>
                    <rect x={this.props.block.position.x - 1} y={this.props.block.position.y - 1}
                          width={this.cornerRadius} height={this.cornerRadius} fill="red"/>
                    <rect x={this.props.block.position.x + this.props.block.size.x - this.cornerRadius + 1 }
                          y={this.props.block.position.y - 1}
                          width={this.cornerRadius} height={this.cornerRadius} fill="red"/>
                    <rect x={this.props.block.position.x - 1}
                          y={this.props.block.position.y  + this.props.block.size.y - this.cornerRadius + 1}
                          width={this.cornerRadius} height={this.cornerRadius} fill="red"/>
                    <rect x={this.props.block.position.x  + this.props.block.size.x - this.cornerRadius + 1}
                          y={this.props.block.position.y  + this.props.block.size.y - this.cornerRadius + 1}
                          width={this.cornerRadius} height={this.cornerRadius} fill="red"/>
                </g>
            )
        }

        return (
            <g style={{pointerEvents: "none"}}
               transform={`translate(${this.props.canvas.translation.x} ${this.props.canvas.translation.y})
                                scale(${this.props.canvas.zoom.toString()} ${this.props.canvas.zoom.toString()})`}>
                {dragComponents}
                <rect x={this.props.block.position.x} y={this.props.block.position.y}
                      width={this.props.block.size.x} height={this.props.block.size.y} rx={this.cornerRadius}
                      style={{cursor: "pointer", stroke: this.props.block.selected?"pink":"", pointerEvents: "auto",
                          strokeWidth: this.props.block.selected?"1":"0", strokeOpacity: this.props.block.selected?0.9:0.0}}
                      onMouseDown={this.onMouseDownHandlerBlock} onMouseMove={this.onMouseDragBlockHandler}
                      onMouseUp={this.onMouseUpHandlerBlock} onContextMenu={(e) => this.props.onContextMenu(e, this.props.block.id)}/>
                <rect x={this.props.block.position.x + this.margin.left}
                      y={this.props.block.position.y + this.margin.top} rx={this.cornerRadius}
                      width={this.props.block.size.x - this.margin.left - this.margin.right}
                      height={this.props.block.size.y - this.margin.top - this.margin.bottom}
                      style={{ fill: "#eeeeee" }}/>
                <svg x={this.props.block.position.x + this.margin.left}
                     y={this.props.block.position.y + this.margin.top} rx={this.cornerRadius}
                     width={this.props.block.size.x - this.margin.left - this.margin.right}
                     height={this.props.block.size.y - this.margin.top - this.margin.bottom}>
                    <JsxParser jsx={this.props.block.blockStorage.display} renderInWrapper={false}/>
                </svg>
            </g>
        );
    }
}

function mapStateToProps(state: StateType, ownProps: ComponentProps): StateProps {
    return {
        canvas: state.canvas,
        block: state.graph.blocks.find(b => b.id === ownProps.id)
    };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
    return bindActionCreators({
        onMovedBlock: MovedBlockAction,
        onMouseAction: MouseAction,
        onToggleBlockSelection: ToggleSelectedBlockAction,
        onDeselectAllBlocks: DeselectAllBlocksAction
    }, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(VisualBlockComponent)
