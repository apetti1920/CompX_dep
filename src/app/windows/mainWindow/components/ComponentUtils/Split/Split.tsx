// import React, {Component, ReactNode} from 'react';
// import "./Split.css"
// // eslint-disable-next-line import/no-unresolved
// import CSS from "csstype";
// import {bindActionCreators, Dispatch} from "redux";
// import {MovedSplitPaneAction} from "../../../../../store/actions";
// import {connect} from "react-redux";
// import {SplitPaneName} from "../../../../../store/types";
//
//
// type Direction = "column" | "row";
//
// type OwnProps = {
//     children: {
//         element0: ReactNode,
//         element1: ReactNode
//     }
//     name: SplitPaneName,
//     direction: Direction,
//     firstElementDefault?: string,
//     firstElementMax?: string,
//     firstElementMin?: string
// }
//
// type State = {
//     element0Size: number
//     separatorPosition: (null | number)
// }
//
// type DispatchProps = {
//     move: (name: SplitPaneName, size: number) => void
// }
//
// type Props = OwnProps & DispatchProps;
//
// //TODO: Window resize should resize the second component
//
// class Split extends Component<Props, State> {
//     private readonly element0Ref: React.RefObject<HTMLDivElement>;
//     private readonly currentElementRef: React.RefObject<HTMLDivElement>;
//
//     constructor(props: Props) {
//         super(props);
//
//         Split.checkProp(this.props.firstElementDefault);
//         Split.checkProp(this.props.firstElementMin);
//         Split.checkProp(this.props.firstElementMax);
//
//         this.element0Ref = React.createRef();
//         this.currentElementRef = React.createRef();
//     }
//
//     componentDidMount() {
//         document.addEventListener("mousemove", this.onMouseMove);
//         document.addEventListener("mouseup", this.onMouseUp);
//
//         this.setState({
//             element0Size: this.props.firstElementDefault !== undefined ?
//                 // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
//                 this.getPadding(this.props.firstElementDefault!) : Math.floor(this.getMaxSize() / 2),
//             separatorPosition: null
//         })
//     }
//
//     componentWillUnmount() {
//         document.removeEventListener("mousemove", this.onMouseMove);
//         document.removeEventListener("mouseup", this.onMouseUp);
//     }
//
//     private setSeparatorPosition(position: number | null) {
//         const tempState = {...this.state};
//         tempState.separatorPosition = position;
//         this.setState(tempState);
//     }
//
//     private setElement0Size(size: number) {
//         const tempState = {...this.state};
//         tempState.element0Size = size;
//         this.setState(tempState);
//     }
//
//     private getMaxSize = () => (this.props.direction === "column" ?
//         this.currentElementRef.current?.clientHeight : this.currentElementRef.current?.clientWidth)
//     private static isProp = (prop?: string) => (prop !== null && prop != undefined);
//     private static isPercentage = (prop: string) => (prop.slice(-1) == "%" && !isNaN(+prop.substring(0, prop.length-1)))
//     private static isPixel = (prop: string) => (prop.slice(-2) == "px" && !isNaN(+prop.substring(0, prop.length-2)))
//
//     private static checkProp(prop?: string) {
//         if (Split.isProp(prop)) {
//             // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
//             if (Split.isPercentage(prop!)) {
//                 return
//                 // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
//             } else if (Split.isPixel(prop!)) {
//                 return
//             }
//
//             const err = Error()
//             err.name = "Child Props Error";
//             err.message = "Prop is required to be a string formatted as a percentage or pixel value number";
//
//             throw err;
//         }
//     }
//
//     private getPadding(restraint: string) {
//         let paddingSize: number;
//         if (Split.isPercentage(restraint)) {
//             const pct = +restraint.substring(0, restraint.length - 1);
//             paddingSize = Math.floor(this.getMaxSize() * (pct / 100));
//         } else {
//             paddingSize = +restraint.substring(0, restraint.length - 2);
//         }
//         return paddingSize;
//     }
//
//     onMouseDown = (e: React.MouseEvent) => {
//         this.setSeparatorPosition(this.props.direction === "column" ? e.clientY : e.clientX);
//         e.stopPropagation();
//         e.preventDefault();
//     };
//
//     onMouseMove = (e: MouseEvent) => {
//         if (this.state.separatorPosition === null) { return; }
//
//         const mouse = this.props.direction === "column" ? e.clientY : e.clientX;
//         let newSize = this.state.element0Size + (mouse - this.state.separatorPosition);
//         this.setSeparatorPosition(mouse);
//
//         if (Split.isProp(this.props.firstElementMin)) {
//             // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
//             const paddingMinSize = this.getPadding(this.props.firstElementMin!);
//
//             if (newSize <= paddingMinSize) { newSize = paddingMinSize; }
//         } else {
//             if (newSize <= 5) { newSize = 5; }
//         }
//
//         if (Split.isProp(this.props.firstElementMax)) {
//             // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
//             const paddingMaxSize = this.getPadding(this.props.firstElementMax!);
//
//             if (newSize >= paddingMaxSize) { newSize = paddingMaxSize; }
//         } else {
//             if (newSize >= (this.getMaxSize() - 30)) { newSize = (this.getMaxSize() - 30); }
//         }
//
//         this.setElement0Size(newSize)
//
//         e.stopPropagation()
//         e.preventDefault()
//     };
//
//     onMouseUp = (e: MouseEvent) => {
//         this.props.move(this.props.name, this.state.element0Size)
//         this.setSeparatorPosition(null)
//         e.stopPropagation()
//         e.preventDefault()
//     };
//
//     render() {
//         const cursor = (this.props.direction === "column" ? "row" : "col") + "-resize";
//
//         const tempSize0 = (this.state !== null && this.state.element0Size !== null) ?
//             this.state.element0Size.toString() + "px" : "50%";
//         const element0Style: CSS.Properties = this.props.direction === "column" ?
//             {height: tempSize0, width: "100%"} : {width: tempSize0, height: "100%"}
//         const element1Style: CSS.Properties = this.props.direction === "column" ?
//             {width: "100%"} : {height: "100%"}
//
//         const splitStyle: CSS.Properties = {flexDirection: this.props.direction};
//
//         return (
//             <div className="split-pane" style={splitStyle} ref={this.currentElementRef}>
//                 <div className="split-pane-element0" ref={this.element0Ref} style={element0Style}>
//                     {this.props.children.element0}
//                 </div>
//                 <div className="separator" style={{cursor: cursor}} onMouseDown={this.onMouseDown} />
//                 <div className="split-pane-element1" style={element1Style}>
//                     {this.props.children.element1}
//                 </div>
//             </div>
//         );
//     }
// }
//
// function mapDispatchToProps(dispatch: Dispatch): any {
//     return bindActionCreators({
//         move: MovedSplitPaneAction
//     }, dispatch)
// }
//
// export default connect<never, DispatchProps, OwnProps>(null, mapDispatchToProps)(Split)
