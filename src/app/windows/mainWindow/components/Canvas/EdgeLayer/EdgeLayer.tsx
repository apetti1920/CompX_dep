// @flow
import * as React from 'react';
import {CanvasType, GraphVisualType, MouseType, StateType} from "../../../../../store/types";
import {bindActionCreators, Dispatch} from "redux";
import {connect} from "react-redux";
import {VisualPortComponent} from "./VisualPortComponent";
import {AddedEdgeAction, MouseAction} from "../../../../../store/actions";
import {MouseDownType} from "../../types";
import {getPortLineCommand, PortToPoint, ScreenToWorld} from "../../../../../utilities";


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
            console.log("Mouse down on", blockId, portId);
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
            console.log("dragging");
            this.props.onMouseAction({
                mouseDownOn: MouseDownType.PORT,
                currentMouseLocation: ScreenToWorld({x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY},
                    this.props.canvas.translation, this.props.canvas.zoom)
            });
        }
    }

    mouseUpOnPort = (e: React.MouseEvent, blockId: string, portId: string) => {
        if (e.button === 0 && this.props.canvas.mouse.mouseDownOn == MouseDownType.PORT) {
            console.log("Mouse up on", blockId, portId);
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

    mouseUpOnLayer = (e: React.MouseEvent) => {
        if (e.button === 0 && this.props.canvas.mouse.mouseDownOn == MouseDownType.PORT) {
            console.log("Mouse up on grid");
            this.props.onMouseAction({
                mouseDownOn: MouseDownType.NONE,
                currentMouseLocation: ScreenToWorld({x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY},
                    this.props.canvas.translation, this.props.canvas.zoom)
            });
            this.setState({...this.state, draggingFromPort: undefined});
        }
    }

    render(): React.ReactNode {
        let draggingEdge = <React.Fragment/>
        if (this.state.draggingFromPort !== undefined && this.props.canvas.mouse.mouseDownOn === MouseDownType.PORT) {
            draggingEdge = (
                <g style={{pointerEvents: "none"}}
                   transform={`translate(${this.props.canvas.translation.x} ${this.props.canvas.translation.y})
                                scale(${this.props.canvas.zoom.toString()} ${this.props.canvas.zoom.toString()})`}>
                    <path d={getPortLineCommand(PortToPoint(this.state.draggingFromPort.blockId,
                        this.state.draggingFromPort.portId), this.props.canvas.mouse.currentMouseLocation)}
                          stroke="red" fill="none" strokeWidth="1"/>
                </g>
            );
        }

        return (
            <div style={{width: "100%", height: "100%", position: "absolute", zIndex: 3,
                pointerEvents: "none"}}>
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"
                     style={{pointerEvents: this.state.draggingFromPort!==undefined?'auto':'none'}}
                     onMouseMove={this.mouseDragBetweenPorts} onMouseUp={this.mouseUpOnLayer}>
                    {
                        // Draw all ports
                        this.props.graph.blocks.map(b => {
                            return (
                                <VisualPortComponent key={b.id} block={b} zoom={this.props.canvas.zoom}
                                                     translation={this.props.canvas.translation}
                                                     mouseDownPort={this.mouseDownOnPort}
                                                     mouseUpPort={this.mouseUpOnPort}/>
                            )
                        })
                    }

                    {
                        // Draw Dragging Edge
                        draggingEdge
                    }

                    {
                        // Draw all edges
                        this.props.graph.edges.map(e => {
                            return (
                                <g key={e.id} style={{pointerEvents: "none"}}
                                   transform={`translate(${this.props.canvas.translation.x} 
                                   ${this.props.canvas.translation.y}) 
                                   scale(${this.props.canvas.zoom.toString()} 
                                   ${this.props.canvas.zoom.toString()})`}>
                                    <path d={getPortLineCommand(PortToPoint(e.outputBlockVisualID, e.outputPortID),
                                        PortToPoint(e.inputBlockVisualID, e.inputPortID))}
                                          stroke="red" fill="none" strokeWidth="1"/>
                                </g>
                            )
                        })
                    }
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
