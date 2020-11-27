import React, {Component} from 'react';

interface State {
    clicked: boolean
}

class PlayItem extends Component<unknown, State> {
    constructor(props: unknown) {
        super(props);

        this.state = {
            clicked: false
        }
    }

    render(): React.ReactElement {
        let pathButton;
        if (!this.state.clicked) {
            pathButton = <path
                d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 010 1.393z"/>
        } else {
            pathButton = <path
                d="M5 3.5h6A1.5 1.5 0 0112.5 5v6a1.5 1.5 0 01-1.5 1.5H5A1.5 1.5 0 013.5 11V5A1.5 1.5 0 015 3.5z"/>
        }

        return (
            <svg className="bi bi-play-fill" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor"
                 color={ !this.state.clicked?"#006a4e":"#960018" }
                 xmlns="http://www.w3.org/2000/svg" onClick={() => {
                     const tempState = { ...this.state }
                     tempState.clicked = !tempState.clicked;

                     this.setState(tempState);
            }}>
                {pathButton}
            </svg>
        );
    }
}

export default PlayItem;
