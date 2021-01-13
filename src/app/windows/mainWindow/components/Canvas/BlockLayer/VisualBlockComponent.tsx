// @flow
import * as React from 'react';
import JsxParser from 'react-jsx-parser'
import {BlockVisualType, StateType} from "../../../../../store/types";
import {PointType} from "../../../../../../shared/types";
import {bindActionCreators, Dispatch} from "redux";
import {MovedBlockAction} from "../../../../../store/actions";
import {connect} from "react-redux";
import {CanvasSelectionType} from "../../types";
import {ScreenToWorld} from "../../../../../utilities";

type NamedIO = {
    output: boolean,
    portName: string
}

interface StateProps {
    zoom: number,
    translate: PointType
}

interface DispatchProps {
    onMovedBlock: (delta: PointType) => void
}

type ComponentProps = {
    block: BlockVisualType,
    onContextMenuBlock: (e: React.MouseEvent, blockID: string)=>void,
    onMouseDownHandlerPort: (e: React.MouseEvent, output: boolean, blockID: string, ioName: string)=>void,
    onMouseUpHandlerPort: (e: React.MouseEvent, output: boolean, blockID: string, ioName: string)=>void,
};

type Props = StateProps & DispatchProps & ComponentProps

type State = {
    mouseWorldCoordinates?: PointType
    mouseDownOnBlock: boolean
};

class VisualBlockComponent extends React.Component<Props, State> {
    private margin = {top: 2, right: 2, bottom: 2, left: 2};
    private cornerRadius = 5;

    constructor(props: Props) {
        super(props);

        this.state = {
            mouseWorldCoordinates: undefined,
            mouseDownOnBlock: false
        }
    }

    /* Overrides the mouse down event of a block */
    onMouseDownHandlerBlock = (e: React.MouseEvent): void => {
        e.preventDefault();
        if (e.button === 0) {
            const tempState = {...this.state};

            tempState.mouseDownOnBlock = true;
            //tempState.contextMenu = undefined;

            tempState.mouseWorldCoordinates =
                ScreenToWorld({x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY},
                    this.props.translate, this.props.zoom);

            if (this.props.block.selected) {
                if (!e.shiftKey) {
                    const tempBlock = {...this.props.block};
                    tempBlock.selected = false;
                    // updatte block
                }
            } else {
                const tempBlock = {...this.props.block};
                tempBlock.selected = true;
                // update block
            }

            this.setState(tempState);
        }
        e.stopPropagation();
    };

    onMouseDragBlockHandler = (e: React.MouseEvent): void => {
        if (this.state.mouseDownOnBlock) {
            this.props.onMovedBlock({x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY});
        }
    }

    /* Overrides the mouse down event of a block */
    onMouseUpHandlerBlock = (e: React.MouseEvent): void => {
        e.preventDefault();
        if (e.button === 0) {
            const tempState = {...this.state};
            tempState.mouseDownOnBlock = false;
            this.setState(tempState);
        }
        e.stopPropagation();
    };

    // onMouseLeaveBlockHandler = (e: React.MouseEvent): void => {
    //     const tempState = {...this.state};
    //     tempState.mouseDownOnBlock = false;
    //     this.setState(tempState);
    // }
    //
    // onMouseEnterPortHandler = (e: React.MouseEvent, output: boolean, portName: string) => {
    //     const tempState = {...this.state};
    //     tempState.hovering = {output: output, portName: portName};
    //     this.setState(tempState);
    // }
    //
    // onMouseLeavePortHandler = (e: React.MouseEvent) => {
    //     const tempState = {...this.state};
    //     tempState.hovering = undefined;
    //     this.setState(tempState);
    // }

    render(): React.ReactNode {
        const deltaYi = this.props.block.size.y / (this.props.block.blockStorage.inputPorts.length + 1);
        const inputPortComponents = this.props.block.blockStorage.inputPorts.map((port, index) => {
            const keyId = "b_" + this.props.block.id + "_pi_" + index;
            return this.getCircle(keyId, false, deltaYi, index, port.name);
        });

        const deltaYo = this.props.block.size.y / (this.props.block.blockStorage.outputPorts.length + 1);
        const outputPortComponents = this.props.block.blockStorage.outputPorts.map((port, index) => {
            const keyId = "b_" + this.props.block.id + "_po_" + index;
            return this.getCircle(keyId, true, deltaYo, index, port.name);
        });

        let dragComponets = <React.Fragment/>
        if (this.props.block.selected) {
            dragComponets = (
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
               transform={`translate(${this.props.translate.x} ${this.props.translate.y})
                                scale(${this.props.zoom.toString()} ${this.props.zoom.toString()})`}>
                {dragComponets}
                <rect x={this.props.block.position.x} y={this.props.block.position.y}
                      width={this.props.block.size.x} height={this.props.block.size.y} rx={this.cornerRadius}
                      style={{cursor: "pointer", stroke: this.props.block.selected?"pink":"", pointerEvents: "auto",
                          strokeWidth: this.props.block.selected?"1":"0", strokeOpacity: this.props.block.selected?0.9:0.0}}
                      onMouseDown={this.onMouseDownHandlerBlock} onMouseMove={this.onMouseDragBlockHandler}
                      onMouseUp={this.onMouseUpHandlerBlock}
                      onContextMenu={(e)=>
                          this.props.onContextMenuBlock(e, this.props.block.id)}/>
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
                {inputPortComponents}
                {outputPortComponents}
            </g>
        );
    }

    private getCircle(keyId: string, output: boolean, deltaYo: number, index: number, portName: string) {
        // const isHovering = this.state.hovering==undefined?
        //     false:((this.state.hovering.portName==portName&&this.state.hovering.output==output));
        const isHovering = false;
        let cx = this.props.block.position.x;
        if (!this.props.block.mirrored) {
            if (output) { cx += this.props.block.size.x; }
        } else {
            if (!output) { cx += this.props.block.size.x; }
        }
        return <circle key={keyId} cx={cx} cy={this.props.block.position.y + (deltaYo * (index + 1))} r="2"
                       stroke={isHovering?"none":"red"} strokeWidth={1} fill={isHovering?"red":"none"}
                       pointerEvents="auto" cursor={isHovering?"crosshair":"auto"}
                       onMouseDown={(e) =>
                           this.props.onMouseDownHandlerPort(e, output, this.props.block.id, portName)}
                       onMouseUp={(e) =>
                           this.props.onMouseUpHandlerPort(e, output, this.props.block.id, portName)}/>
                       // onMouseEnter={(e)=>this.onMouseEnterPortHandler(e, output, portName)}
                       // onMouseLeave={this.onMouseLeavePortHandler}/>;
    }
}

function mapStateToProps(state: StateType): StateProps {
    return {
        zoom: state.canvas.zoom,
        translate: state.canvas.translation
    };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
    return bindActionCreators({
        onMovedBlock: MovedBlockAction
    }, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(VisualBlockComponent)


// else if (this.state.mouseDownOn === MouseDown.PORT) {
//     const tempState = {...this.state};
//     tempState.selectedPort = undefined;
//     tempState.mouseDownOn = MouseDown.NONE;
//     tempState.mouseWorldCoordinates =
//         this.screenToWorld({x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY});
//     this.setState(tempState);
// }
