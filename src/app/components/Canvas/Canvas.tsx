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
import {BlockLayer} from "./BlockLayer/BlockLayer";
import {EdgeLayer} from "./EdgeLayer/EdgeLayer";

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
    selectedBlockID?: string
    selectedPort?: {blockID: string, portId: string, draggingPortCoords?: {start: PointType, end: PointType}}
    movedGrid: boolean
};

//TODO: Fix ruler componet

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
            selectedBlockID: undefined,
            selectedPort: undefined,
            movedGrid: false
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
        e.preventDefault();
        const tempState = {...this.state};
        tempState.mouseDownOnGrid = true;
        tempState.mouseWorldCoordinates =
            this.screenToWorld({x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY});
        tempState.movedGrid = false;
        this.setState(tempState);
        e.stopPropagation();
    };

    onMouseUpHandlerGrid = (e: React.MouseEvent) => {
        e.preventDefault();
        if (this.state.mouseDownOnGrid) {
            const tempState = {...this.state};
            tempState.mouseDownOnGrid = false;
            if (!tempState.movedGrid) {
                tempState.selectedBlockID = undefined;
            }
            tempState.movedGrid = false;
            this.setState(tempState);
        } else if (this.state.mouseDownOnPort) {
            const tempState = {...this.state};
            tempState.selectedPort = undefined;
            tempState.mouseDownOnPort = false;
            this.setState(tempState);
        }
        e.stopPropagation();
    };

    onMouseDownHandlerBlock = (e: React.MouseEvent, blockID: string): void => {
        e.preventDefault();
        const tempState = {...this.state};
        tempState.mouseWorldCoordinates =
            this.screenToWorld({x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY});
        tempState.mouseDownOnBlock = true;
        tempState.selectedBlockID = blockID;
        this.setState(tempState);
        e.stopPropagation();
    };

    onMouseUpHandlerBlock = (e: React.MouseEvent): void => {
        e.preventDefault();
        if (this.state.mouseDownOnBlock) {
            const tempState = {...this.state};
            tempState.mouseDownOnBlock = false;
            this.setState(tempState);
        } else if (this.state.mouseDownOnPort) {
            const tempState = {...this.state};
            tempState.selectedPort = undefined;
            tempState.mouseDownOnPort = false;
            this.setState(tempState);
        }
        e.stopPropagation();
    };

    getPortCoords(blockID: string, portID: string): PointType {
        const tempGraph = {...this.props.graph};
        const chosenBlock = tempGraph.blocks.find(block => block.id === blockID);

        if (chosenBlock.blockData.outputPorts.map(port => port.name).includes(portID)) {
            const portIndex = chosenBlock.blockData.outputPorts.findIndex(port => port.name === portID);
            return {x: chosenBlock.position.x + chosenBlock.size.x,
                y: chosenBlock.position.y + ((chosenBlock.size.y /
                    (chosenBlock.blockData.outputPorts.length + 1)) * (portIndex + 1))};
        } else {
            const portIndex = chosenBlock.blockData.inputPorts.findIndex(port => port.name === portID);
            return {x: chosenBlock.position.x + chosenBlock.size.x,
                y: chosenBlock.position.y + ((chosenBlock.size.y /
                    (chosenBlock.blockData.inputPorts.length + 1)) * (portIndex + 1))};
        }
    }

    onMouseDownHandlerPort = (e: React.MouseEvent, output: boolean, blockID: string, ioName: string) => {
        e.preventDefault();
        const tempState = {...this.state};
        tempState.mouseDownOnPort = true;
        tempState.selectedPort = {blockID: blockID, portId: ioName,
            draggingPortCoords: {start: this.getPortCoords(blockID, ioName),
                end: this.screenToWorld({x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY})}};
        this.setState(tempState);
        e.stopPropagation();
    }

    onMouseUpHandlerPort = (e: React.MouseEvent, output: boolean, blockID: string, ioName: string) => {
        if (!this.state.mouseDownOnPort) {return;}

        e.preventDefault();
        const tempState = {...this.state};
        tempState.selectedPort = undefined;
        tempState.mouseDownOnPort = false;

        const tempGraph = {...this.props.graph};

        let outputBlock = tempGraph.blocks
            .find(block => block.id === blockID &&
                block.blockData.outputPorts.map(port => port.name).includes(ioName));

        // Check if the mouse up port was input (undefined) or not
        let outputBlockID: string, outputPortID: string, inputBlockID: string, inputPortID: string;
        if (outputBlock === undefined) {
            // mouse down on output mouse up on input
            outputBlock = tempGraph.blocks
                .find(block => block.id === this.state.selectedPort.blockID &&
                    block.blockData.outputPorts.map(port => port.name).includes(this.state.selectedPort.portId));
            if (outputBlock === undefined) {
                this.setState(tempState);
                return;
            }
            outputBlockID = outputBlock.id;
            outputPortID = this.state.selectedPort.portId;
            const inputBlock = tempGraph.blocks
                .find(block => block.id === blockID &&
                    block.blockData.inputPorts.map(port => port.name).includes(ioName));
            if (inputBlock === undefined) {
                this.setState(tempState);
                return;
            }
            inputBlockID = inputBlock.id;
            inputPortID = ioName;
        } else {
            // mouse down on input mouse up on output
            outputBlockID = outputBlock.id;
            outputPortID = ioName;
            const inputBlock = tempGraph.blocks
                .find(block => block.id === this.state.selectedPort.blockID &&
                    block.blockData.inputPorts.map(port => port.name).includes(this.state.selectedPort.portId));
            if (inputBlock === undefined) {
                this.setState(tempState);
                return;
            }
            inputBlockID = inputBlock.id;
            inputPortID = this.state.selectedPort.portId;
        }

        // used for later
        let type: "number";
        switch (outputBlock.blockData.outputPorts
            .find(port => port.name === outputPortID).type) {
            case "number": {
                type = "number"
            }
        }

        // TODO: Don't add if not output to input, if there is an other edge to same input, or if different types
        if (tempGraph.edges.find(edge => edge.outputBlockID === outputBlockID &&
            edge.outputPortID === outputPortID && edge.inputBlockID === inputBlockID &&
            edge.inputPortID === inputPortID) === undefined)
        {
            const edge = {id: uuidv4(), outputBlockID: outputBlockID,
                outputPortID: outputPortID, inputBlockID: inputBlockID,
                inputPortID: inputPortID,
                type: type};
            tempGraph.edges.push(edge);
            this.props.onUpdatedGraph(tempGraph);
        }
        this.setState(tempState);

        e.stopPropagation();
    }

    onMouseMove = (e: React.MouseEvent) => {
        e.preventDefault();
        if (this.state.mouseDownOnGrid) {
            const tempState = {...this.state};
            tempState.movedGrid = true;
            const tempProps = {...this.props};
            tempProps.canvasTranslation = {x: tempProps.canvasTranslation.x + e.movementX,
                y: tempProps.canvasTranslation.y + e.movementY}
            this.props.onTranslate(tempProps.canvasTranslation)
            this.setState(tempState);
        } else if (this.state.mouseDownOnBlock) {
            // TODO: Get blocks to drag on mouse point rather than snapping to center
            const tempProps = {...this.props};
            const tempState = {...this.state};

            tempState.mouseWorldCoordinates =
                this.screenToWorld({x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY});

            const tempBlockIndex = tempProps.graph.blocks.indexOf(tempProps.graph.blocks
                .find(block => block.id === this.state.selectedBlockID));
            tempProps.graph.blocks[tempBlockIndex].position = {
                x: tempState.mouseWorldCoordinates.x - tempProps.graph.blocks[tempBlockIndex].size.x / 2,
                y: tempState.mouseWorldCoordinates.y - tempProps.graph.blocks[tempBlockIndex].size.y / 2
            };
            this.props.onUpdatedGraph(tempProps.graph);
            this.setState(tempState);
        } else if (this.state.mouseDownOnPort) {
            try {
                const tempState = {...this.state};

                const outputBlock = this.props.graph.blocks
                    .find(block => block.id === this.state.selectedPort.blockID &&
                        block.blockData.outputPorts.map(port => port.name).includes(this.state.selectedPort.portId));
                if (outputBlock !== undefined) {
                    const outputPortIndex = outputBlock.blockData.outputPorts
                        .findIndex(port => (port.name === this.state.selectedPort.portId));
                    const outputPortPos = {x: outputBlock.position.x + outputBlock.size.x,
                        y: outputBlock.position.y + ((outputBlock.size.y /
                            (outputBlock.blockData.outputPorts.length + 1)) * (outputPortIndex + 1))};
                    tempState.selectedPort.draggingPortCoords = {start: outputPortPos,
                        end: this.screenToWorld({x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY})};
                } else {
                    const inputBlock = this.props.graph.blocks
                        .find(block => block.id === this.state.selectedPort.blockID);
                    const inputPortIndex = inputBlock.blockData.inputPorts
                        .findIndex(port => (port.name === this.state.selectedPort.portId));
                    const inputPortPos = {x: inputBlock.position.x,
                        y: inputBlock.position.y + ((inputBlock.size.y /
                            (inputBlock.blockData.inputPorts.length + 1)) * (inputPortIndex + 1))};
                    tempState.selectedPort.draggingPortCoords = {
                        start: this.screenToWorld({x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY}),
                        end: inputPortPos};
                }

                this.setState(tempState);
            } catch (e) {
                console.log(e);
                const tempState = {...this.state};
                tempState.selectedPort = undefined;
                tempState.mouseDownOnPort = false;
                this.setState(tempState);
            }
        }

        e.stopPropagation();
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

    // onGridClickHandler = (e: React.MouseEvent): void => {
    //     e.preventDefault();
    //     const tempState = {...this.state};
    //     tempState.selectedBlockID = undefined;
    //     this.setState(tempState);
    //     e.stopPropagation();
    // }

    onDropHandler = (e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        const cardID = e.dataTransfer.getData("cardData");
        const card: BlockStorageType = JSON.parse(cardID);
        const worldPos = this.screenToWorld({x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY});
        const block: BlockVisualType = {id: uuidv4(), position: {x: worldPos.x, y: worldPos.y}, mirrored: false,
            size: {x: 40, y: 30}, blockData: card};
        block.position.x -= block.size.x / 2;
        block.position.y -= block.size.y / 2;
        const tempGraph = {...this.props.graph};
        tempGraph.blocks.push(block);
        this.props.onUpdatedGraph(tempGraph);
        this.forceUpdate();
        e.stopPropagation();
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
                              onMouseUp={this.onMouseUpHandlerGrid}/>
                        <BlockLayer graph={this.props.graph} translate={this.props.canvasTranslation}
                                    zoom={this.props.canvasZoom} selectedID={this.state.selectedBlockID}
                                    onMouseDownHandlerBlock={this.onMouseDownHandlerBlock}
                                    onMouseUpHandlerBlock={this.onMouseUpHandlerBlock}
                                    onMouseDownHandlerPort={this.onMouseDownHandlerPort}
                                    onMouseUpHandlerPort={this.onMouseUpHandlerPort}/>
                        <EdgeLayer graph={this.props.graph} translate={this.props.canvasTranslation}
                                   zoom={this.props.canvasZoom}
                                   draggingPortCoords={this.state.selectedPort?.draggingPortCoords}/>
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
