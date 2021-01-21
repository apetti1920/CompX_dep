// @flow
import * as React from 'react';
import {PointType} from "../../../../../../shared/types";
import {BlockVisualType, EdgeVisualType, StateType} from "../../../../../store/types";
import {connect} from "react-redux";

interface StateProps {
    zoom: number,
    translate: PointType,
    blocks: BlockVisualType[]
}

type ComponentProps = {
    point1: PointType,
    point2: PointType,
    point1BlockMirrored?: boolean,
    point2BlockMirrored?: boolean
};

type Props = StateProps & ComponentProps

type State = never;

class VisualEdgeComponent extends React.Component<Props, State> {
    getPath(): string {
        //if ((this.props.point1BlockMirrored === undefined && this.props.point2BlockMirrored === undefined)) { //} ||
            //(!this.props.point1BlockMirrored && !this.props.point2BlockMirrored)) {
        if (this.props.point1.x < this.props.point2.x) {
            const halfX = (this.props.point1.x + this.props.point2.x) / 2.0;
            return `M ${this.props.point1.x} ${this.props.point1.y} H ${halfX} V ${this.props.point2.y} H ${this.props.point2.x}`;
        } else {
            const dist = 8.0;
            const halfY = (this.props.point2.y - this.props.point1.y) / 2.0;
            return `M ${this.props.point1.x} ${this.props.point1.y} h ${dist} v ${halfY} h ${(this.props.point2.x - this.props.point1.x) - 2 * dist} v ${halfY} h ${dist}`;
        }
        // } else if (this.props.point1BlockMirrored !== undefined && this.props.point2BlockMirrored !== undefined) {
        //
        // } else {
        //     console.log("here2");
        //     return "";
        // }
    }

    render(): React.ReactNode {
        const path = this.getPath();
        return (
            <path d={path} fill="transparent" stroke="red"/>
        );
    }
}

function mapStateToProps(state: StateType): StateProps {
    return {
        zoom: state.canvas.zoom,
        translate: state.canvas.translation,
        blocks: state.graph.blocks
    };
}


export default connect(mapStateToProps, {})(VisualEdgeComponent)
