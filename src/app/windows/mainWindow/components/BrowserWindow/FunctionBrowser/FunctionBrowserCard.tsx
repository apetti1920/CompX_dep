// @flow
import * as React from 'react';

import {BlockStorageType} from "../../../../../../shared/lib/GraphLibrary/types/BlockStorage";

type Props = {
    data: BlockStorageType
};

type State = {
    imgPath: string
};

class FunctionBrowserCard extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        // TODO: must update image (if from local use ipc otherwise use src)
        this.state = {imgPath: this.props.data.imgFile};
    }

    onDragStartHandler = (e: React.DragEvent<HTMLDivElement>): void => {
        // Should handle the transfer of the data
        e.dataTransfer.setData('cardID', this.props.data.id);
    }

    render(): React.ReactNode {
        return (
        <div className="card" draggable="true" onDragStart={this.onDragStartHandler}>
                <div style={{
                    width: "40px", height: "50px", display: "flex", flexFlow: "column nowrap", margin: "10px",
                    border: "1px solid #ddd", borderRadius: "4px", backgroundColor: "var(--custom-accent-color)"
                }}>
                    <img style={{width: "100%", height: "75%", userSelect: "none"}} draggable="false"
                         src={this.props.data.imgFile} alt={this.props.data.name}/>
                    <div style={{
                        width: "100%",
                        fontFamily: "var(--custom-font-family)",
                        fontSize: "8px",
                        userSelect: "none",
                        color: "var(--custom-text-color)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                    >{this.props.data.name}</div>
                </div>
            </div>
        )
    }
}

export {FunctionBrowserCard}
