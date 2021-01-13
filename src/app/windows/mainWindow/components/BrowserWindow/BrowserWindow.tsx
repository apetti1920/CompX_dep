import * as React from "react";
import {SidebarButtonType, StateType} from "../../../../store/types";
import {connect} from "react-redux";
import FunctionBrowser from "./FunctionBrowser/FunctionBrowser";
import CanvasEdit from "./EditBlock/CanvasEdit";

type StateProps = {
    SidebarButtons: SidebarButtonType[]
}

type State = {
    width: number
}

type Props = StateProps;

class BrowserWindow extends React.Component<Props, State> {
    render() {
        if (this.props.SidebarButtons[0].selected) {
            return (<FunctionBrowser/>)
        } else if (this.props.SidebarButtons[1].selected) {
            return (<CanvasEdit/>)
        }

        return <React.Fragment/>
    }
}

function mapStateToProps(state: StateType): StateProps {
    return {
        SidebarButtons: state.canvas.sidebarButtons.filter(b => b.groupId === 0)
    };
}

export default connect(mapStateToProps)(BrowserWindow);
