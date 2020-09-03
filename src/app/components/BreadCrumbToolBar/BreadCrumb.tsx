import React, {Component} from 'react';
// eslint-disable-next-line import/no-unresolved
import CSS from "csstype";

interface IBreadCrumbProps {
    path?: string
}

const textStyle: CSS.Properties = {
    color: "var(--custom-text-color)",
    fontSize: "x-small",
    fontWeight: "bold",
    fontFamily: "var(--custom-font-family)",
    paddingLeft: "4px",
    verticalAlign: "middle",
    transform: "translate(0%, 50%)"
}

class BreadCrumb extends Component<IBreadCrumbProps, never> {
    splitPath(pathName: string): string {
        return  pathName.split("/").join(" > ")
    }

    render(): React.ReactElement {
        const { path } = this.props
        return (
            <React.Fragment>
                <div style={textStyle}>
                    {this.splitPath(path ?? "compxclient")}
                </div>
            </React.Fragment>
        );
    }
}

export default BreadCrumb;
