import React, {Component} from 'react';
import {LibraryBrowserButton} from "./ToolBarItems/LibraryBrowserItem/LibraryBrowserButton";
import PlayItemButton from "./ToolBarItems/PlayButtonItem/PlayItemButton";

class Toolbar extends Component {
    render(): React.ReactNode {
        return (
            <div style={{height: "100%", width: "100%", display: "flex", flexFlow: "row nowrap"}}>
                <div style={{height: "100%", flexGrow: 1, display: "flex", justifyContent: "flex-start", marginLeft: "5px"}}>
                    <LibraryBrowserButton/>
                </div>
                <div style={{height: "100%", flexGrow: 1, display: "flex", justifyContent: "flex-end", marginRight: "5px"}}>
                    <PlayItemButton />
                </div>
            </div>
        );
    }
}

export default Toolbar;
