import React, {Children, Component} from 'react';
import theme from "../../../../theme";

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

import {Library as LibraryIcon} from '@styled-icons/ionicons-sharp/Library';
import {PlayFill as PlayIcon} from '@styled-icons/bootstrap/PlayFill';

type Props = {
    float: "left" | "right" | "none",
    label?: string,
};

export class ToolbarButton extends React.Component<Props, null> {
    ButtonStyle: React.CSSProperties = {
        float: this.props.float,
        marginBottom: "5px",
        marginTop: "5px",
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
            <button style={this.ButtonStyle} onClick={() => console.log("clicked")}>
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
            <div style={{height: "100%", marginLeft: "45px", marginRight: "45px"}}>
                <Tippy content={<span>Tooltip</span>}>
                    <div>
                        <ToolbarButton float="left" label="Library Browser"><LibraryIcon/></ToolbarButton>
                    </div>
                </Tippy>

                <ToolbarButton float="right" label="Run Simulation"><PlayIcon/></ToolbarButton>
            </div>
        );
    }
}

export default Toolbar;
