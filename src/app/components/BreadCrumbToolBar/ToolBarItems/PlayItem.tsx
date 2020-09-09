import React, {Component} from 'react';

interface IPlayItemProps {
    color?: string
}

class PlayItem extends Component<IPlayItemProps, never> {
    render(): React.ReactElement {
        const { color } = this.props
        return (
            <svg className="bi bi-play-fill" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" color = { color }
                 xmlns="http://www.w3.org/2000/svg" onClick={() => {
            }}>
                <path
                    d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 010 1.393z"/>
            </svg>
        );
    }
}

export default PlayItem;