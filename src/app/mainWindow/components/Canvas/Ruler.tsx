// @flow
import * as React from 'react';
import {PointType} from "../types";

type NumberListType = {
    number: number,
    x: number,
    y: number
}

type PropsContainer = Props & {
    componentSizeMain: number
    componentSizeSecondary: number
}

class RulerContainer extends React.Component<PropsContainer, never> {
    constructor(props: PropsContainer) {
        super(props);
    }

    createNumbers(): NumberListType[] {
        const retValue: NumberListType[] = [];
        let numTicks = Math.ceil((this.props.componentSizeSecondary / this.props.majorTickSpacing) * this.props.zoom);
        if (numTicks > 0) {
            numTicks += 4;
            const tempTrans = this.props.type === "horizontal" ? this.props.translate.x : this.props.translate.y;
            const min = -(Math.floor((tempTrans / this.props.majorTickSpacing))+2) * this.props.majorTickSpacing;
            for (let i=0; i<numTicks; i++) {
                const num = min + i*this.props.majorTickSpacing;
                const widthNum = (num.toString().length-1) * 8;
                const tempYVal = 20;
                const xval = this.props.type === "horizontal" ? num-widthNum : tempYVal;
                const yval = this.props.type === "horizontal" ? tempYVal : num-widthNum;
                retValue.push({number: num, x: xval, y: yval})
            }
        }
        return retValue;
    }

    render() {
        const widthSmall = this.props.type === "horizontal" ? this.props.minorTickSpacing.toString() : "100%";
        const heightSmall = this.props.type === "horizontal" ? "100%" : this.props.minorTickSpacing.toString();
        const widthLarge = this.props.type === "horizontal" ? this.props.majorTickSpacing.toString() : "100%";
        const heightLarge = this.props.type === "horizontal" ? "100%" : this.props.majorTickSpacing.toString();

        let patternSmall: string;
        let patternLarge: string;
        let translate: string;
        let scale: string

        if (this.props.type === 'horizontal') {
            patternSmall = `M 0 ${this.props.componentSizeMain.toString()} L 0 ${(3 * this.props.componentSizeMain / 4).toString()}`;
            patternLarge = `M 0 ${this.props.componentSizeMain.toString()} L 0 ${(this.props.componentSizeMain / 2).toString()}`;
            translate = `translate(${this.props.translate.x} 0)`;
            scale = `scale(${this.props.zoom.toString()} 1)`;
        } else {
            patternSmall = `M ${this.props.componentSizeMain.toString()} 0 L ${(3 * this.props.componentSizeMain / 4).toString()} 0`;
            patternLarge = `M ${this.props.componentSizeMain.toString()} 0 L ${(this.props.componentSizeMain / 2).toString()} 0`;
            translate = `translate(0 ${this.props.translate.y})`;
            scale = `scale(1 ${this.props.zoom.toString()})`;
        }

        return (
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id={`smallTicks${this.props.id.toString()}`} width={widthSmall} height={heightSmall} patternUnits="userSpaceOnUse">
                        <path d={patternSmall} fill="none" stroke="var(--custom-text-color)" strokeWidth="0.5"/>
                    </pattern>
                    <pattern id={`largeTicks${this.props.id.toString()}`} width={widthLarge} height={heightLarge} patternUnits="userSpaceOnUse"
                             patternTransform={translate + " " + scale} >
                        <rect width={widthLarge} height={heightLarge} fill={`url(#smallTicks${this.props.id.toString()})`}/>
                        <path d={patternLarge} fill="none" stroke="var(--custom-text-color)" strokeWidth="1"/>
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill={`url(#largeTicks${this.props.id.toString()})`} />
                {/*{this.createNumbers().map(num => {*/}
                {/*    //TODO: Rotate numbers on vertical ruler*/}
                {/*    //TODO: Move numbers over by how large they are (eg number of charaters)*/}
                {/*    return <text key={num.number} x={num.x} y={num.y}*/}
                {/*                 transform={`${translate} */}
                {/*                 scale(${this.props.zoom.toString()} ${this.props.zoom.toString()}) */}
                {/*                 rotate(${this.props.type === "vertical" ? "-90, " + num.x + ", " + num.y : "0"})`}*/}
                {/*                 fontFamily="var(--custom-font-family)"*/}
                {/*                 fontSize={(8 / this.props.zoom).toString() + "px"}*/}
                {/*                 fill="var(--custom-text-color)" textAnchor="middle"*/}
                {/*    >{num.number}</text>*/}
                {/*})}*/}
            </svg>
        );
    }
}

type Props = {
    id: number
    type: "vertical" | "horizontal",
    minorTickSpacing: number,
    majorTickSpacing: number
    translate: PointType
    zoom: number
};
type State = {
    componentSizeMain: number
    componentSizeSecondary: number
};

export default class Ruler extends React.Component<Props, State> {
    private readonly currentRef: React.RefObject<HTMLDivElement>;

    constructor(props: Props) {
        super(props);

        this.currentRef = React.createRef()
        this.state = {
            componentSizeMain: 0,
            componentSizeSecondary: 0
        }
    }

    componentDidMount(): void {
        const componentSizeMain = this.props.type === 'vertical' ?
            this.currentRef.current?.clientWidth : this.currentRef.current!.clientHeight
        const componentSizeSecondary = this.props.type === 'vertical' ?
            this.currentRef.current?.clientHeight : this.currentRef.current!.clientWidth
        const tempState = {...this.state};
        tempState.componentSizeMain = componentSizeMain;
        tempState.componentSizeSecondary = componentSizeSecondary
        this.setState(tempState);
    }


    render(): React.ReactElement {
        return (
            <div style={{width: "100%", height: "100%"}} ref={this.currentRef}>
                <RulerContainer id={this.props.id} type={this.props.type} minorTickSpacing={this.props.minorTickSpacing}
                                majorTickSpacing={this.props.majorTickSpacing}
                                componentSizeMain={this.state.componentSizeMain}
                                componentSizeSecondary={this.state.componentSizeSecondary}
                                translate={this.props.translate} zoom={this.props.zoom}/>
            </div>
        );
    }

}
