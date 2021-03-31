// @flow
import * as React from 'react';

import Portal from "../../../ComponentUtils/Portal"
import {PointType} from "../../../../../../../shared/types";
import theme, {GetGlassStyle} from "../../../../../../theme";

type Props = {
    open: boolean
    location: PointType
};

type State = {

};

export class LibraryBrowser extends React.Component<Props, State> {
    GetLibraryBrowserStyle = (): React.CSSProperties => ({
        width: "300px",
        height: "600px",
        position: 'fixed',
        top: `${this.props.location.y}px`,
        left: `${this.props.location.x}px`,
        zIndex: 99999,
        pointerEvents: this.props.open ? "auto" : "none",
        display: "inline-block",
        opacity: this.props.open ? 1 : 0,
        ...GetGlassStyle(theme.palette.accent, 0.3)
    })

    render(): React.ReactNode {
        return (
            <Portal>
                <div style={this.GetLibraryBrowserStyle()}/>
            </Portal>
        );
    }
}
