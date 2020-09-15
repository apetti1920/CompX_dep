// @flow
import * as React from 'react';
import {bindActionCreators, Dispatch} from "redux";

import {ActiveSidebarDictionary, SidebarButtonType} from "../../store/types";
import {connect} from "react-redux";
import {ClickedSidebarButtonAction} from "../../store/actions";
import {StateType} from "../../store/types/stateTypes";

import "./SidebarButtonStylesheet.css";

export interface OwnProps {
    button: SidebarButtonType
}

interface StateProps {
    sidebarButtons: SidebarButtonType[]
    activeSidebarButtons: ActiveSidebarDictionary
}

interface DispatchProps {
    clickButton: (sidebarButton: SidebarButtonType) => void
}

type Props = StateProps & DispatchProps & OwnProps

interface State {
    highlighted: boolean
}

class SidebarButton extends React.Component<Props, State> {
    private active: boolean;
    constructor(props: Props) {
        super(props);

        this.active = this.props.activeSidebarButtons[this.props.button.groupId] === this.props.button.buttonId;
        this.state = { highlighted: false }
    }

    toggleHover() {
        this.setState((prevState) => {
            return {highlighted: !prevState.highlighted}
        })
    }

    // eslint-disable-next-line react/no-deprecated
    componentWillReceiveProps(nextProps: Readonly<Props>, nextContext: any) {
        this.active = nextProps.activeSidebarButtons[nextProps.button.groupId] === nextProps.button.buttonId;
    }

    render() {
        let clsNme = "";
        if (this.state.highlighted || this.active) {
            clsNme += " Highlighted"

            if (this.active) {
                clsNme += " Active"
            }
        }
        //TODO: Center text in div
        return (
            <div className={"Button" + clsNme}
                 onMouseEnter={() => this.toggleHover()}
                 onMouseLeave={() => this.toggleHover()}
                 onClick={() => this.props.clickButton(this.props.button)}>
                <div className={"ButtonText" + clsNme} style={{userSelect: "none"}}>{this.props.button.text}</div>
            </ div>
        );
    }
}

function mapStateToProps(state: StateType, ownProps: OwnProps): StateProps {
    return {
        sidebarButtons: state.sidebarButtons,
        activeSidebarButtons: state.activeSidebarButtons
    };
}

function matchDispatchToProps(dispatch: Dispatch) {
    return bindActionCreators({
        clickButton: ClickedSidebarButtonAction
    }, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(SidebarButton);
