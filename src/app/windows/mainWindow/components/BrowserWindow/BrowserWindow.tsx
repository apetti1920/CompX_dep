import * as React from "react";
import {SidebarButtonType} from "../../../../store/types";
import FunctionBrowser from "./FunctionBrowser/FunctionBrowser";
import CanvasEdit from "./EditBlock/CanvasEdit";

type Props = {
    SidebarButtons: SidebarButtonType[]
}

type State = {
    width: number
}

export class BrowserWindow extends React.Component<Props, State> {
    render(): React.ReactNode {
        if (this.props.SidebarButtons[0].selected) {
            return (<FunctionBrowser/>)
        } else if (this.props.SidebarButtons[1].selected) {
            return (<CanvasEdit/>)
        }

        return <React.Fragment/>
    }
}

export default BrowserWindow;
