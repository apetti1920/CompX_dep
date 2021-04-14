// import React, {Component} from 'react';
// import _ from 'lodash';
//
// import Portal from "./Portal";
// import {PointType} from "../../../../../shared/types";
// import theme from "../../../../theme";
//
// type PlacementType = "right" | "bottom" | "left" | "top"
//
// const position = (p: PlacementType) => ({
//     current: p,
//     negate() {
//         if (this.current === "left") return "right"
//         if (this.current === "right") return "left"
//         if (this.current === "top") return "bottom"
//         if (this.current === "bottom") return "top"
//     },
//     isHorizontal() {
//         return this.current === "left" || this.current === "right"
//     },
//     isVertical() {
//         return this.current === "top" || this.current === "bottom"
//     }
// })
//
// type Props = {
//     placement?: PlacementType,
//     space?: number,
//     disabled?: boolean,
//     clickEvent?: boolean,
//     children: {
//         TooltipElement: React.ReactElement,
//         MasterObject: React.ReactElement
//     }
// }
//
// type State = {
//     hoverButton: boolean,
//     hoverTooltip: boolean,
//     hoverTimout?: ReturnType<typeof setTimeout>
// }
//
// class ToolTip extends Component<Props, State> {
//     private readonly posRef: React.MutableRefObject<PointType>;
//     private readonly tooltipRef: React.MutableRefObject<HTMLElement>;
//
//     public static defaultProps = {
//         placement: "right",
//         space: 0,
//         disabled: false,
//         clickEvent: false
//     }
//
//     constructor(props: Props) {
//         super(props);
//
//         this.posRef = React.createRef<PointType>();
//         this.posRef.current = {x: 0, y: 0}
//         this.tooltipRef = React.createRef<HTMLElement>();
//
//         this.state = {
//             hoverButton: false,
//             hoverTooltip: false
//         }
//     }
//
//     isOpen = (): boolean => (this.state.hoverButton || this.state.hoverTooltip) && !this.props.disabled
//
//     getTooltipStyle = (): React.CSSProperties => ({
//         position: 'fixed',
//         top: `${this.posRef.current.y}px`,
//         left: `${this.posRef.current.x}px`,
//         zIndex: 99999,
//         pointerEvents: this.isOpen() ? "auto" : "none",
//         display: "inline-block",
//         opacity: this.isOpen() ? 1.0 : 0.0
//     });
//
//     getPoint = (currentTarget: EventTarget & Element): PointType => {
//         const bdys = {
//             l: this.props.space,
//             t: this.props.space + theme.spacing.titlebarHeight + theme.spacing.toolbarHeight,
//             r: document.body.clientWidth + this.tooltipRef.current.clientWidth - this.props.space,
//             b: window.innerHeight + this.tooltipRef.current.clientHeight - this.props.space
//         }
//         const targetRec = currentTarget.getBoundingClientRect();
//
//         let recurCount = 0;
//         let recursive: (placement: PlacementType) => PointType
//         return (recursive = (): PointType => {
//             let pt = {x: 0, y: 0}
//             const pos = position(this.props.placement);
//             recurCount += 1;
//
//             switch (pos.current) {
//                 case "bottom": {
//                     pt.x = targetRec.left + (targetRec.width - this.tooltipRef.current.offsetWidth) / 2;
//                     pt.y = targetRec.bottom + this.props.space;
//                     break;
//                 } case "left": {
//                     pt.x = targetRec.left - (this.tooltipRef.current.offsetWidth + this.props.space);
//                     pt.y = targetRec.top + (targetRec.height - this.tooltipRef.current.offsetHeight) / 2;
//                     break;
//                 } case "right": {
//                     pt.x = targetRec.right + this.props.space;
//                     pt.y = targetRec.top + (targetRec.height - this.tooltipRef.current.offsetHeight) / 2;
//                     break;
//                 } case "top": {
//                     pt.x = targetRec.left + (targetRec.width - this.tooltipRef.current.offsetWidth) / 2;
//                     pt.y = targetRec.top - (targetRec.height + this.props.space);
//                     break;
//                 }
//             }
//
//             if ((((pos.isHorizontal()) && (pt.x < bdys.l || pt.x > bdys.r)) ||
//                 ((pos.isVertical()) && (pt.y < bdys.t || pt.y > bdys.b))) && recurCount < 3)
//             {
//                 pt = recursive(pos.negate());
//             }
//
//             if (pt.x < bdys.l) pt.x = bdys.l;
//             else if (pt.x > bdys.r) pt.x = bdys.r;
//             if (pt.y < bdys.t) pt.y = bdys.t;
//             else if (pt.y > bdys.b) pt.y = bdys.b;
//
//             return pt;
//         })()
//     }
//
//     handleShowHoverButton = (e: React.MouseEvent): void => {
//         const tempState: State = _.cloneDeep(this.state);
//         this.posRef.current = this.getPoint(e.currentTarget);
//         tempState.hoverTimout = setTimeout(()=> {
//             const tempState: State = _.cloneDeep(this.state);
//             tempState.hoverButton = true;
//             this.setState(tempState);
//         }, 700);
//         this.setState(tempState);
//     }
//
//     handleHideUnHoverButton = (e: React.MouseEvent): void => {
//         const tempState: State = _.cloneDeep(this.state);
//         tempState.hoverButton = false;
//         if (tempState.hoverTimout !== undefined) {
//             clearTimeout(tempState.hoverTimout);
//             tempState.hoverTimout = undefined
//         }
//         this.setState(tempState);
//     }
//
//     handleShowToolTipTooltip = (e: React.MouseEvent): void => {
//         const tempState: State = _.cloneDeep(this.state);
//         tempState.hoverTooltip = true;
//         this.setState(tempState);
//     }
//
//     handleHideTooltipTooltip = (e: React.MouseEvent): void => {
//         const tempState: State = _.cloneDeep(this.state);
//         tempState.hoverTooltip = false;
//         this.setState(tempState);
//     }
//
//     render(): React.ReactNode {
//         const buttonElement = React.cloneElement(this.props.children.MasterObject as React.ReactElement<any>, {
//             onMouseOver: (e: React.MouseEvent)=>{
//                 this.handleShowHoverButton(e)
//                 if (this.props.children.MasterObject.props.onMouseOver !== undefined) {
//                     this.props.children.MasterObject.props.onMouseOver(e)
//                 }
//             },
//             onMouseOut: (e: React.MouseEvent)=>{
//                 this.handleHideUnHoverButton(e)
//                 if (this.props.children.MasterObject.props.onMouseOut !== undefined) {
//                     this.props.children.MasterObject.props.onMouseOut(e)
//                 }
//             },
//             onClick: (e: React.MouseEvent)=>{
//                 this.handleHideUnHoverButton(e)
//                 if (this.props.children.MasterObject.props.onClick !== undefined) {
//                     this.props.children.MasterObject.props.onClick(e)
//                 }
//             }
//         });
//
//         return (
//             <React.Fragment>
//                 {buttonElement}
//                 <Portal>
//                     {React.cloneElement(this.props.children.TooltipElement as React.ReactElement<any>, {
//                         ref: this.tooltipRef,
//                         style: {...this.props.children.TooltipElement.props.style, ...this.getTooltipStyle()}
//                     })}
//                 </Portal>
//             </React.Fragment>
//         )
//     }
// }
//
// export default ToolTip;
