import React, {Component} from 'react';
// eslint-disable-next-line import/no-unresolved
import CSS from 'csstype';
import LibraryItem from "./ToolBarItems/LibraryItem";

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
            <LibraryItem color="red"/>
        );
    }
}

export default BreadCrumbToolBar;
