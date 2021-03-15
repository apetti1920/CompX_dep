import React, {Component} from 'react';
import LibraryItem from "./ToolBarItems/LibraryItem";
import PlayItem from "./ToolBarItems/PlayItem";

class Toolbar extends Component {
    render(): React.ReactNode {
        return (
            <React.Fragment>
                <div style={{float: "left"}}>
                    <LibraryItem color="#f4f6f7"/>
                </div>
                <div style={{float: "right"}}>
                    <PlayItem/>
                </div>
            </React.Fragment>
        );
    }
}

export default Toolbar;
