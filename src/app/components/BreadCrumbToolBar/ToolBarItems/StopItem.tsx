import React, {Component} from 'react';

interface IStopItemProps {
    color?: string
}

class StopItem extends Component<IStopItemProps, never> {
    render(): React.ReactElement {
        const { color } = this.props
        return (
            <svg className="bi bi-stop-fill" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" color={color}
                 xmlns="http://www.w3.org/2000/svg">
                <path d="M5 3.5h6A1.5 1.5 0 0112.5 5v6a1.5 1.5 0 01-1.5 1.5H5A1.5 1.5 0 013.5 11V5A1.5 1.5 0 015 3.5z"/>
            </svg>
        );
    }
}

export default StopItem;
