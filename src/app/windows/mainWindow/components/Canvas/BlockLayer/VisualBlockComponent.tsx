// @flow
import * as React from 'react';
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
import {DataTransferType} from "../../../../../../shared/lib/GraphLibrary/types/BlockStorage";

interface StateProps {
    canvas: CanvasType,
    block: BlockVisualType,
    displayData?: DataTransferType[]
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
    didMove: boolean,
    isResizeHovering: boolean
}

class VisualBlockComponent extends React.Component<Props, State> {
    private margin = {top: 2, right: 2, bottom: 2, left: 2};
    private cornerRadius = 5;

    constructor(props: Props) {
        super(props);

        this.state = {
            didMove: false,
            isResizeHovering: false
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

    defaultDisplay = (): React.ReactElement => {
        const inputLabelComponents: React.ReactElement[] = []
        if (this.props.block.blockStorage.inputPorts.length > 0) {
            const yPct = 100.0 / (this.props.block.blockStorage.inputPorts.length + 1);

            for (let i=0; i<this.props.block.blockStorage.inputPorts.length; i++) {
                inputLabelComponents.push(<text key={`input_label_${this.props.block.blockStorage.inputPorts[i].id}`}
                                                x={!this.props.block.mirrored?"7%":"93%"}
                                                y={(yPct*(i+1)).toString() + "%"}
                                                dominantBaseline="middle" textAnchor="middle"
                                                style={{font: "italic 3px sans-serif"}}>
                    {this.props.block.blockStorage.inputPorts[i].name}
                </text>);
            }
        }

        const outputLabelComponents: React.ReactElement[] = []
        if (this.props.block.blockStorage.outputPorts.length > 0) {
            const yPct = 100.0 / (this.props.block.blockStorage.outputPorts.length + 1);

            for (let i=0; i<this.props.block.blockStorage.outputPorts.length; i++) {
                outputLabelComponents.push(<text key={`output_label_${this.props.block.blockStorage.outputPorts[i].id}`}
                                                 x={this.props.block.mirrored?"7%":"93%"}
                                                 y={(yPct*(i+1)).toString() + "%"}
                                                 dominantBaseline="middle" textAnchor="middle"
                                                 style={{font: "italic 3px sans-serif"}}>
                    {this.props.block.blockStorage.outputPorts[i].name}
                </text>);
            }
        }

        return (
            <g>
                <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle"
                      style={{font: "italic 6px sans-serif"}}>{this.props.block.blockStorage.name}</text>
                {inputLabelComponents}
                {outputLabelComponents}
            </g>);

    }

    updatedDisplayRenderer = (): React.ReactElement => {
        if (this.props.block.blockStorage.display === undefined) {
            return this.defaultDisplay();
        } else {
            const size = {x: this.props.block.size.x - this.margin.left - this.margin.right,
                y: this.props.block.size.y - this.margin.top - this.margin.bottom};
            if (this.props.displayData === undefined) {
                if (this.props.block.displayStatic !== undefined) {
                    const ret = this.props.block.displayStatic(size);
                    if (ret !== undefined) {
                        return ret;
                    } else {
                        return this.defaultDisplay();
                    }
                } else {
                    return this.defaultDisplay();
                }
            } else {
                if (this.props.block.displayDynamic !== undefined) {
                    const ret = this.props.block.displayDynamic(this.props.displayData, size);
                    if (ret !== undefined) {
                        return ret;
                    } else {
                        return this.defaultDisplay();
                    }
                } else {
                    return this.defaultDisplay();
                }
            }
        }
    }

    makeDragComponents = (): React.ReactElement => {
        return (
            <g>
                <rect x={this.props.block.position.x - 1} y={this.props.block.position.y - 1}
                      width={this.cornerRadius} height={this.cornerRadius} fill="red"
                      style={{cursor:this.state.isResizeHovering?"crosshair":"auto"}}
                      onMouseEnter={() => {this.setState({...this.state, isResizeHovering: true})}}
                      onMouseLeave={() => {this.setState({...this.state, isResizeHovering: false})}}
                      onClick={() => {console.log("clicked")}}/>
                <rect x={this.props.block.position.x + this.props.block.size.x - this.cornerRadius + 1 }
                      y={this.props.block.position.y - 1}
                      style={{cursor:this.state.isResizeHovering?"crosshair":"auto"}}
                      width={this.cornerRadius} height={this.cornerRadius} fill="red"
                      onMouseEnter={() => {this.setState({...this.state, isResizeHovering: true})}}
                      onMouseLeave={() => {this.setState({...this.state, isResizeHovering: false})}}/>
                <rect x={this.props.block.position.x - 1}
                      y={this.props.block.position.y  + this.props.block.size.y - this.cornerRadius + 1}
                      width={this.cornerRadius} height={this.cornerRadius} fill="red"
                      style={{cursor:this.state.isResizeHovering?"crosshair":"auto"}}
                      onMouseEnter={() => {this.setState({...this.state, isResizeHovering: true})}}
                      onMouseLeave={() => {this.setState({...this.state, isResizeHovering: false})}}/>
                <rect x={this.props.block.position.x  + this.props.block.size.x - this.cornerRadius + 1}
                      y={this.props.block.position.y  + this.props.block.size.y - this.cornerRadius + 1}
                      width={this.cornerRadius} height={this.cornerRadius} fill="red"
                      style={{cursor:this.state.isResizeHovering?"crosshair":"auto"}}
                      onMouseEnter={() => {this.setState({...this.state, isResizeHovering: true})}}
                      onMouseLeave={() => {this.setState({...this.state, isResizeHovering: false})}}/>
            </g>
        )
    }

    render(): React.ReactNode {
        let dragComponents = <React.Fragment/>
        if (this.props.block.selected) {
            dragComponents = this.makeDragComponents()
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
                    {this.updatedDisplayRenderer()}
                </svg>
            </g>
        );
    }
}

function mapStateToProps(state: StateType, ownProps: ComponentProps): StateProps {
    const b1 = state.graph.blocks.find(b => b.id === ownProps.id);
    if (b1 !== undefined) {
        return {
            canvas: state.canvas,
            block: b1,
            displayData: state.displayData !== undefined ? state.displayData.map(data =>
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            { // @ts-ignore
                return {time: data.time, data: data.data[ownProps.id]} }) : undefined
        };
    } else {
        throw Error("Block Not found");
    }
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
