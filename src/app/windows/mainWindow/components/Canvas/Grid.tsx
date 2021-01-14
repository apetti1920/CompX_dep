// @flow
import * as React from 'react';
import {linearInterp} from "../../../../../electron/utils";
import {PointType} from "../../../../../shared/types";
import {MouseDownType} from "../types";
import {ScreenToWorld} from "../../../../utilities";
import {CanvasType, MouseType, StateType} from "../../../../store/types";
import {bindActionCreators, Dispatch} from "redux";
import {MouseAction, MovedCanvasAction, UpdatedGraphAction, ZoomedCanvasAction} from "../../../../store/actions";
import {connect} from "react-redux";

const _ = require('lodash');

type ComponentProps = {
    majorTickSpacing: number,
    minorTickSpacing: number
};

interface StateProps {
    canvas: CanvasType
}

interface DispatchProps {
    onTranslateGrid: (newTranslation: PointType) => void,
    onMouseAction: (newMouse: MouseType) => void
}

type Props = ComponentProps & StateProps & DispatchProps

type State = {
    movedGrid: boolean
};

class Grid extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        console.log(this.props.canvas);

        this.state = {
            movedGrid: false
        }
    }

    /* Overrides the mouse down event of the Grid */
    onMouseDownHandlerGrid = (e: React.MouseEvent) => {
        e.preventDefault();
        if (e.button === 0) {
            this.props.onMouseAction({
                mouseDownOn: MouseDownType.GRID,
                currentMouseLocation: ScreenToWorld({x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY},
                    this.props.canvas.translation, this.props.canvas.zoom)
            });
        }
        e.stopPropagation();
    };

    /* Overrides the mouse up event of the Grid */
    onMouseUpHandlerGrid = (e: React.MouseEvent) => {
        e.preventDefault();
        if (e.button === 0 && this.props.canvas.mouse.mouseDownOn === MouseDownType.GRID) {
            const tempState: State = _.cloneDeep(this.state);
            this.props.onMouseAction({
                mouseDownOn: MouseDownType.NONE,
                currentMouseLocation: ScreenToWorld({x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY},
                    this.props.canvas.translation, this.props.canvas.zoom)
            });

            if (!tempState.movedGrid) {
                // Deselect all Blocks
            }

            tempState.movedGrid = false;
            this.setState(tempState);
        }
        e.stopPropagation();
    };

    onMouseMoveOverGrid = (e: React.MouseEvent) => {
        e.preventDefault();
        if (this.props.canvas.mouse.mouseDownOn === MouseDownType.GRID) {
            const tempState: State = _.cloneDeep(this.state);
            const tempProps: Props = _.cloneDeep(this.props);

            tempState.movedGrid = true;
            tempProps.canvas.mouse.currentMouseLocation =
                ScreenToWorld({x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY}, this.props.canvas.translation, this.props.canvas.zoom);
            tempProps.canvas.translation = {
                x: tempProps.canvas.translation.x + e.movementX,
                y: tempProps.canvas.translation.y + e.movementY
            };

            this.props.onMouseAction(tempProps.canvas.mouse);
            this.props.onTranslateGrid(tempProps.canvas.translation)
            this.setState(tempState);
        }
        e.stopPropagation();
    }

    render(): React.ReactElement {
        const opacity = linearInterp(this.props.canvas.zoom, 0, 100, 0.3, 0.75);
        const cursor = (this.props.canvas.mouse.mouseDownOn === MouseDownType.GRID) ? "grabbing" : "grab";

        const smallGrid = `M ${this.props.minorTickSpacing} 0 L 0 0 0 ${this.props.minorTickSpacing}`;
        const grid = `M ${this.props.majorTickSpacing} 0 L 0 0 0 ${this.props.majorTickSpacing}`;

        return (
            <div style={{width: "100%", height: "100%", cursor: cursor, position: "absolute", zIndex: 1, pointerEvents: "auto"}}
                 onMouseDown={this.onMouseDownHandlerGrid} onMouseUp={this.onMouseUpHandlerGrid} onMouseMove={this.onMouseMoveOverGrid}>
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="smallGrid" width={this.props.minorTickSpacing} height={this.props.minorTickSpacing}
                                 patternUnits="userSpaceOnUse">
                            <path d={smallGrid} fill="none" stroke="var(--custom-text-color)" strokeWidth="0.5"
                                  opacity={opacity}/>
                        </pattern>
                        <pattern id="grid" width={this.props.majorTickSpacing}
                                 height={this.props.majorTickSpacing} patternUnits="userSpaceOnUse"
                                 patternTransform={`translate(${this.props.canvas.translation.x} ${this.props.canvas.translation.y}) 
                                                    scale(${this.props.canvas.zoom.toString()} ${this.props.canvas.zoom.toString()})`}>
                            <rect width={this.props.majorTickSpacing} height={this.props.majorTickSpacing}
                                  fill="url(#smallGrid)"/>
                            <path d={grid} fill="none" stroke="var(--custom-text-color)" strokeWidth="1"/>
                        </pattern>
                    </defs>

                    <rect width="100%" height="100%" fill="url(#grid)" />
                    <g transform={`translate(${this.props.canvas.translation.x} ${this.props.canvas.translation.y})  
                                                    scale(${this.props.canvas.zoom.toString()} ${this.props.canvas.zoom.toString()})`}>
                        <path d={`M 0 0 L 0 ${-this.props.majorTickSpacing / this.props.canvas.zoom}`} fill='none' stroke="red" strokeWidth="1"/>
                        <path d={`M 0 0 L ${this.props.majorTickSpacing / this.props.canvas.zoom} 0`} fill='none' stroke="green" strokeWidth="1"/>
                    </g>
                </svg>
            </div>
        );
    }
}

function mapStateToProps(state: StateType): StateProps {
    return {
        canvas: state.canvas
    };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
    return bindActionCreators({
        onZoom: ZoomedCanvasAction,
        onTranslateGrid: MovedCanvasAction,
        onUpdatedGraph: UpdatedGraphAction,
        onMouseAction: MouseAction
    }, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(Grid)
