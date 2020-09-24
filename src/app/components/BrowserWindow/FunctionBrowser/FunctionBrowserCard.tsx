// @flow
import * as React from 'react';
import {DragSource, DragSourceCollector} from "react-dnd";

import {BlockStorageType} from "../../../../lib/GraphLibrary/types/BlockStorage";

const cardSource = {
    beginDrag(props: { item: any; }) {
        console.log("props type", typeof props);
        return props.item;
    },
    endDrag(props: any, monitor: any, component: any) {
        console.log("props type", typeof props);
        console.log("monitor type", typeof monitor);
        console.log("component type", typeof component);
        return props.handleDrop(props.item.id)
    }
}

function collect(connect: any, monitor: any) {
    return {
        connectDragSource: connect.dragSource(),
        connectDragPreview: connect.dragPreview(),
        isDragging: monitor.isDragging()
    }
}


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


    render() {
        return (
        <div className="card">
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
