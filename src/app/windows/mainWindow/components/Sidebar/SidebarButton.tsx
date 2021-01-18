// @flow
import * as React from 'react';
import {bindActionCreators, Dispatch} from "redux";

import {StateType, SidebarButtonType} from "../../../../store/types";
import {connect} from "react-redux";
import {ClickedSidebarButtonAction} from "../../../../store/actions";

import "./SidebarButtonStylesheet.css";

export interface OwnProps {
    button: SidebarButtonType
}

interface DispatchProps {
    clickedButton: (buttonGroup: number, buttonId: number) => void
}

type Props = DispatchProps & OwnProps

interface State {
    highlighted: boolean
}

class SidebarButton extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = { highlighted: false }
    }

    toggleHover() {
        this.setState((prevState) => {
            return {highlighted: !prevState.highlighted}
        })
    }

    render() {
        let clsNme = "";
        if (this.state.highlighted || this.props.button.selected) {
            clsNme += " Highlighted"

            if (this.props.button.selected) {
                clsNme += " Active"
            }
        }
        //TODO: Center text in div
        return (
            <div className={"Button" + clsNme}
                 onMouseEnter={() => this.toggleHover()}
                 onMouseLeave={() => this.toggleHover()}
                 onClick={() => this.props.clickedButton(this.props.button.groupId, this.props.button.buttonId)}>
                <div className={"ButtonText" + clsNme} style={{userSelect: "none"}}>{this.props.button.text}</div>
            </ div>
        );
    }
}

function matchDispatchToProps(dispatch: Dispatch) {
    return bindActionCreators({
        clickedButton: ClickedSidebarButtonAction
    }, dispatch)
}

export default connect(null, matchDispatchToProps)(SidebarButton);
