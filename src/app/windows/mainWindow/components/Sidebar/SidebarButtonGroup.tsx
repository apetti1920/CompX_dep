import React from 'react';
import {SidebarButtonType} from "../../../../store/types";
import SidebarButton from "./SidebarButton";
// eslint-disable-next-line import/no-unresolved
import CSS from "csstype";


export type justifyType = "flex-start" | "flex-end" | "center"

const sidebarGroupStyle: CSS.Properties = {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%"
}


type Props = {
    sidebarButtons: SidebarButtonType[]
    justify: justifyType
}

const SidebarButtonGroup = (props: Props): React.ReactElement => {
    const style = {...sidebarGroupStyle, justifyContent: props.justify}
    return (
        <div style={style}>
            {props.sidebarButtons.map((button) => {
                const key = "SidebarButton" + button.groupId + "-" + button.buttonId;
                return <SidebarButton key={key} button={button}/>
            })}
        </div>
    );
};

export default SidebarButtonGroup;

