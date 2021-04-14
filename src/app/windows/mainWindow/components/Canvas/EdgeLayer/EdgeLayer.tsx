// @flow
import * as React from 'react';
import {CanvasType, GraphVisualType, MouseType, StateType} from "../../../../../store/types";
import {bindActionCreators, Dispatch} from "redux";
import {connect} from "react-redux";
import {VisualPortComponent} from "./VisualPortComponent";
import {AddedEdgeAction, MouseAction} from "../../../../../store/actions";
import {MouseDownType} from "../../types";
import {getPortLineCommand, PortToPoint, ScreenToWorld} from "../../../../../utilities";
import {PointType} from "../../../../../../shared/types";
import VisualEdgeComponent from "./VisualEdgeComponent";


interface StateProps {
    canvas: CanvasType,
    graph: GraphVisualType
}

interface DispatchProps {
    onMouseAction: (newMouse: MouseType) => void,
    onAddedEdgeAction: (block1VisualId: string, port1VisualId: string,
                        block2VisualId: string, port2VisualId: string) => void
}

type Props = StateProps & DispatchProps

type State = {
    draggingFromPort?: {blockId: string, portId: string}
};

class EdgeLayer extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            draggingFromPort: undefined
        }
    }

    mouseDownOnPort = (e: React.MouseEvent, blockId: string, portId: string) => {
        if (e.button === 0 && this.props.canvas.mouse.mouseDownOn == MouseDownType.NONE) {
            const mouseLoc = ScreenToWorld({x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY},
                this.props.canvas.translation, this.props.canvas.zoom);
            this.props.onMouseAction({
                mouseDownOn: MouseDownType.PORT,
                currentMouseLocation: mouseLoc
            });
            this.setState({...this.state, draggingFromPort: {blockId: blockId, portId: portId}});
        }
    }

    mouseDragBetweenPorts = (e: React.MouseEvent) => {
        if (e.button === 0 && this.props.canvas.mouse.mouseDownOn === MouseDownType.PORT ) {
            this.props.onMouseAction({
                mouseDownOn: MouseDownType.PORT,
                currentMouseLocation: ScreenToWorld({x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY},
                    this.props.canvas.translation, this.props.canvas.zoom)
            });
        }
    }

    mouseUpOnPort = (e: React.MouseEvent, blockId: string, portId: string) => {
        if (e.button === 0 && this.props.canvas.mouse.mouseDownOn == MouseDownType.PORT) {
            if (this.state.draggingFromPort !== undefined) {
                this.props.onAddedEdgeAction(this.state.draggingFromPort.blockId, this.state.draggingFromPort.portId,
                    blockId, portId);
                this.props.onMouseAction({
                    mouseDownOn: MouseDownType.NONE,
                    currentMouseLocation: ScreenToWorld({x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY},
                        this.props.canvas.translation, this.props.canvas.zoom)
                });
                this.setState({...this.state, draggingFromPort: undefined});
            }
        }
    }

    mouseUpOnLayer = (e: React.MouseEvent) => {
        if (e.button === 0 && this.props.canvas.mouse.mouseDownOn == MouseDownType.PORT) {
            this.props.onMouseAction({
                mouseDownOn: MouseDownType.NONE,
                currentMouseLocation: ScreenToWorld({x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY},
                    this.props.canvas.translation, this.props.canvas.zoom)
            });
            this.setState({...this.state, draggingFromPort: undefined});
        }
    }

    render(): React.ReactNode {
        let draggingEdge: React.ReactNode = <React.Fragment/>
        if (this.state.draggingFromPort !== undefined && this.props.canvas.mouse.mouseDownOn === MouseDownType.PORT) {
            const p2p = PortToPoint(this.state.draggingFromPort.blockId, this.state.draggingFromPort.portId);
            const curLoc = this.props.canvas.mouse.currentMouseLocation;

            if (p2p !== undefined && curLoc !== undefined) {
                draggingEdge = <VisualEdgeComponent
                    point1={p2p}
                    point2={curLoc}/>
            }
        }

        return (
            <div style={{width: "100%", height: "100%", position: "absolute", zIndex: 3,
                pointerEvents: "none", cursor:this.state.draggingFromPort!==undefined?"crosshair":"grab"}}>
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"
                     style={{pointerEvents: this.state.draggingFromPort!==undefined?'auto':'none'}}
                     onMouseMove={this.mouseDragBetweenPorts} onMouseUp={this.mouseUpOnLayer}>

                    <g style={{pointerEvents: "none"}}
                       transform={`translate(${this.props.canvas.translation.x} ${this.props.canvas.translation.y}) 
                                   scale(${this.props.canvas.zoom.toString()} ${this.props.canvas.zoom.toString()})`}>
                        {   // Draw all ports
                            this.props.graph.blocks.map(b => {
                                return (
                                    <g key={b.id}>
                                        {
                                            b.blockStorage.inputPorts.map(p => {
                                                const keyId = "b_" + b.id + "_" + p.id;
                                                return (
                                                    <VisualPortComponent key={keyId} block={b} portId={p.id} zoom={this.props.canvas.zoom}
                                                                         connectedPorts={this.props.graph.edges
                                                                             .filter(e => e.outputBlockVisualID===b.id ||
                                                                                 e.inputBlockVisualID===b.id)
                                                                             .map(e => [e.outputPortID, e.inputPortID]).flat()}
                                                                         translation={this.props.canvas.translation}
                                                                         mouseDownPort={this.mouseDownOnPort}
                                                                         mouseUpPort={this.mouseUpOnPort}/>
                                                )
                                            })
                                        }
                                        {
                                            b.blockStorage.outputPorts.map(p => {
                                                const keyId = "b_" + b.id + "_" + p.id;
                                                return (
                                                    <VisualPortComponent key={keyId} block={b} portId={p.id} zoom={this.props.canvas.zoom}
                                                                         connectedPorts={this.props.graph.edges
                                                                             .filter(e => e.outputBlockVisualID===b.id ||
                                                                                 e.inputBlockVisualID===b.id)
                                                                             .map(e => [e.outputPortID, e.inputPortID]).flat()}
                                                                         translation={this.props.canvas.translation}
                                                                         mouseDownPort={this.mouseDownOnPort}
                                                                         mouseUpPort={this.mouseUpOnPort}/>
                                                )
                                            })
                                        }
                                    </g>
                                )
                            }) }

                        {   // Draw Dragging Edge
                            draggingEdge }


                        {   // Draw all edges
                            this.props.graph.edges.map(e => {
                                const outputBlock = this.props.graph.blocks.find(b => b.id === e.outputBlockVisualID);
                                if (outputBlock !== undefined) {
                                    const outputPort = outputBlock.blockStorage.outputPorts.find(p => p.id === e.outputPortID);
                                    const inputBlock = this.props.graph.blocks.find(b => b.id === e.inputBlockVisualID);
                                    if (inputBlock !== undefined) {
                                        const inputPort = inputBlock.blockStorage.inputPorts.find(p => p.id === e.inputPortID);
                                        if (inputPort !== undefined && outputPort !== undefined) {
                                            const p2p1 = PortToPoint(outputBlock.id, outputPort.id);
                                            const p2p2 = PortToPoint(inputBlock.id, inputPort.id);
                                            if (p2p1 !== undefined && p2p2 !== undefined) {
                                                return <VisualEdgeComponent key={e.id} point1={p2p1}
                                                                            point2={p2p2}
                                                                            point1BlockMirrored={outputBlock.mirrored}
                                                                            point2BlockMirrored={inputBlock.mirrored} />
                                            }
                                        }
                                    }
                                }

                                return <React.Fragment key={e.id}/>
                            }) }
                    </g>
                </svg>
            </div>
        );
    }
}

function mapStateToProps(state: StateType): StateProps {
    return {
        canvas: state.canvas,
        graph: state.graph
    };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
    return bindActionCreators({
        onMouseAction: MouseAction,
        onAddedEdgeAction: AddedEdgeAction
    }, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(EdgeLayer)
