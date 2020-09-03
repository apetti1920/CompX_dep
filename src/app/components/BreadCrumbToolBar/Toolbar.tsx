import React, {Component} from 'react';
import PlayItem from "./ToolBarItems/PlayItem";
import StopItem from "./ToolBarItems/StopItem";

class Toolbar extends Component {
    render() {
        return (
            <div style={{float: "right"}}>
                <PlayItem color='var(--custom-text-color)'/>
                <StopItem color='var(--custom-text-color)'/>
            </div>
        );
    }
}

export default Toolbar;
