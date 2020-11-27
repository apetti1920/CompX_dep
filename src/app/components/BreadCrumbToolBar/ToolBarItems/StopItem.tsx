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

            </svg>
        );
    }
}

export default StopItem;
