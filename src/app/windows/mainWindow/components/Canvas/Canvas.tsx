// @flow
import * as React from 'react';

import {Delete, Repeat, Settings} from 'react-feather';

import Grid from "./Grid";
import {MouseDownType} from "../types";
import {PointType} from "../../../../../shared/types";
import {Clamp, linearInterp} from "../../../../../electron/utils";
import Ruler from "./Ruler";
import {ref} from "framework-utils";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from 'redux';
import {MouseAction, MovedCanvasAction, UpdatedGraphAction, ZoomedCanvasAction} from "../../../../store/actions";
import {BlockVisualType, CanvasType, GraphVisualType, MouseType, StateType} from "../../../../store/types";
import {MouseCoordinatePosition} from "./MouseCoordinatePosition";
import {v4 as uuidv4} from 'uuid';
import {BlockLayer} from "./BlockLayer/BlockLayer";
import {ContextMenu} from "../ComponentUtils/ContextMenu";
import {BlockStorageType} from "../../../../../shared/lib/GraphLibrary/types/BlockStorage";
import {ScreenToWorld} from "../../../../utilities";

const _ = require('lodash');

interface StateProps {
    canvas: CanvasType
    graph: GraphVisualType
    blockLibrary: BlockStorageType[]
}

interface DispatchProps {
    onZoom: (newZoom: number) => void,
    onTranslate: (newTranslation: PointType) => void,
    onUpdatedGraph: (newGraph: GraphVisualType) => void,
    onMouseAction: (newMouse: MouseType) => void
}

type Props = StateProps & DispatchProps

type State = {
    isDraggingBlockFromBrowser: boolean,
    selectedPort?: { blockID: string, portID: string }
    contextMenu?: React.ReactNode;
};

//TODO: Fix ruler componet

class Canvas extends React.Component<Props, State> {
    private readonly gridRef: React.RefObject<HTMLDivElement>;

    constructor(props: Props) {
        super(props);

        this.gridRef = React.createRef();

        this.state = {
            isDraggingBlockFromBrowser: false,
            selectedPort: undefined
        }
    }

    /* -------------------------------------------------Utility Functions-------------------------------------------- */



    // /* Utility function to get the canvas coordinates of a specific port of a specific block */
    // getPortCoords(blockID: string, portID: string): PointType {
    //     const tempGraph: GraphVisualType = _.cloneDeep(this.props.graph);
    //     const chosenBlock = tempGraph.blocks.find(block => block.id === blockID);
    //
    //     if (chosenBlock.blockStorage.outputPorts.map(port => port.name).includes(portID)) {
    //         const portIndex = chosenBlock.blockStorage.outputPorts.findIndex(port => port.name === portID);
    //         return {
    //             x: chosenBlock.position.x + chosenBlock.size.x,
    //             y: chosenBlock.position.y + ((chosenBlock.size.y /
    //                 (chosenBlock.blockStorage.outputPorts.length + 1)) * (portIndex + 1))
    //         };
    //     } else {
    //         const portIndex = chosenBlock.blockStorage.inputPorts.findIndex(port => port.name === portID);
    //         return {
    //             x: chosenBlock.position.x + chosenBlock.size.x,
    //             y: chosenBlock.position.y + ((chosenBlock.size.y /
    //                 (chosenBlock.blockStorage.inputPorts.length + 1)) * (portIndex + 1))
    //         };
    //     }
    // }

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

    /*  */
    // onContextMenuBlock = (e: React.MouseEvent, blockID: string): void => {
    //     e.preventDefault();
    //     const tmpState = {...this.state};
    //     const mir = this.props.graph.blocks.find(block => block.id === blockID).mirrored;
    //     // Select this block
    //     tmpState.contextMenu = <ContextMenu position={{
    //         x: e.nativeEvent.offsetX,
    //         y: e.nativeEvent.offsetY
    //     }} items={[
    //         {
    //             icon: <Settings height="100%" style={{flexGrow: 1}}/>, name: "Edit", action: () => {
    //                 // Open Edit Window
    //                 const tmpState = {...this.state};
    //                 const button = this.props.canvas.sidebarButtons.find(b => b.groupId === 0 && b.buttonId === 1);
    //                 // Update Button Click
    //                 tmpState.contextMenu = undefined;
    //                 this.setState(tmpState);
    //             }
    //         },
    //         {
    //             icon: <Repeat height="100%" style={{flexGrow: 1}}/>,
    //             name: !mir ? "Mirror" : "Un-Mirror",
    //             action: () => {
    //                 const tmpState = {...this.state};
    //                 const tmpProps = {...this.props};
    //                 const graph = tmpProps.graph;
    //                 const b = graph.blocks[graph.blocks.findIndex(block => block.id === blockID)];
    //                 graph.blocks[graph.blocks
    //                     .findIndex(block => block.id === blockID)].mirrored = !b.mirrored;
    //                 tmpProps.onUpdatedGraph(graph);
    //                 tmpState.contextMenu = undefined;
    //                 this.setState(tmpState);
    //             }
    //         },
    //         "Spacer",
    //         {
    //             icon: <Delete height="100%" style={{flexGrow: 1}}/>, name: "Delete", action: () => {
    //                 const tmpState = {...this.state};
    //                 const tmpProps = {...this.props};
    //                 const graph = tmpProps.graph;
    //
    //                 const delBlockInd = graph.blocks.findIndex(block => block.id === blockID);
    //                 const delBlock = graph.blocks[delBlockInd];
    //                 delBlock.blockStorage.outputPorts.forEach(port => {
    //                     graph.edges = graph.edges.filter(edge => !(edge.outputBlockVisualID === delBlock.id &&
    //                         edge.outputPortID === port.name));
    //                 })
    //                 delBlock.blockStorage.inputPorts.forEach(port => {
    //                     graph.edges = graph.edges.filter(edge => !(edge.inputBlockVisualID === delBlock.id &&
    //                         edge.inputPortID === port.name));
    //                 })
    //                 graph.blocks = graph.blocks.filter(block => block.id !== blockID);
    //                 tmpProps.onUpdatedGraph(graph);
    //                 tmpState.contextMenu = undefined;
    //                 this.setState(tmpState);
    //             }
    //         }
    //     ]}/>;
    //     this.setState(tmpState);
    //     e.stopPropagation();
    // }

    // /* Overrides the mouse down event of a port */
    // onMouseDownHandlerPort = (e: React.MouseEvent, output: boolean, blockID: string, ioName: string) => {
    //     e.preventDefault();
    //     if (e.button === 0) {
    //         const tempState: State = _.cloneDeep(this.state);
    //         tempState.contextMenu = undefined;
    //         tempState.selectedPort = {blockID: blockID, portID: ioName};
    //         this.props.onMouseAction({
    //             mouseDownOn: MouseDownType.NONE,
    //             currentMouseLocation: ScreenToWorld({x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY},
    //                 this.props.canvas.translation, this.props.canvas.zoom)
    //         });
    //         this.setState(tempState);
    //     }
    //     e.stopPropagation();
    // }
    //
    // /* Overrides the mouse up event of a port */
    // onMouseUpHandlerPort = (e: React.MouseEvent, output: boolean, blockID: string, ioName: string) => {
    //     e.preventDefault();
    //     if (e.button === 0) {
    //         if (this.props.canvas.mouse.mouseDownOn !== MouseDownType.PORT) {
    //             return;
    //         }
    //
    //         const tempState: State = _.cloneDeep(this.state);
    //         tempState.selectedPort = undefined;
    //         this.props.onMouseAction({
    //             mouseDownOn: MouseDownType.NONE,
    //             currentMouseLocation: ScreenToWorld({x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY},
    //                 this.props.canvas.translation, this.props.canvas.zoom)
    //         });
    //
    //         const tempGraph: GraphVisualType = _.cloneDeep(this.state);
    //         let outputBlock = tempGraph.blocks
    //             .find(block => block.id === blockID &&
    //                 block.blockStorage.outputPorts.map(port => port.name).includes(ioName));
    //
    //         // Check if the mouse up port was input (undefined) or not
    //         let outputBlockID: string, outputPortID: string, inputBlockID: string, inputPortID: string;
    //         if (outputBlock === undefined) {
    //             // mouse down on output mouse up on input
    //             outputBlock = tempGraph.blocks
    //                 .find(block => block.id === this.state.selectedPort.blockID &&
    //                     block.blockStorage.outputPorts.map(port => port.name).includes(this.state.selectedPort.portID));
    //             if (outputBlock === undefined) {
    //                 this.setState(tempState);
    //                 return;
    //             }
    //             outputBlockID = outputBlock.id;
    //             outputPortID = this.state.selectedPort.portID;
    //             const inputBlock = tempGraph.blocks
    //                 .find(block => block.id === blockID &&
    //                     block.blockStorage.inputPorts.map(port => port.name).includes(ioName));
    //             if (inputBlock === undefined) {
    //                 this.setState(tempState);
    //                 return;
    //             }
    //             inputBlockID = inputBlock.id;
    //             inputPortID = ioName;
    //         } else {
    //             // mouse down on input mouse up on output
    //             outputBlockID = outputBlock.id;
    //             outputPortID = ioName;
    //             const inputBlock = tempGraph.blocks
    //                 .find(block => block.id === this.state.selectedPort.blockID &&
    //                     block.blockStorage.inputPorts.map(port => port.name).includes(this.state.selectedPort.portID));
    //             if (inputBlock === undefined) {
    //                 this.setState(tempState);
    //                 return;
    //             }
    //             inputBlockID = inputBlock.id;
    //             inputPortID = this.state.selectedPort.portID;
    //         }
    //
    //         // used for later
    //         let type: "number";
    //         switch (outputBlock.blockStorage.outputPorts
    //             .find(port => port.name === outputPortID).type) {
    //             case "number": {
    //                 type = "number"
    //             }
    //         }
    //
    //         // TODO: Don't add if not output to input, if there is an other edge to same input, or if different types
    //         if (tempGraph.edges.find(edge => edge.outputBlockVisualID === outputBlockID &&
    //             edge.outputPortID === outputPortID && edge.inputBlockVisualID === inputBlockID &&
    //             edge.inputPortID === inputPortID) === undefined) {
    //             const edge = {
    //                 id: uuidv4(), outputBlockVisualID: outputBlockID,
    //                 outputPortID: outputPortID, inputBlockVisualID: inputBlockID,
    //                 inputPortID: inputPortID,
    //                 type: type
    //             };
    //             tempGraph.edges.push(edge);
    //             this.props.onUpdatedGraph(tempGraph);
    //         }
    //         this.setState(tempState);
    //     }
    //     e.stopPropagation();
    // }

    // /* Overrides the mouse move event of the canvas */
    // onMouseMove = (e: React.MouseEvent) => {
    //     e.preventDefault();
    //     if (this.props.canvas.mouse.mouseDownOn === MouseDownType.PORT) {
    //         const tempState: State = _.cloneDeep(this.state);
    //         const tempProps: Props = _.cloneDeep(this.props);
    //         tempProps.canvas.mouse.currentMouseLocation =
    //             ScreenToWorld({x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY}, this.props.canvas.translation, this.props.canvas.zoom)
    //         this.props.onMouseAction(tempProps.canvas.mouse);
    //         tempState.movedGrid = false;
    //         this.setState(tempState);
    //     }
    //     e.stopPropagation();
    // };

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
        const worldPos = ScreenToWorld({x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY}, this.props.canvas.translation, this.props.canvas.zoom);
        const block: BlockVisualType = new BlockVisualType({
            id: uuidv4(), position: {x: worldPos.x, y: worldPos.y}, mirrored: false,
            size: {x: 40, y: 30}, blockStorage: this.props.blockLibrary.find(block => block.id === cardID)
        });
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
        // let draggingPort: any | undefined;
        // if (this.state.selectedPort !== undefined) {
        //     draggingPort = {beginningPort: this.state.selectedPort, mouseCoords: this.props.canvas.mouse.currentMouseLocation};
        // }

        return (
            <div style={{display: "flex", flexDirection: "column", width: "100%", height: "100%"}}>
                <div style={{display: "flex", flexDirection: "row", width: "100%", height: "var(--sidebar-width)"}}>
                    <div style={{
                        width: "var(--sidebar-width)", height: "var(--sidebar-width)",
                        borderRight: "calc(var(--border-width)/2) solid var(--custom-accent-color)",
                        borderBottom: "calc(var(--border-width)/2) solid var(--custom-accent-color)"
                    }} onClick={() => {
                        this.centerGrid();
                    }}/>
                    <div style={{height: "100%", flex: 1}}>
                        <Ruler id={0} type="horizontal" minorTickSpacing={8} majorTickSpacing={80} />
                    </div>
                </div>
                <div style={{display: "flex", flexDirection: "row", width: "100%", flex: 1}}>
                    <div style={{height: "100%", width: "var(--sidebar-width)"}}>
                        <Ruler id={1} type="vertical" minorTickSpacing={8} majorTickSpacing={80} />
                    </div>
                    <div style={{
                        height: "100%", width: "100%", position: "relative", zIndex: 0,
                        borderLeft: "calc(var(--border-width)/2) solid var(--custom-accent-color)",
                        borderTop: "calc(var(--border-width)/2) solid var(--custom-accent-color)", pointerEvents: "none"
                    }}
                         onWheel={this.handleScroll} ref={this.gridRef}
                         onDragEnter={this.onDragEnterHandler} onDragOver={this.onDragOverHandler}
                         onDragLeave={this.onDragLeaveHandler} onDrop={this.onDropHandler}>
                        <Grid minorTickSpacing={8} majorTickSpacing={80} />
                        {/*<BlockLayer graph={this.props.graph}*/}
                        {/*            onMouseDownHandlerPort={this.onMouseDownHandlerPort}*/}
                        {/*            onMouseUpHandlerPort={this.onMouseUpHandlerPort}*/}
                        {/*            onContextMenuBlock={this.onContextMenuBlock} />*/}
                        {/*<EdgeLayer graph={this.props.graph} translate={this.props.canvas.translation}*/}
                        {/*           zoom={this.props.canvas.zoom}*/}
                        {/*           draggingPortCoords={draggingPort}*/}
                        {/*           selectedIDs={this.props.canvas.canvasSelectedItems*/}
                        {/*               .filter(selected => selected.selectedType === CanvasSelectionType.EDGE)*/}
                        {/*               .map(selectedEdge => selectedEdge.id)}/>*/}
                        {/*<MouseCoordinatePosition isDragging={this.props.canvas.mouse.mouseDownOn === MouseDownType.GRID ||*/}
                        {/*this.props.canvas.mouse.mouseDownOn === MouseDownType.BLOCK}*/}
                        {/*                         mousePosition={this.props.canvas.mouse.currentMouseLocation}*/}
                        {/*                         zoomLevel={this.props.canvas.zoom}/>*/}
                        {/*{this.state.contextMenu ?? React.Fragment}*/}
                    </div>
                </div>
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
        onUpdatedGraph: UpdatedGraphAction,
        onMouseAction: MouseAction
    }, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(Canvas)
