// @flow
import * as React from 'react';
import * as _d3 from "d3";

declare global {
    const d3: typeof _d3;
}
import {PointType} from "../../../../../../shared/types";
import {IpcService} from "../../../../../IPC/IpcService";
import {TEST_SCOPE_CHANNEL} from "../../../../../../shared/Channels";

type d = {
    Date: string,
    Max: number,
    Min: number
}

type Props = {
    translate: PointType,
    zoom: number
};

type State = {
    data: {Date: string, Max: number, Min: number}[]
}

export class TestScope extends React.Component<Props, State> {
    tParser = d3.timeParse("%d/%m/%y")
    xScale = d3.scaleTime().range([35, 160 - 5]);
    yScale = d3.scaleLinear().range([0, 160 / 2]);
    lineGenerator = d3.line();


    constructor(props: Props) {
        super(props);

        this.state = {
            data: []
        }
    }

    componentDidMount(): void {
        const ipc = new IpcService();
        ipc.send<d[]>(TEST_SCOPE_CHANNEL)
            .then(res => {
                const timeDomain = d3.extent(res, d => this.tParser(d.Date));
                const tempMax = d3.max(res, d => d.Max);

                this.xScale.domain(timeDomain);
                this.yScale.domain([0, tempMax]);

                this.lineGenerator.x(b => this.xScale(b[0]));
                this.lineGenerator.y(b => this.xScale(b[1]));
                const highs = this.lineGenerator(res.map((data, ind) => [ind, data.Max]));
                console.log(highs);
            });
    }

    render(): React.ReactNode {
        return (
            <g style={{pointerEvents: "none"}}
               transform={`translate(${this.props.translate.x} ${this.props.translate.y})
                                scale(${this.props.zoom.toString()} ${this.props.zoom.toString()})`}>
                <rect x={0} y={0} width={200} height={200}  style={{ fill: "#123456" }}/>
                <rect x={20} y={20} width={200 - 40} height={200 - 40} style={{ fill: "#eeeeee" }}/>
                <svg x={20} y={20} width={200 - 40} height={200 - 40}>

                </svg>
            </g>
        );
    }
}
