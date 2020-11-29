import React, {Component} from 'react';
// eslint-disable-next-line import/no-unresolved
import CSS from 'csstype';
import BreadCrumb from "./BreadCrumb";
import Toolbar from "./Toolbar";

const breadcrumbWrapStyle: CSS.Properties = {
    height: "100%",
    width: "80%",
    float: "left"
};

const toolbarWrapStyle: CSS.Properties = {
    height: "100%",
    marginLeft: "80%"
};

class BreadCrumbToolBar extends Component {
    render(): React.ReactElement {
        return (
            <React.Fragment>
                <div className="breadcrumbWrap" style={breadcrumbWrapStyle} >
                    <BreadCrumb path="compxclient/src/components/BreadCrumbToolBar/BreadCrumbToolBar.tsx" />
                </div>
                <div className="toolbarWrap" style={toolbarWrapStyle} >
                    <Toolbar />
                </div>
            </ React.Fragment>

        );
    }
}

export default BreadCrumbToolBar;
