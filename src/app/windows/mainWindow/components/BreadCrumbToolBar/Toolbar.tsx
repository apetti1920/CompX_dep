import React, {Component} from 'react';
import PlayItem from "./ToolBarItems/PlayItem";

class Toolbar extends Component {
    render(): React.ReactNode {
        return (
            <div style={{float: "right"}}>
                <PlayItem />
            </div>
        );
    }
}

export default Toolbar;
