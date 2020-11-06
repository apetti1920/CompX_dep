// @flow
import * as React from 'react';
import {MenuItemSpacerType} from "../types";

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
                return <hr style={{ borderBottomColor: 'black', borderBottomWidth: 1}} />
            } case "object": {
                switch (typeof this.props.menuItem.action) {
                    case "function": {
                        const bgColor = this.state.hovering?"var(--custom-shadow-color)":"";
                        return (
                            <div style={{display: "flex", flexWrap: "nowrap", height: "20px", backgroundColor: bgColor}}
                                 onMouseOver={()=>{
                                     const tmpState={...this.state};
                                     tmpState.hovering=!tmpState.hovering;
                                     console.log(tmpState);
                                     this.setState(tmpState)}}>
                                {this.props.menuItem.icon}
                                <div style={{height: "100%", display: "flex", justifyContent: "center",
                                    alignItems: "center", textAlign: "center", flexGrow: 3}}
                                     onClick={this.props.menuItem.action}>{this.props.menuItem.name}</div>
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
