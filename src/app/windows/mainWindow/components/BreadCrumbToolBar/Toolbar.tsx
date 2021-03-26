import React, {Children, Component} from 'react';
import theme from "../../../../theme";

import {Library as LibraryIcon} from '@styled-icons/ionicons-sharp/Library';
import {PlayFill as PlayIcon} from '@styled-icons/bootstrap/PlayFill';
import ToolTip from "../ComponentUtils/ToolTip";

type Props = {
    label?: string,
    onMouseOver?: (e: React.MouseEvent) => void,
    onMouseOut?: (e: React.MouseEvent) => void,
};

export class ToolbarButton extends React.Component<Props, null> {
    ButtonStyle: React.CSSProperties = {
        margin: "5px",
        cursor: "pointer",
        outline: "none",
        boxShadow: "none",
        display: "flex",
        flexFlow: "column nowrap",
        justifyContent: "center",
        backgroundColor: "transparent",
        padding: "5px",
        border: "none"
    }

    render(): React.ReactElement {
        return Children.only(
            <button style={this.ButtonStyle} onClick={() => console.log("clicked")}
                    onMouseOver={this.props.onMouseOver} onMouseOut={this.props.onMouseOut}>
                <div style={{width: "100%"}}>
                    {React.cloneElement(this.props.children as React.ReactElement<any>,
                        {color: theme.palette.text, size: "25px"}, null)
                    }
                </div>
                <label
                    style={{width: "100%", pointerEvents: "none", color: theme.palette.text}}>{this.props.label}</label>
            </button>
        )
    }
}

class Toolbar extends Component {
    render(): React.ReactNode {
        return (
            <div style={{height: "100%", width: "100%", display: "flex", flexFlow: "column nowrap", alignItems: "center"}}>
                <ToolTip placement="right">
                    {{
                        MasterObject: <ToolbarButton label="Library Browser"><LibraryIcon/></ToolbarButton>,
                        TooltipElement: <span style={{backgroundColor: "blue"}}>{"Library Browser"}</span>
                    }}
                </ToolTip>
                <ToolbarButton label="Run Simulation"><PlayIcon/></ToolbarButton>
            </div>
        );
    }
}

export default Toolbar;
