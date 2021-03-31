// @flow
import * as React from 'react';

type Props = {
    cards: React.ReactElement[]
};
type State = {
    collapsed: boolean
};

export class Accordion extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            collapsed: true
        }
    }

    getAccordionStyle = (): React.CSSProperties => ({
        width: "100%",
        height: "30px",
        margin: "5px",
        backgroundColor: "blue"
    })

    render(): React.ReactNode {
        return (
            <div style={this.getAccordionStyle()}>

            </div>
        );
    }
}
