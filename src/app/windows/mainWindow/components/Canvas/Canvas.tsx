// @flow
import * as React from 'react';

import {PointType} from "../../../../../shared/types";
import {Clamp, linearInterp} from "../../../../../electron/utils";
import {connect} from "react-redux";
import {GraphVisualType, StateType} from "../../../../store/types";
import {BlockStorageType} from "@compx/sharedtypes";
import {ScreenToWorld} from "../../../../utilities";
import BlockLayer2 from "./BlockLayer/BlockLayer2";
import Grid from "./Grid";

interface StateProps {
    graph: GraphVisualType
    blockLibrary: BlockStorageType[]
}

type Props = StateProps

type State = {
    isMouseDownOnCanvas: boolean
    movedCanvas: boolean
    canvasTranslation: PointType
    canvasZoom: number
}

class Canvas extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            isMouseDownOnCanvas: false,
            movedCanvas: false,
            canvasTranslation: {x: 0, y: 0},
            canvasZoom: 1
        }
    }

    /* --------------------------------------------Handler Overrides------------------------------------------------- */
    /* Overrides the onscroll event of the canvas */
    handleScroll = (e: React.WheelEvent) => {
        const mouseWorld = ScreenToWorld({x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY},
            this.state.canvasTranslation, this.state.canvasZoom);

        // noinspection JSSuspiciousNameCombination
        let tempScroll = this.state.canvasZoom + linearInterp(e.deltaY, -100, 100, -0.2, 0.2);
        tempScroll = Clamp(tempScroll, 1, 4);

        const scaleChange = tempScroll - this.state.canvasZoom;
        const newTranslation = {
            x: this.state.canvasTranslation.x - (mouseWorld.x * scaleChange),
            y: this.state.canvasTranslation.y - (mouseWorld.y * scaleChange)
        }

        this.setState({
            canvasZoom: tempScroll,
            canvasTranslation: newTranslation
        });

        e.stopPropagation();
    };

    onMouseDownHandlerCanvas = (e: React.MouseEvent) => {
        e.preventDefault();
        this.setState({isMouseDownOnCanvas: true});
        e.stopPropagation();
    }

    onMouseMoveOverHandlerCanvas = (e: React.MouseEvent) => {
        e.preventDefault();
        if (this.state.isMouseDownOnCanvas) {
            const newTranslation = {
                x: this.state.canvasTranslation.x + e.movementX,
                y: this.state.canvasTranslation.y + e.movementY
            };

            this.setState({
                movedCanvas: false,
                canvasTranslation: newTranslation
            });
        }
        e.stopPropagation();
    }

    onMouseUpHandlerCanvas = (e: React.MouseEvent) => {
        this.setState({isMouseDownOnCanvas: false});
    }

    render() {
        return (
            <svg id="Canvas" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" pointerEvents="none">
                <rect id="CanvasBackground" width="100%" height="100%" pointerEvents="auto" opacity={0}
                      onMouseDown={this.onMouseDownHandlerCanvas} onMouseUp={this.onMouseUpHandlerCanvas}
                      onMouseMove={this.onMouseMoveOverHandlerCanvas} onWheel={this.handleScroll} order={0}/>
                <Grid canvasTranslation={this.state.canvasTranslation} canvasZoom={this.state.canvasZoom}/>
                <g transform={`translate(${this.state.canvasTranslation.x} ${this.state.canvasTranslation.y})
                                scale(${this.state.canvasZoom} ${this.state.canvasZoom})`}
                   pointerEvents="none" order={2}>
                    <BlockLayer2/>
                </g>
            </svg>
        );
    }

    // private centerGrid() {
    //     const tempState = {...this.props};
    //     tempState.canvas.translation = {
    //         x: this.gridRef.current?.clientWidth??0 / 2,
    //         y: this.gridRef.current?.clientHeight??0 / 2
    //     };
    //     this.props.onTranslate(tempState.canvas.translation)
    // }
}

function mapStateToProps(state: StateType): StateProps {
    return {
        graph: state.graph,
        blockLibrary: state.blockLibrary
    };
}


export default connect(mapStateToProps, {})(Canvas)
