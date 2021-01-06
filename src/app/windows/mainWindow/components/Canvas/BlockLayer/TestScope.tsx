// @flow
import * as React from 'react';

import {PointType} from "../../../../../../shared/types";
import {IpcService} from "../../../../../IPC/IpcService";
import {TEST_SCOPE_CHANNEL} from "../../../../../../shared/Channels";
import {dataToLine} from "../../../../../utilities";
import {BlockVisualType} from "../../../../../store/types";

type Props = {
    translate: PointType,
    zoom: number,
    selected: boolean,
    block: BlockVisualType,
    onMouseDownBlock: (e: React.MouseEvent, blockID: string)=>void,
    onMouseUpBlock: (e: React.MouseEvent)=>void,
    onContextMenuBlock: (e: React.MouseEvent, blockID: string)=>void
};

type State = {
    dimensions?: {width: number, height: number},
    highs: string
}

export class TestScope extends React.Component<Props, State> {
    private margin = {top: 10, right: 10, bottom: 10, left: 10};
    private graphDimensions = {width: 200, height: 200};

    constructor(props: Props) {
        super(props);

        this.state = {
            highs: ""
        }
    }

    componentDidMount(): void {
        const ipc = new IpcService();
        ipc.send<number[]>(TEST_SCOPE_CHANNEL)
            .then(res => {
                const width = this.graphDimensions.width - this.margin.left - this.margin.right
                const height = this.graphDimensions.height - this.margin.top - this.margin.bottom

                const tempState = {... this.state};
                tempState.highs = dataToLine({x: this.margin.left, y: this.margin.top},
                    {x: width, y: height}, res.length, res);
                this.setState(tempState);
            });
    }

    render(): React.ReactNode {
        return (
            <g style={{pointerEvents: "none"}}
               transform={`translate(${this.props.translate.x} ${this.props.translate.y})
                            scale(${this.props.zoom.toString()} ${this.props.zoom.toString()})`}>
                <rect x={0} y={0} width={this.graphDimensions.width} height={this.graphDimensions.height}  style={{ fill: "#123456" }}/>
                <rect x={this.margin.left} y={this.margin.top} width={this.graphDimensions.width - this.margin.left - this.margin.right}
                      height={this.graphDimensions.width - this.margin.top - this.margin.bottom} style={{ fill: "#eeeeee" }}/>
                <svg x={this.margin.left} y={this.margin.top} width={this.graphDimensions.width - this.margin.left - this.margin.right}
                     height={this.graphDimensions.height - this.margin.top - this.margin.bottom}>
                    <path d={this.state.highs} fill='none' stroke='red'/>
                </svg>
            </g>
        );
    }
}
