// @flow
import * as React from 'react';
import Canvas from "./Canvas";

type Props = unknown;

type State = {
    editMenuOpen: boolean
};

export class CanvasEdit extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            editMenuOpen: false
        }
    }

    openEditMenuHandler = (blockID: string): void => {
        const tmpState = {...this.state};
        console.log(blockID);
        tmpState.editMenuOpen = true;
        this.setState(tmpState);
    }

    render(): React.ReactNode {
        let retNode: React.ReactNode;
        const canvasComponent = <Canvas onOpenEditMenu={this.openEditMenuHandler}/>
        if (this.state.editMenuOpen) {
            retNode =
                <div className="container" style={{display: "flex", height: "100%", width: "100%"}}>
                    <div style={{flexGrow: 1, height: "100%"}}>
                        {canvasComponent}
                    </div>
                    <div style ={{width: "200px", height: "100%", background: "blue"}}>
                        Right Div
                    </div>
                </div>
        } else {
            retNode = canvasComponent;
        }

        return retNode;
    }
}
