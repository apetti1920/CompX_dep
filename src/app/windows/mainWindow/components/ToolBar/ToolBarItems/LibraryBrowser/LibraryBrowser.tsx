// @flow
import * as React from 'react';

import Portal from "../../../ComponentUtils/Portal"
import {PointType} from "../../../../../../../shared/types";
import theme, {GetGlassStyle} from "../../../../../../theme";
import {Accordion} from "./Accordion";

type Props = {
    open: boolean
    location: PointType
};

type State = {

};

export class LibraryBrowser extends React.Component<Props, State> {
    GetLibraryBrowserStyle = (): React.CSSProperties => ({
        width: "300px",
        maxHeight: "600px",
        position: 'fixed',
        top: `${this.props.location.y}px`,
        left: `${this.props.location.x}px`,
        zIndex: 99999,
        pointerEvents: this.props.open ? "auto" : "none",
        display: "inline-block",
        opacity: this.props.open ? 1 : 0,
        padding: "5px",
        ...GetGlassStyle(theme.palette.accent, 0.3)
    })

    render(): React.ReactNode {
        return (
            <Portal>
                <div style={this.GetLibraryBrowserStyle()}>
                    <Accordion data={
                        [
                            {id: 1, name: "Sum", keywords: ["Math", "Frequently Used"]},
                            {id: 2, name: "Integral", keywords: ["Math", "DSP"]},
                            {id: 3, name: "Gain", keywords: ["Math", "Frequently Used", "Temp"]}
                        ]
                    }/>
                </div>
            </Portal>
        );
    }
}
