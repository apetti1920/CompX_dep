// @flow
import * as React from 'react';

import {Grid} from "./Grid";
import {PointType} from "../types";
import {Clamp, linearInterp} from "../../../helpers/utils";
import Ruler from "./Ruler";
import { ref } from "framework-utils";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from 'redux';
import {MovedCanvasAction, UpdatedGraphAction, ZoomedCanvasAction} from "../../store/actions";
import {StateType} from "../../store/types/stateTypes";
import {CanvasType} from "../../store/types/canvasTypes";
import {MouseCoordinatePosition} from "./MouseCoordinatePosition";
import {BlockStorageType} from "../../../lib/GraphLibrary/types/BlockStorage";
import {BlockVisualType} from "../../../types";
import { v4 as uuidv4 } from 'uuid';
import {GraphVisualType} from "../../store/types/graphTypes";
import {BlockLayer} from "./BlockLayer/Block Layer";

interface StateProps {
    canvasZoom: number,
    canvasTranslation: PointType
    graph: GraphVisualType
}

interface DispatchProps {
    onZoom: (newZoom: number) => void,
    onTranslate: (newTranslation: PointType) => void
    onUpdatedGraph: (newGraph: GraphVisualType) => void
}

type Props = StateProps & DispatchProps

type State = {
    mouseDownOnGrid: boolean,
    mouseDownOnBlock: boolean,
    mouseDownOnPort: boolean,
    isDraggingBlockFromBrowser: boolean,
    mouseWorldCoordinates: PointType,
    zoomLevel: number,
    selectedID?: string
};

//TODO: Fix ruler componet
//TODO: Save last zoom and translation fo grid to redux

class Canvas extends React.Component<Props, State> {
    private readonly gridRef: React.RefObject<HTMLDivElement>;

    constructor(props: Props) {
        super(props);

        this.gridRef = React.createRef()

        this.state = {
            mouseDownOnGrid: false,
            mouseDownOnBlock: false,
            mouseDownOnPort: false,
            isDraggingBlockFromBrowser: false,
            mouseWorldCoordinates: {x: null, y: null},
            zoomLevel: 1,
            selectedID: undefined
        }
    }

    screenToWorld(point: PointType): PointType {
        const gX1 = (point.x - this.props.canvasTranslation.x) / this.props.canvasZoom;
        const gY1 = (point.y - this.props.canvasTranslation.y) / this.props.canvasZoom;
        return {x: gX1, y: gY1}
    }

    handleScroll = (e: React.WheelEvent) => {
        const mouseWorld = this.screenToWorld({x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY});

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

        const tempState = {...this.state};
        tempState.zoomLevel = tempCanvas.zoom;
        tempState.mouseWorldCoordinates = tempCanvas.translation
        this.setState(tempState);

        e.stopPropagation();
    };

    onMouseDownHandlerGrid = (e: React.MouseEvent) => {
        const tempState = {...this.state};
        tempState.mouseDownOnGrid = true;
        tempState.mouseWorldCoordinates =
            this.screenToWorld({x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY});
        this.setState(tempState);
        e.stopPropagation();
        e.preventDefault();
    };

    onMouseUpHandlerGrid = (e: React.MouseEvent) => {
        const tempState = {...this.state};
        tempState.mouseDownOnGrid = false;
        this.setState(tempState);
        e.stopPropagation()
        e.preventDefault()
    };

    onMouseDownHandlerBlock = (e: React.MouseEvent, blockID: string): void => {
        const tempState = {...this.state};
        tempState.mouseWorldCoordinates =
            this.screenToWorld({x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY});
        tempState.mouseDownOnBlock = true;
        tempState.selectedID = blockID;
        this.setState(tempState);
    };

    onMouseUpHandlerBlock = (e: React.MouseEvent): void => {
        const tempState = {...this.state};
        tempState.mouseDownOnBlock = false;
        this.setState(tempState);
    };

    onBlockClickHandler = (e: React.MouseEvent, blockID: string): void => {
        // TODO: Get blocks to stay selected
        const tempState = {...this.state};
        if (blockID === tempState.selectedID) { tempState.selectedID = undefined; }
        else { tempState.selectedID = blockID; }
        this.setState(tempState);
    };

    onMouseDownHandlerPort = (e: React.MouseEvent, output: boolean, blockID: string, ioName: string) => {
        const tempState = {...this.state};
        tempState.mouseDownOnPort = true;
        this.setState(tempState);
        console.log("Mouse Down on Block", blockID, "Port", ioName);

        e.stopPropagation();
        e.preventDefault();
    }

    onMouseUpHandlerPort = (e: React.MouseEvent, output: boolean, blockID: string, ioName: string) => {
        const tempState = {...this.state};
        tempState.mouseDownOnPort = false;
        this.setState(tempState);
        console.log("Mouse Up on Block", blockID, "Port", ioName);

        e.stopPropagation();
        e.preventDefault();
    }

    onMouseMove = (e: React.MouseEvent) => {
        if (this.state.mouseDownOnGrid) {
            const tempProps = {...this.props};
            tempProps.canvasTranslation = {x: tempProps.canvasTranslation.x + e.movementX,
                y: tempProps.canvasTranslation.y + e.movementY}
            this.props.onTranslate(tempProps.canvasTranslation)
        } else if ( this.state.mouseDownOnBlock) {
            const tempProps = {...this.props};
            const tempState = {...this.state};

            tempState.mouseWorldCoordinates =
                this.screenToWorld({x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY});

            const tempBlockIndex = tempProps.graph.blocks.indexOf(tempProps.graph.blocks
                .find(block => block.id === this.state.selectedID));
            tempProps.graph.blocks[tempBlockIndex].position = {
                x: tempState.mouseWorldCoordinates.x - tempProps.graph.blocks[tempBlockIndex].size.x / 2,
                y: tempState.mouseWorldCoordinates.y - tempProps.graph.blocks[tempBlockIndex].size.y / 2
            };
            this.props.onUpdatedGraph(tempProps.graph);
            this.setState(tempState);
        } else if (this.state.mouseDownOnPort) {
            console.log("Dragging Port");
        }

        e.stopPropagation()
        e.preventDefault()
    };

    onDragEnterHandler = (e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        e.stopPropagation();
        // mouse down
    }

    onDragOverHandler = (e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        e.stopPropagation();
    }

    onDragLeaveHandler = (e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        e.stopPropagation();
        // mouse up
    }

    onGridClickHandler = (e: React.MouseEvent): void => {
        const tempState = {...this.state};
        tempState.selectedID = undefined;
        this.setState(tempState);
    }

    onDropHandler = (e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        e.stopPropagation();
        const cardID = e.dataTransfer.getData("cardData");
        const card: BlockStorageType = JSON.parse(cardID);
        const worldPos = this.screenToWorld({x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY});
        const block: BlockVisualType = {id: uuidv4(), position: {x: worldPos.x, y: worldPos.y}, rotation: "0",
            size: {x: 40, y: 30}, blockData: card};
        block.position.x -= block.size.x / 2;
        block.position.y -= block.size.y / 2;
        const tempGraph = {...this.props.graph};
        tempGraph.blocks.push(block);
        this.props.onUpdatedGraph(tempGraph);
        this.forceUpdate();
        console.log(block);
    }

    componentDidMount() {
        // Todo: Get it to be more center
        this.centerGrid();
    }

    render() {
        const cursor = (this.state.mouseDownOnGrid) ? "grabbing" : "grab";

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
                    <div style={{height: "100%", width: "100%", cursor: cursor, position: "relative", zIndex: 0,
                        borderLeft: "calc(var(--border-width)/2) solid var(--custom-accent-color)",
                        borderTop: "calc(var(--border-width)/2) solid var(--custom-accent-color)", pointerEvents: "none"}}
                         onWheel={this.handleScroll}
                         onMouseMove={this.onMouseMove} ref={this.gridRef}
                         onDragEnter={this.onDragEnterHandler} onDragOver={this.onDragOverHandler}
                         onDragLeave={this.onDragLeaveHandler} onDrop={this.onDropHandler}>
                        <Grid minorTickSpacing={8} majorTickSpacing={80} zoom={this.props.canvasZoom}
                              translate={this.props.canvasTranslation} onMouseDown={this.onMouseDownHandlerGrid}
                              onMouseUp={this.onMouseUpHandlerGrid} onClick={this.onGridClickHandler}/>
                        <BlockLayer graph={this.props.graph} translate={this.props.canvasTranslation}
                                    zoom={this.props.canvasZoom} selectedID={this.state.selectedID}
                                    onBlockClickHandler={this.onBlockClickHandler}
                                    onMouseDownHandlerBlock={this.onMouseDownHandlerBlock}
                                    onMouseUpHandlerBlock={this.onMouseUpHandlerBlock}
                                    onMouseDownHandlerPort={this.onMouseDownHandlerPort}
                                    onMouseUpHandlerPort={this.onMouseUpHandlerPort}/>
                        <MouseCoordinatePosition isDragging={this.state.mouseDownOnGrid || this.state.mouseDownOnBlock}
                                                 mousePosition={this.state.mouseWorldCoordinates}
                                                 zoomLevel={this.state.zoomLevel}/>
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
        canvasTranslation: state.canvas.translation,
        graph: state.graph
    };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
    return bindActionCreators({
        onZoom: ZoomedCanvasAction,
        onTranslate: MovedCanvasAction,
        onUpdatedGraph: UpdatedGraphAction
    }, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(Canvas)
