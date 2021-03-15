// @flow
import * as React from 'react';

import Grid from "./Grid";
import {MouseDownType} from "../types";
import {PointType} from "../../../../../shared/types";
import {Clamp, linearInterp} from "../../../../../electron/utils";
import Ruler from "./Ruler";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from 'redux';
import {MouseAction, MovedCanvasAction, ZoomedCanvasAction} from "../../../../store/actions";
import {CanvasType, GraphVisualType, MouseType, StateType} from "../../../../store/types";
import BlockLayer from "./BlockLayer/BlockLayer";
import {BlockStorageType} from "../../../../../shared/lib/GraphLibrary/types/BlockStorage";
import {ScreenToWorld} from "../../../../utilities";
import EdgeLayer from "./EdgeLayer/EdgeLayer";

const _ = require('lodash');

interface StateProps {
    canvas: CanvasType
    graph: GraphVisualType
    blockLibrary: BlockStorageType[]
}

interface DispatchProps {
    onZoom: (newZoom: number) => void,
    onTranslate: (newTranslation: PointType) => void,
    onMouseAction: (newMouse: MouseType) => void
}

type Props = StateProps & DispatchProps

//TODO: Fix ruler componet

class Canvas extends React.Component<Props, never> {
    private readonly gridRef: React.RefObject<HTMLDivElement>;

    constructor(props: Props) {
        super(props);

        this.gridRef = React.createRef();
    }

    /* --------------------------------------------Handler Overrides------------------------------------------------- */
    /* Overrides the onscroll event of the canvas */
    handleScroll = (e: React.WheelEvent) => {
        const mouseWorld = ScreenToWorld({x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY},
            this.props.canvas.translation, this.props.canvas.zoom);

        // noinspection JSSuspiciousNameCombination
        let tempScroll = this.props.canvas.zoom + linearInterp(e.deltaY, -100, 100, -0.2, 0.2);
        tempScroll = Clamp(tempScroll, 1, 4);

        const scaleChange = tempScroll - this.props.canvas.zoom;

        const tempCanvas: CanvasType = _.cloneDeep(this.props.canvas);
        tempCanvas.zoom = tempScroll;
        tempCanvas.translation = {
            x: tempCanvas.translation.x - (mouseWorld.x * scaleChange),
            y: tempCanvas.translation.y - (mouseWorld.y * scaleChange)
        }
        this.props.onZoom(tempCanvas.zoom)
        this.props.onTranslate(tempCanvas.translation)

        this.props.onMouseAction({mouseDownOn: MouseDownType.NONE,
            currentMouseLocation: tempCanvas.translation})

        e.stopPropagation();
    };

    componentDidMount() {
        // Todo: Get it to be more center
        this.centerGrid();
    }

    render() {
        return (
            <div style={{
                height: "100%", width: "100%", position: "relative", zIndex: 0,
                pointerEvents: "none"
            }} onWheel={this.handleScroll} ref={this.gridRef} >
                <Grid tickSpacing={20} />
                <BlockLayer />
                <EdgeLayer />
            </div>
        );
    }

    private centerGrid() {
        const tempState = {...this.props};
        tempState.canvas.translation = {
            x: this.gridRef.current?.clientWidth / 2,
            y: this.gridRef.current?.clientHeight / 2
        };
        this.props.onTranslate(tempState.canvas.translation)
    }
}

function mapStateToProps(state: StateType): StateProps {
    return {
        canvas: state.canvas,
        graph: state.graph,
        blockLibrary: state.blockLibrary
    };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
    return bindActionCreators({
        onZoom: ZoomedCanvasAction,
        onTranslate: MovedCanvasAction,
        onMouseAction: MouseAction
    }, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(Canvas)
