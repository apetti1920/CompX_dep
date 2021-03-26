import React, {Component} from 'react';
import _ from 'lodash';

import Portal from "./Portal";
import {PointType} from "../../../../../shared/types";
import {SetOpacity} from "../../../../utilities";
import theme from "../../../../theme";

type PlacementType = "right" | "bottom" | "left" | "top"

const position = (p: PlacementType) => ({
    current: p,
    negate() {
        if (this.current === "left") return "right"
        if (this.current === "right") return "left"
        if (this.current === "top") return "bottom"
        if (this.current === "bottom") return "top"
    },
    isHorizontal() {
        return this.current === "left" || this.current === "right"
    },
    isVertical() {
        return this.current === "top" || this.current === "bottom"
    }
})

type Props = {
    placement?: PlacementType,
    space?: number,
    disabled?: boolean,
    children: {
        TooltipElement: React.ReactElement,
        MasterObject: React.ReactElement
    }
}

type State = {
    show: boolean
}

class ToolTip extends Component<Props, State> {
    private readonly posRef: React.MutableRefObject<PointType>;
    private readonly tooltipRef: React.MutableRefObject<HTMLHtmlElement|null>;

    public static defaultProps = {
        placement: "right",
        space: 15,
        disabled: false
    }

    constructor(props: Props) {
        super(props);

        this.posRef = React.createRef<PointType>();
        this.posRef.current = {x: 0, y: 0}
        this.tooltipRef = React.createRef<HTMLHtmlElement>();

        this.state = {
            show: false
        }
    }

    getTooltipStyle = (): React.CSSProperties => ({
        position: 'fixed',
        top: `${this.posRef.current.y}px`,
        left: `${this.posRef.current.x}px`,
        zIndex: 99999,
        display: "inline-block",
        opacity: this.state.show ? 1.0 : 0.0
    });
    getPoint = (currentTarget: EventTarget & Element): PointType => {
        const bdys = {
            l: this.props.space,
            t: this.props.space,
            r: document.body.clientWidth + this.tooltipRef.current.clientWidth - this.props.space,
            b: window.innerHeight + this.tooltipRef.current.clientHeight - this.props.space
        }
        const targetRec = currentTarget.getBoundingClientRect();

        let recurCount = 0;
        let recursive: (placement: PlacementType) => PointType
        return (recursive = (): PointType => {
            let pt = {x: 0, y: 0}
            const pos = position(this.props.placement);
            recurCount += 1;

            switch (pos.current) {
                case "bottom": {
                    pt.x = targetRec.left + (targetRec.width - this.tooltipRef.current.offsetWidth) / 2;
                    pt.y = targetRec.bottom + this.props.space;
                    break;
                } case "left": {
                    pt.x = targetRec.left - (this.tooltipRef.current.offsetWidth + this.props.space);
                    pt.y = targetRec.top + (targetRec.height - this.tooltipRef.current.offsetHeight) / 2;
                    break;
                } case "right": {
                    pt.x = targetRec.right + this.props.space;
                    pt.y = targetRec.top + (targetRec.height - this.tooltipRef.current.offsetHeight) / 2;
                    break;
                } case "top": {
                    pt.x = targetRec.left + (targetRec.width - this.tooltipRef.current.offsetWidth) / 2;
                    pt.y = targetRec.top - (targetRec.height + this.props.space);
                    break;
                }
            }

            if ((((pos.isHorizontal()) && (pt.x < bdys.l || pt.x > bdys.r)) ||
                ((pos.isVertical()) && (pt.y < bdys.t || pt.y > bdys.b))) && recurCount < 3)
            {
                pt = recursive(pos.negate());
            }

            if (pt.x < bdys.l) pt.x = bdys.l;
            else if (pt.x > bdys.r) pt.x = bdys.r;
            if (pt.y < bdys.t) pt.y = bdys.t;
            else if (pt.y > bdys.b) pt.y = bdys.b;

            return pt;
        })()
    }

    handleShowToolTip = (e: React.MouseEvent): void => {
        const tempState: State = _.cloneDeep(this.state);
        tempState.show = true;
        this.posRef.current = this.getPoint(e.currentTarget);
        this.setState(tempState);
    }
    handleHideTooltip = (e: React.MouseEvent): void => {
        const tempState: State = _.cloneDeep(this.state);
        tempState.show = false;
        this.setState(tempState);
    }

    render(): React.ReactNode {
        return (
            <React.Fragment>
                {React.cloneElement(this.props.children.MasterObject as React.ReactElement<any>, {
                    onMouseOver: this.handleShowToolTip,
                    onMouseOut: this.handleHideTooltip
                })}
                <Portal>
                    {React.cloneElement(this.props.children.TooltipElement as React.ReactElement<any>, {
                        ref: this.tooltipRef,
                        style: {...this.props.children.TooltipElement.props.style, ...this.getTooltipStyle()}
                    })}
                </Portal>
            </React.Fragment>
        )
    }
}

export default ToolTip;
