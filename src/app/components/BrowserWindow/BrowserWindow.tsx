import * as React from "react";
import {StateType} from "../../store/types/stateTypes";
import {connect} from "react-redux";
import {FunctionBrowser} from "./FunctionBrowser/FunctionBrowser";

type StateProps = {
    activeSidebarButton: number
}

type State = {
    width: number
}

type Props = StateProps;

class BrowserWindow extends React.Component<Props, State> {
    render() {
        if (this.props.activeSidebarButton !== -1) {
            if (this.props.activeSidebarButton === 0) {
                return (<FunctionBrowser/>)
            }
        }

        return <React.Fragment/>
    }
}

function mapStateToProps(state: StateType): StateProps {
    return {
        activeSidebarButton: state.activeSidebarButtons[0] ?? -1
    };
}

export default connect(mapStateToProps)(BrowserWindow);
