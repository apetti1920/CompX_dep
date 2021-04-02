// @flow
import * as React from 'react';
import {bindActionCreators, Dispatch} from "redux";
import {connect} from "react-redux";

import {BlockStorageType} from "../../../../../../../shared/lib/GraphLibrary/types/BlockStorage";
import {DraggingLibraryBlockAction} from "../../../../../../store/actions";

type ComponentProps = {
    data: BlockStorageType
};

interface DispatchProps {
    onIsDragging: (isDragging: boolean) => void
}

type Props = ComponentProps & DispatchProps

type State = {
    imgPath: string
};

class LibraryBrowserCard extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        // TODO: must update image (if from local use ipc otherwise use src)
        this.state = {imgPath: this.props.data.thumbnail};
    }

    onDragStartHandler = (e: React.DragEvent<HTMLDivElement>): void => {
        this.props.onIsDragging(true);
        e.dataTransfer.setData('cardID', this.props.data.id);
    }

    onDragEndHandler = (e: React.DragEvent<HTMLDivElement>): void => {
        this.props.onIsDragging(false);
        e.dataTransfer.clearData()
    }

    render(): React.ReactNode {
        return (
            <div className="card" draggable="true" onDragStart={this.onDragStartHandler} onDragEnd={this.onDragEndHandler}>
                <div style={{
                    width: "40px", height: "50px", display: "flex", flexFlow: "column nowrap", margin: "10px",
                    border: "1px solid #ddd", borderRadius: "4px", backgroundColor: "var(--custom-accent-color)"
                }}>
                    <img style={{width: "100%", height: "75%", userSelect: "none"}} draggable="false"
                         src={this.props.data.thumbnail} alt={this.props.data.name}/>
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

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
    return bindActionCreators({
        onIsDragging: DraggingLibraryBlockAction
    }, dispatch)
}


export default connect(null, mapDispatchToProps)(LibraryBrowserCard)
