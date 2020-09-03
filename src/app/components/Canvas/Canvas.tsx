// @flow
import * as React from 'react';

import {Grid} from "./Grid";
import {PointType} from "../types";
import {Clamp, linearInterp} from "../../../helpers/utils";
import Ruler from "./Ruler";
import { ref } from "framework-utils";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from 'redux';
import {MovedCanvasAction, ZoomedCanvasAction} from "../../store/actions";
import {StateType} from "../../store/types/stateTypes";
import {CanvasType} from "../../store/types/canvasTypes";

interface StateProps {
    canvasZoom: number,
    canvasTranslation: PointType
}

interface DispatchProps {
    onZoom: (newZoom: number) => void,
    onTranslate: (newTranslation: PointType) => void
}

type Props = StateProps & DispatchProps

type State = {
    isMouseDown: boolean
};

//TODO: Fix ruler componet
//TODO: Save last zoom and translation fo grid to redux

class Canvas extends React.Component<Props, State> {
    private readonly gridRef: React.RefObject<HTMLDivElement>;

    constructor(props: Props) {
        super(props);

        this.gridRef = React.createRef()

        this.state = {
            isMouseDown: false
        }
    }

    screenToWorld(point: PointType): PointType {
        const gX1 = (point.x - this.props.canvasTranslation.x) / this.props.canvasZoom;
        const gY1 = (point.y - this.props.canvasTranslation.y) / this.props.canvasZoom;
        return {x: gX1, y: gY1}
    }

    dropBlock = (e: any) => {
        e.preventDefault();
        const cardId = e.dataTransfer.getData('card_id');
    }

    handleScroll = (e: React.WheelEvent) => {
        const mouseWorld = this.screenToWorld({x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY})

        // noinspection JSSuspiciousNameCombination
        let tempScroll = this.props.canvasZoom + linearInterp(e.deltaY, -100, 100, -0.2, 0.2);
        tempScroll = Clamp(tempScroll, 1, 4);

        const scaleChange = tempScroll - this.props.canvasZoom;

        const tempCanvas: CanvasType = {translation: this.props.canvasTranslation, zoom: this.props.canvasZoom}
        tempCanvas.zoom = tempScroll;
        tempCanvas.translation = {
            x: tempCanvas.translation.x - (mouseWorld.x * scaleChange),
            y: tempCanvas.translation.y - (mouseWorld.y * scaleChange)
        }
        this.props.onZoom(tempCanvas.zoom)
        this.props.onTranslate(tempCanvas.translation)

        e.stopPropagation();
    };

    onMouseDown = (e: React.MouseEvent) => {
        const tempState = {...this.state};
        tempState.isMouseDown = true;
        this.setState(tempState);
        e.stopPropagation();
        e.preventDefault();
    };

    onMouseMove = (e: React.MouseEvent) => {
        if (this.state.isMouseDown) {
            const tempState = {...this.props};
            tempState.canvasTranslation = {x: tempState.canvasTranslation.x + e.movementX,
                y: tempState.canvasTranslation.y + e.movementY}
            this.props.onTranslate(tempState.canvasTranslation)
        }

        e.stopPropagation()
        e.preventDefault()
    };

    onMouseUp = (e: React.MouseEvent) => {
        const tempState = {...this.state};
        tempState.isMouseDown = false;
        this.setState(tempState);
        e.stopPropagation()
        e.preventDefault()
    };

    render() {
        const cursor = this.state.isMouseDown ? 'crosshair' : 'pointer';

        return (
            <div style={{display: "flex", flexDirection: "column", width: "100%", height: "100%"}}>
                <div style={{display: "flex", flexDirection: "row", width: "100%", height: "var(--sidebar-width)"}}>
                    <div style={{width: "var(--sidebar-width)", height: "var(--sidebar-width)",
                        borderRight: "calc(var(--border-width)/2) solid var(--custom-accent-color)",
                        borderBottom: "calc(var(--border-width)/2) solid var(--custom-accent-color)"}} onClick={()=>{
                        this.centerGrid();
                    }}/>
                    <div style={{height: "100%", flex: 1}}>
                        <Ruler id={0} ref={ref(this, "rulerTop")} minorTickSpacing={8} majorTickSpacing={80}
                               type="horizontal" zoom={this.props.canvasZoom} translate={this.props.canvasTranslation}/>
                    </div>
                </div>
                <div style={{display: "flex", flexDirection: "row", width: "100%", flex: 1}}>
                    <div style={{height: "100%", width: "var(--sidebar-width)"}}>
                        <Ruler id={1} ref={ref(this, "rulerLeft")} minorTickSpacing={8} majorTickSpacing={80}
                               type="vertical" zoom={this.props.canvasZoom} translate={this.props.canvasTranslation}/>
                    </div>
                    <div style={{height: "100%", cursor: cursor, flex: 1,
                        borderLeft: "calc(var(--border-width)/2) solid var(--custom-accent-color)",
                        borderTop: "calc(var(--border-width)/2) solid var(--custom-accent-color)"}} onWheel={this.handleScroll}
                         onMouseDown={this.onMouseDown}
                         onMouseMove={this.onMouseMove} onMouseUp={this.onMouseUp} ref={this.gridRef}>
                        <Grid minorTickSpacing={8} majorTickSpacing={80} zoom={this.props.canvasZoom}
                              translate={this.props.canvasTranslation}/>
                    </div>
                </div>
            </div>
        );
    }

    private centerGrid() {
        const tempState = {...this.props};
        tempState.canvasTranslation = {
            x: this.gridRef.current?.clientWidth / 2,
            y: this.gridRef.current?.clientHeight / 2
        };
        this.props.onTranslate(tempState.canvasTranslation)
    }
}

function mapStateToProps(state: StateType): StateProps {
    return {
        canvasZoom: state.canvas.zoom,
        canvasTranslation: state.canvas.translation
    };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
    return bindActionCreators({
        onZoom: ZoomedCanvasAction,
        onTranslate: MovedCanvasAction
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Canvas)
