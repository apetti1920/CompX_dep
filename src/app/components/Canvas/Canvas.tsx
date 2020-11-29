// @flow
import * as React from 'react';

import {Repeat, Delete} from 'react-feather';

import {Grid} from "./Grid";
import {CanvasSelectionType, MouseDown, PointType} from "../types";
import {Clamp, linearInterp} from "../../../electron/utils";
import Ruler from "./Ruler";
import {ref} from "framework-utils";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from 'redux';
import {MovedCanvasAction, UpdatedGraphAction, ZoomedCanvasAction} from "../../store/actions";
import {StateType} from "../../store/types/stateTypes";
import {CanvasType} from "../../store/types/canvasTypes";
import {MouseCoordinatePosition} from "./MouseCoordinatePosition";
import {BlockStorageType} from "../../../shared/lib/GraphLibrary/types/BlockStorage";
import {v4 as uuidv4} from 'uuid';
import {GraphVisualType, BlockVisualType} from "../../store/types/graphTypes";
import {BlockLayer} from "./BlockLayer/BlockLayer";
import {EdgeLayer} from "./EdgeLayer/EdgeLayer";
import {ContextMenu} from "../ComponentUtils/ContextMenu";

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
    mouseDownOn: MouseDown,
    isDraggingBlockFromBrowser: boolean,
    mouseWorldCoordinates: PointType,
    zoomLevel: number,
    selectedItem: {selectedType: CanvasSelectionType, id: string}[],
    selectedPort?: {blockID: string, portID: string},
    movedGrid: boolean,
    contextMenu?: React.ReactNode;
};

//TODO: Fix ruler componet

class Canvas extends React.Component<Props, State> {
    private readonly gridRef: React.RefObject<HTMLDivElement>;

    constructor(props: Props) {
        super(props);

        this.gridRef = React.createRef()

        this.state = {
            mouseDownOn: MouseDown.NONE,
            isDraggingBlockFromBrowser: false,
            mouseWorldCoordinates: {x: null, y: null},
            zoomLevel: 1,
            selectedItem: [],
            selectedPort: undefined,
            movedGrid: false
        }
    }

    /* -------------------------------------------------Utility Functions-------------------------------------------- */
    /* Utility function to convert on screen mouse coordinates to canvas coordinates*/
    screenToWorld(point: PointType): PointType {
        const gX1 = (point.x - this.props.canvasTranslation.x) / this.props.canvasZoom;
        const gY1 = (point.y - this.props.canvasTranslation.y) / this.props.canvasZoom;
        return {x: gX1, y: gY1}
    }

    /* Utility function to get the canvas coordinates of a specific port of a specific block */
    getPortCoords(blockID: string, portID: string): PointType {
        const tempGraph = {...this.props.graph};
        const chosenBlock = tempGraph.blocks.find(block => block.id === blockID);

        if (chosenBlock.getBlock().outputPorts.map(port => port.name).includes(portID)) {
            const portIndex = chosenBlock.getBlock().outputPorts.findIndex(port => port.name === portID);
            return {x: chosenBlock.position.x + chosenBlock.size.x,
                y: chosenBlock.position.y + ((chosenBlock.size.y /
                    (chosenBlock.getBlock().outputPorts.length + 1)) * (portIndex + 1))};
        } else {
            const portIndex = chosenBlock.getBlock().inputPorts.findIndex(port => port.name === portID);
            return {x: chosenBlock.position.x + chosenBlock.size.x,
                y: chosenBlock.position.y + ((chosenBlock.size.y /
                    (chosenBlock.getBlock().inputPorts.length + 1)) * (portIndex + 1))};
        }
    }

    /* --------------------------------------------Handler Overrides------------------------------------------------- */
    /* Overrides the onscroll event of the canvas */
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

    /* Overrides the mouse down event of the Grid */
    onMouseDownHandlerGrid = (e: React.MouseEvent) => {
        e.preventDefault();
        if (e.button === 0) {
            const tempState = {...this.state};
            tempState.mouseWorldCoordinates =
                this.screenToWorld({x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY});
            tempState.mouseDownOn = MouseDown.GRID;
            tempState.contextMenu = undefined;
            this.setState(tempState);
        }
        e.stopPropagation();
    };

    /* Overrides the mouse up event of the Grid */
    onMouseUpHandlerGrid = (e: React.MouseEvent) => {
        e.preventDefault();
        if (e.button === 0) {
            if (this.state.mouseDownOn === MouseDown.GRID) {
                const tempState = {...this.state};
                tempState.mouseDownOn = MouseDown.NONE;
                if (!tempState.movedGrid) {
                    tempState.selectedItem = [];
                }
                tempState.movedGrid = false;
                tempState.mouseWorldCoordinates =
                    this.screenToWorld({x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY});
                this.setState(tempState);
            } else if (this.state.mouseDownOn === MouseDown.PORT) {
                // Finished dragging edge not over another port
                const tempState = {...this.state};
                tempState.selectedPort = undefined;
                tempState.mouseDownOn = MouseDown.NONE;
                tempState.mouseWorldCoordinates =
                    this.screenToWorld({x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY});
                this.setState(tempState);
            }
        }
        e.stopPropagation();
    };

    /* Overrides the mouse down event of a block */
    onMouseDownHandlerBlock = (e: React.MouseEvent, blockID: string): void => {
        e.preventDefault();
        if (e.button === 0) {
            const tempState = {...this.state};
            tempState.mouseWorldCoordinates =
                this.screenToWorld({x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY});
            tempState.mouseDownOn = MouseDown.BLOCK;
            if (!e.shiftKey) {
                tempState.selectedItem = [{selectedType: CanvasSelectionType.BLOCK, id: blockID}]
            } else {
                tempState.selectedItem.push({selectedType: CanvasSelectionType.BLOCK, id: blockID});
            }

            tempState.contextMenu = undefined;
            this.setState(tempState);
        }
        e.stopPropagation();
    };

    /* Overrides the mouse down event of a block */
    onMouseUpHandlerBlock = (e: React.MouseEvent): void => {
        e.preventDefault();
        if (e.button === 0) {
            if (this.state.mouseDownOn === MouseDown.BLOCK) {
                const tempState = {...this.state};
                tempState.mouseDownOn = MouseDown.NONE;
                tempState.mouseWorldCoordinates =
                    this.screenToWorld({x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY});
                this.setState(tempState);
            } else if (this.state.mouseDownOn === MouseDown.PORT) {
                const tempState = {...this.state};
                tempState.selectedPort = undefined;
                tempState.mouseDownOn = MouseDown.NONE;
                tempState.mouseWorldCoordinates =
                    this.screenToWorld({x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY});
                this.setState(tempState);
            }
        }
        e.stopPropagation();
    };

    /* Overrides the mouse down event of an edge */
    onMouseDownHandlerEdge = (e: React.MouseEvent, edgeID: string): void => {
        e.preventDefault();
        if (e.button === 0) {
            const tempState = {...this.state};
            tempState.mouseDownOn = MouseDown.EDGE;
            tempState.selectedItem = [{selectedType: CanvasSelectionType.EDGE, id: edgeID}]
            tempState.contextMenu = undefined;
            tempState.mouseWorldCoordinates =
                this.screenToWorld({x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY});
            this.setState(tempState);
        }
        e.stopPropagation();
    };

    /* Overrides the mouse down event of an edge */
    onMouseUpHandlerEdge = (e: React.MouseEvent): void => {
        e.preventDefault();
        if (e.button === 0) {
            const tempState = {...this.state};
            tempState.mouseDownOn = MouseDown.NONE;
            this.setState(tempState);
        }
        e.stopPropagation();
    };

    /*  */
    onContextMenuBlock = (e: React.MouseEvent, blockID: string): void => {
        e.preventDefault();
        console.log("Right CLicked on block", blockID);
        const tmpState = {...this.state};
        const mir = this.props.graph.blocks.find(block => block.id === blockID).mirrored;
        tmpState.contextMenu = <ContextMenu position={{x: e.nativeEvent.offsetX,
            y: e.nativeEvent.offsetY}} items={[
                    {icon: <Repeat height="100%" style={{flexGrow: 1}}/>, name: !mir?"Mirror":"Un-Mirror", action: ()=>{
                            const tmpState = {...this.state};
                            const tmpProps = {...this.props};
                            const graph = tmpProps.graph;
                            const b = graph.blocks[graph.blocks.findIndex(block => block.id === blockID)];
                            graph.blocks[graph.blocks
                                .findIndex(block => block.id === blockID)].mirrored = !b.mirrored;
                            tmpProps.onUpdatedGraph(graph);
                            tmpState.contextMenu = undefined;
                            this.setState(tmpState);
                        }},
                        {icon: <Delete height="100%" style={{flexGrow: 1}}/>, name: "Delete", action: ()=>{
                                const tmpState = {...this.state};
                                const tmpProps = {...this.props};
                                const graph = tmpProps.graph;

                                const delBlockInd = graph.blocks.findIndex(block => block.id === blockID);
                                const delBlock = graph.blocks[delBlockInd];
                                delBlock.getBlock().outputPorts.forEach(port => {
                                    graph.edges = graph.edges.filter(edge => !(edge.outputBlockVisualID === delBlock.id &&
                                        edge.outputPortID === port.name));
                                })
                                delBlock.getBlock().inputPorts.forEach(port => {
                                    graph.edges = graph.edges.filter(edge => !(edge.inputBlockVisualID === delBlock.id &&
                                        edge.inputPortID === port.name));
                                })
                                graph.blocks = graph.blocks.filter(block => block.id !== blockID);
                                tmpProps.onUpdatedGraph(graph);
                                tmpState.contextMenu = undefined;
                                this.setState(tmpState);
                            }}
                ]}/>;
        this.setState(tmpState);
        e.stopPropagation();
    }

    /* Overrides the mouse down event of a port */
    onMouseDownHandlerPort = (e: React.MouseEvent, output: boolean, blockID: string, ioName: string) => {
        e.preventDefault();
        if (e.button === 0) {
            const tempState = {...this.state};
            tempState.contextMenu = undefined;
            tempState.mouseDownOn = MouseDown.PORT;
            tempState.selectedPort = {blockID: blockID, portID: ioName};
            tempState.mouseWorldCoordinates =
                this.screenToWorld({x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY});
            this.setState(tempState);
        }
        e.stopPropagation();
    }

    /* Overrides the mouse up event of a port */
    onMouseUpHandlerPort = (e: React.MouseEvent, output: boolean, blockID: string, ioName: string) => {
        e.preventDefault();
        if (e.button === 0) {
            if (this.state.mouseDownOn !== MouseDown.PORT) {return;}


            const tempState = {...this.state};
            tempState.selectedPort = undefined;
            tempState.mouseDownOn = MouseDown.NONE;

            const tempGraph = {...this.props.graph};
            let outputBlock = tempGraph.blocks
                .find(block => block.id === blockID &&
                    block.getBlock().outputPorts.map(port => port.name).includes(ioName));

            // Check if the mouse up port was input (undefined) or not
            let outputBlockID: string, outputPortID: string, inputBlockID: string, inputPortID: string;
            if (outputBlock === undefined) {
                // mouse down on output mouse up on input
                outputBlock = tempGraph.blocks
                    .find(block => block.id === this.state.selectedPort.blockID &&
                        block.getBlock().outputPorts.map(port => port.name).includes(this.state.selectedPort.portID));
                if (outputBlock === undefined) {
                    this.setState(tempState);
                    return;
                }
                outputBlockID = outputBlock.id;
                outputPortID = this.state.selectedPort.portID;
                const inputBlock = tempGraph.blocks
                    .find(block => block.id === blockID &&
                        block.getBlock().inputPorts.map(port => port.name).includes(ioName));
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
                        block.getBlock().inputPorts.map(port => port.name).includes(this.state.selectedPort.portID));
                if (inputBlock === undefined) {
                    this.setState(tempState);
                    return;
                }
                inputBlockID = inputBlock.id;
                inputPortID = this.state.selectedPort.portID;
            }

            // used for later
            let type: "number";
            switch (outputBlock.getBlock().outputPorts
                .find(port => port.name === outputPortID).type) {
                case "number": {
                    type = "number"
                }
            }

            // TODO: Don't add if not output to input, if there is an other edge to same input, or if different types
            if (tempGraph.edges.find(edge => edge.outputBlockVisualID === outputBlockID &&
                edge.outputPortID === outputPortID && edge.inputBlockVisualID === inputBlockID &&
                edge.inputPortID === inputPortID) === undefined)
            {
                const edge = {id: uuidv4(), outputBlockVisualID: outputBlockID,
                    outputPortID: outputPortID, inputBlockVisualID: inputBlockID,
                    inputPortID: inputPortID,
                    type: type};
                tempGraph.edges.push(edge);
                this.props.onUpdatedGraph(tempGraph);
            }
            this.setState(tempState);
        }
        e.stopPropagation();
    }

    /* Overrides the mouse move event of the canvas */
    onMouseMove = (e: React.MouseEvent) => {
        e.preventDefault();
        if (this.state.mouseDownOn === MouseDown.GRID) {
            const tempState = {...this.state};
            tempState.movedGrid = true;
            tempState.mouseWorldCoordinates =
                this.screenToWorld({x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY});
            const tempProps = {...this.props};
            tempProps.canvasTranslation = {x: tempProps.canvasTranslation.x + e.movementX,
                y: tempProps.canvasTranslation.y + e.movementY}
            this.props.onTranslate(tempProps.canvasTranslation)
            this.setState(tempState);
        } else if (this.state.mouseDownOn === MouseDown.BLOCK) {
            const tempProps = {...this.props};
            const tempState = {...this.state};

            tempState.mouseWorldCoordinates =
                this.screenToWorld({x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY});
            tempState.movedGrid = false;
            // Just move all the selectedItem blocks
            this.state.selectedItem.filter(selected => selected.selectedType === CanvasSelectionType.BLOCK).map(selectedBlock => {
                const tempBlockIndex = tempProps.graph.blocks.indexOf(tempProps.graph.blocks
                    .find(block => block.id === selectedBlock.id));

                tempProps.graph.blocks[tempBlockIndex].position = {
                    x: tempProps.graph.blocks[tempBlockIndex].position.x + (e.movementX / this.props.canvasZoom),
                    y: tempProps.graph.blocks[tempBlockIndex].position.y + (e.movementY / this.props.canvasZoom)
                };
            });
            this.props.onUpdatedGraph(tempProps.graph);
            this.setState(tempState);
        } else if (this.state.mouseDownOn === MouseDown.PORT) {
            const tempState = {...this.state};
            tempState.mouseWorldCoordinates =
                this.screenToWorld({x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY});
            tempState.movedGrid = false;
            this.setState(tempState);
        }
        e.stopPropagation();
    };

    /* ---------------------------------------Block Dragging from browser-------------------------------------------- */
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

    onDropHandler = (e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        const cardID = e.dataTransfer.getData("cardID");
        const worldPos = this.screenToWorld({x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY});
        const block: BlockVisualType = new BlockVisualType({id: uuidv4(), position: {x: worldPos.x, y: worldPos.y}, mirrored: false,
            size: {x: 40, y: 30}, blockStorageID: cardID});
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
        const cursor = (this.state.mouseDownOn === MouseDown.GRID) ? "grabbing" : "grab";
        let draggingPort: any|undefined;
        if (this.state.selectedPort !== undefined) {
            draggingPort = {beginningPort: this.state.selectedPort, mouseCoords: this.state.mouseWorldCoordinates};
        }

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
                                    zoom={this.props.canvasZoom}
                                    selectedIDs={this.state.selectedItem
                                        .filter(selected => selected.selectedType === CanvasSelectionType.BLOCK)
                                        .map(selectedBlock => selectedBlock.id)}
                                    onMouseDownHandlerBlock={this.onMouseDownHandlerBlock}
                                    onMouseUpHandlerBlock={this.onMouseUpHandlerBlock}
                                    onMouseDownHandlerPort={this.onMouseDownHandlerPort}
                                    onMouseUpHandlerPort={this.onMouseUpHandlerPort}
                                    onContextMenuBlock={this.onContextMenuBlock}/>
                        <EdgeLayer graph={this.props.graph} translate={this.props.canvasTranslation}
                                   zoom={this.props.canvasZoom}
                                   draggingPortCoords={draggingPort}
                                   onMouseDownHandlerEdge={this.onMouseDownHandlerEdge}
                                   onMouseUpHandlerEdge={this.onMouseUpHandlerEdge}
                                   selectedIDs={this.state.selectedItem
                                       .filter(selected => selected.selectedType === CanvasSelectionType.EDGE)
                                       .map(selectedEdge => selectedEdge.id)}/>
                        <MouseCoordinatePosition isDragging={this.state.mouseDownOn === MouseDown.GRID ||
                                                                            this.state.mouseDownOn === MouseDown.BLOCK}
                                                 mousePosition={this.state.mouseWorldCoordinates}
                                                 zoomLevel={this.state.zoomLevel}/>
                        {this.state.contextMenu??React.Fragment}
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
