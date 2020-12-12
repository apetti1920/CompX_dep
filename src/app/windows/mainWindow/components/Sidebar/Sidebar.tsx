// @flow
import * as React from 'react';
import _ from 'lodash';
import {connect} from "react-redux";

import {StateType, SidebarButtonType} from "../../../../store/types";
import SidebarButtonGroup from "./SidebarButtonGroup";
// eslint-disable-next-line import/no-unresolved
import CSS from "csstype";


const sidebarStyle: CSS.Properties = {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%"
}

type Props = {
    sidebarButtons: SidebarButtonType[]
};

export class Sidebar extends React.Component<Props, never> {
    render(): React.ReactElement {
        const groups = _.groupBy(this.props.sidebarButtons, "groupId");

        return (
            <div style={sidebarStyle}>
                {/*{this.createButtonGroups()}*/}
                <div style={{flex: 1}}>
                    <SidebarButtonGroup sidebarButtons={groups[0]} justify={"flex-start"} />
                </div>
                <div style={{flex: 1}}>
                    <SidebarButtonGroup sidebarButtons={groups[1]} justify={"flex-end"} />
                </div>
            </div>
        );
    }
}

function mapStateToProps(state: StateType) {
    return {
        sidebarButtons: state.canvas.sidebarButtons
    };
}

export default connect(mapStateToProps)(Sidebar);
