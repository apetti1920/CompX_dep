// @flow
import * as React from 'react';
import {Children} from "react";
import ToolTip from "../../../ComponentUtils/ToolTip";
import theme, {GetGlassStyle} from "../../../../../../theme";
import {Library as LibraryIcon} from "@styled-icons/ionicons-sharp/Library";
import {LibraryBrowser} from "./LibraryBrowser";
import _ from "lodash";

type Props = {
    onMouseOver?: (e: React.MouseEvent) => void,
    onMouseOut?: (e: React.MouseEvent) => void,
    onClick?: (e: React.MouseEvent) => void
};

type State = {
    drawOpen: boolean
};

export class LibraryBrowserButton extends React.Component<Props, State> {
    private readonly buttonRef: React.RefObject<HTMLButtonElement>;

    constructor(props: Props) {
        super(props);

        this.buttonRef = React.createRef<HTMLButtonElement>();

        this.state = {
            drawOpen: false
        }
    }

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
        border: "none",
        borderRadius: "5px"
    }

    TooltipStyle: React.CSSProperties = {
        height: "20px",
        pointerEvents: "none",
        color: theme.palette.text,
        fontSize: "small",
        borderRadius: "4px",
        paddingLeft: "5px",
        paddingRight: "5px",
        ...GetGlassStyle(theme.palette.accent, 0.4)
    }

    handleClick = (e: React.MouseEvent): void => {
        const tempState: State = _.cloneDeep(this.state);
        tempState.drawOpen = !tempState.drawOpen;
        this.setState(tempState);
    }

    render(): React.ReactElement {
        return (
            <React.Fragment>
                {Children.only(
                    <ToolTip placement="bottom" disabled={this.state.drawOpen}>
                        {{
                            MasterObject: (
                                <button ref={this.buttonRef}
                                        style={!this.state.drawOpen?this.ButtonStyle:
                                            {...this.ButtonStyle, ...GetGlassStyle(theme.palette.accent, 0.3)}}
                                        onClick={this.handleClick}>
                                    <LibraryIcon color={theme.palette.text} size="25px"/>
                                </button>
                            ),
                            TooltipElement: <label style={this.TooltipStyle}>Library Browser</label>
                        }}
                    </ToolTip>
                )}
                <LibraryBrowser open={this.state.drawOpen}
                                location={(this.buttonRef.current===null)?{x: 0, y:0}:
                                    {x: this.buttonRef.current.getBoundingClientRect().left,
                                        y: this.buttonRef.current.getBoundingClientRect().bottom}}/>
            </React.Fragment>
    )
    }
}
