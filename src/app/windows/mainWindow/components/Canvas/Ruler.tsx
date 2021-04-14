// // @flow
// import * as React from 'react';
// import {CanvasType, StateType} from "../../../../store/types";
// import {connect} from "react-redux";
//
// type ComponentProps = {
//     id: number
//     type: "vertical" | "horizontal",
//     minorTickSpacing: number,
//     majorTickSpacing: number
// };
//
// interface StateProps {
//     canvas: CanvasType
// }
//
// type Props = ComponentProps & StateProps
//
// type State = {
//     componentSizeMain: number
//     componentSizeSecondary: number
// };
//
// type PropsContainer = Props & {
//     componentSizeMain: number
//     componentSizeSecondary: number
// }
//
// class RulerContainer extends React.Component<PropsContainer, never> {
//     constructor(props: PropsContainer) {
//         super(props);
//     }
//
//     render() {
//         const widthSmall = this.props.type === "horizontal" ? this.props.minorTickSpacing.toString() : "100%";
//         const heightSmall = this.props.type === "horizontal" ? "100%" : this.props.minorTickSpacing.toString();
//         const widthLarge = this.props.type === "horizontal" ? this.props.majorTickSpacing.toString() : "100%";
//         const heightLarge = this.props.type === "horizontal" ? "100%" : this.props.majorTickSpacing.toString();
//
//         let patternSmall: string;
//         let patternLarge: string;
//         let translate: string;
//         let scale: string
//
//         if (this.props.type === 'horizontal') {
//             patternSmall = `M 0 ${this.props.componentSizeMain.toString()} L 0 ${(3 * this.props.componentSizeMain / 4).toString()}`;
//             patternLarge = `M 0 ${this.props.componentSizeMain.toString()} L 0 ${(this.props.componentSizeMain / 2).toString()}`;
//             translate = `translate(${this.props.canvas.translation.x} 0)`;
//             scale = `scale(${this.props.canvas.zoom.toString()} 1)`;
//         } else {
//             patternSmall = `M ${this.props.componentSizeMain.toString()} 0 L ${(3 * this.props.componentSizeMain / 4).toString()} 0`;
//             patternLarge = `M ${this.props.componentSizeMain.toString()} 0 L ${(this.props.componentSizeMain / 2).toString()} 0`;
//             translate = `translate(0 ${this.props.canvas.translation.y})`;
//             scale = `scale(1 ${this.props.canvas.zoom.toString()})`;
//         }
//
//         return (
//             <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
//                 <defs>
//                     <pattern id={`smallTicks${this.props.id.toString()}`} width={widthSmall} height={heightSmall} patternUnits="userSpaceOnUse">
//                         <path d={patternSmall} fill="none" stroke="var(--custom-text-color)" strokeWidth="0.5"/>
//                     </pattern>
//                     <pattern id={`largeTicks${this.props.id.toString()}`} width={widthLarge} height={heightLarge} patternUnits="userSpaceOnUse"
//                              patternTransform={translate + " " + scale} >
//                         <rect width={widthLarge} height={heightLarge} fill={`url(#smallTicks${this.props.id.toString()})`}/>
//                         <path d={patternLarge} fill="none" stroke="var(--custom-text-color)" strokeWidth="1"/>
//                     </pattern>
//                 </defs>
//                 <rect width="100%" height="100%" fill={`url(#largeTicks${this.props.id.toString()})`} />
//             </svg>
//         );
//     }
// }
//
// function mapStateToProps(state: StateType): StateProps {
//     return {
//         canvas: state.canvas
//     };
// }
//
// const ConnectedRulerContainer = connect(mapStateToProps, null)(RulerContainer);
//
//
//
// export default class Ruler extends React.Component<ComponentProps, State> {
//     private readonly currentRef: React.RefObject<HTMLDivElement>;
//
//     constructor(props: Props) {
//         super(props);
//
//         this.currentRef = React.createRef()
//         this.state = {
//             componentSizeMain: 0,
//             componentSizeSecondary: 0
//         }
//     }
//
//     componentDidMount(): void {
//         const componentSizeMain = this.props.type === 'vertical' ?
//             this.currentRef.current?.clientWidth : this.currentRef.current?.clientHeight
//         const componentSizeSecondary = this.props.type === 'vertical' ?
//             this.currentRef.current?.clientHeight : this.currentRef.current?.clientWidth
//         const tempState = {...this.state};
//         tempState.componentSizeMain = componentSizeMain;
//         tempState.componentSizeSecondary = componentSizeSecondary
//         this.setState(tempState);
//     }
//
//     render(): React.ReactElement {
//         return (
//             <div style={{width: "100%", height: "100%"}} ref={this.currentRef}>
//                 <ConnectedRulerContainer id={this.props.id} type={this.props.type} minorTickSpacing={this.props.minorTickSpacing}
//                                 majorTickSpacing={this.props.majorTickSpacing}
//                                 componentSizeMain={this.state.componentSizeMain}
//                                 componentSizeSecondary={this.state.componentSizeSecondary} />
//             </div>
//         );
//     }
// }
