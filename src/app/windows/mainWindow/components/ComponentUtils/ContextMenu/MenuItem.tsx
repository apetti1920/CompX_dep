// @flow
import * as React from 'react';
import {MenuItemSpacerType} from "../../types";
import theme, {GetGlassStyle} from "../../../../../theme";
import {SetOpacity} from "../../../../../utilities";

type Props = {
    menuItem: MenuItemSpacerType
};
type State = {
    hovering: boolean
};

export class MenuItem extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            hovering: false
        }
    }

    // TODO: Not recognizing mouse events separate from underlying element
    render(): React.ReactNode {
        switch (typeof this.props.menuItem) {
            case "string" : {
                return <hr style={{ borderBottomColor: theme.palette.text, borderBottomWidth: 1}} />
            } case "object": {
                switch (typeof this.props.menuItem.action) {
                    case "function": {
                        const bgColor = this.state.hovering?GetGlassStyle(theme.palette.shadow, 0.5):"";
                        const textColor = this.state.hovering?theme.palette.background:theme.palette.text;
                        const pointer = this.state.hovering?"pointer":""
                        return (
                            <div style={{display: "flex", flexWrap: "nowrap", height: "20px",
                                cursor: pointer, ...bgColor}}
                                 onMouseEnter={()=>{
                                     const tmpState={...this.state};
                                     tmpState.hovering=true;
                                     this.setState(tmpState)}}
                                 onMouseLeave={()=>{
                                     const tmpState={...this.state};
                                     tmpState.hovering=false;
                                     this.setState(tmpState)}}
                                 onClick={this.props.menuItem.action}>
                                {this.props.menuItem.icon===undefined?<React.Fragment/>:
                                    React.cloneElement(this.props.menuItem.icon, {style: {
                                        height: "100%", width: "25px"
                                    }, color: textColor})}
                                <div style={{height: "100%", flexGrow: 1, textAlign: "center"}}>
                                    <h1 style={{fontSize: "1vw", color: textColor}}>{this.props.menuItem.name}</h1>
                                </div>
                            </div>
                        )
                    } case "object": {
                        break;
                    }
                }
            }
        }
    }
}
