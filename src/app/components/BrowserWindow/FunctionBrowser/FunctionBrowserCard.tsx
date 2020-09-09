// @flow
import * as React from 'react';


import {DataType} from "../../types";


type Props = {
    data: DataType
};
type State = {

};

export class FunctionBrowserCard extends React.Component<Props, State> {
    render(): React.ReactElement {
        return (
            <div style={{width: "40px", height: "50px", display: "flex", flexFlow: "column nowrap", margin: "10px",
                border: "1px solid #ddd", borderRadius: "4px", backgroundColor: "var(--custom-accent-color)"}}>
                <img style={{width: "100%", height: "75%", userSelect: "none"}} draggable="false"
                     src={this.props.data.pictureFile}  alt={this.props.data.name} />
                <div style={{width: "100%", fontFamily: "var(--custom-font-family)", fontSize: "8px", userSelect: "none",
                    color: "var(--custom-text-color)", display: "flex", justifyContent: "center", alignItems: "center"}}
                >{this.props.data.name}</div>
            </div>
        );
    }
}