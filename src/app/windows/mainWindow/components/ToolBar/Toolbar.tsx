import React, {Component} from 'react';
import {LibraryBrowserButton} from "./ToolBarItems/LibraryBrowser/LibraryBrowserButton";

class Toolbar extends Component {
    render(): React.ReactNode {
        return (
            <div style={{height: "100%", width: "100%", display: "flex", flexFlow: "row nowrap",
                alignItems: "center", paddingLeft: "5px", paddingRight: "5px"}}>
                <LibraryBrowserButton/>
                {/*<ToolbarButton label="Run Simulation"><PlayIcon/></ToolbarButton>*/}
            </div>
        );
    }
}

export default Toolbar;
