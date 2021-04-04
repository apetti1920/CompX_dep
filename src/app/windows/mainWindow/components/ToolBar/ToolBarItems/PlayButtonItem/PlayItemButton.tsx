// @flow
import * as React from 'react';
import theme, {GetGlassStyle} from "../../../../../../theme";
import _ from "lodash";
import {Children} from "react";
import ToolTip from "../../../ComponentUtils/ToolTip";
import {PlayFill as PlayIcon} from "@styled-icons/bootstrap/PlayFill";

type Props = {
    onMouseOver?: (e: React.MouseEvent) => void,
    onMouseOut?: (e: React.MouseEvent) => void,
    onClick?: (e: React.MouseEvent) => void
};

type State = {
    isPlaying: boolean
};

export class PlayItemButton extends React.Component<Props, State> {
    private readonly buttonRef: React.RefObject<HTMLButtonElement>;

    constructor(props: Props) {
        super(props);

        this.buttonRef = React.createRef<HTMLButtonElement>();

        this.state = {
            isPlaying: false
        }
    }

    ButtonStyle: React.CSSProperties = {
        cursor: "pointer",
        outline: "none",
        boxShadow: "none",
        display: "flex",
        flexFlow: "column nowrap",
        justifyContent: "center",
        backgroundColor: "transparent",
        border: "none",
        borderRadius: "5px",
        paddingBottom: "2px"
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
        tempState.isPlaying = !tempState.isPlaying;
        this.setState(tempState);
    }

    render(): React.ReactElement {
        return (
            Children.only(
                <ToolTip placement="bottom">
                    {{
                        MasterObject: (
                            <button ref={this.buttonRef}
                                    style={!this.state.isPlaying?this.ButtonStyle:
                                        {...this.ButtonStyle, ...GetGlassStyle(theme.palette.accent, 0.3)}}
                                    onClick={this.handleClick}>
                                <PlayIcon color={theme.palette.success} size="30px"/>
                            </button>
                        ),
                        TooltipElement: <label style={this.TooltipStyle}>Play</label>
                    }}
                </ToolTip>
            )
        )
    }
}
