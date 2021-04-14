// @flow
import * as React from 'react';
import {CanvasType, GraphVisualType, StateType} from "../../../../../store/types";
import {ScreenToWorld} from "../../../../../utilities";
import {bindActionCreators, Dispatch} from "redux";
import {
    AddedBlockAction, ChangedContextMenuAction, ChangedModalAction,
    ClickedSidebarButtonAction, DeleteBlockAction,
    MirrorBlockAction,
    ToggleSelectedBlockAction
} from "../../../../../store/actions";
import {connect} from "react-redux";
import {PointType} from "../../../../../../shared/types";
import {BlockStorageType} from "../../../../../../shared/lib/GraphLibrary/types/BlockStorage";
import VisualBlockComponent from "./VisualBlockComponent";
import {ContextMenu} from "../../ComponentUtils/ContextMenu/ContextMenu"

import {Delete as DeleteIcon} from "@styled-icons/feather/Delete";
import {Mirror as MirrorIcon} from "@styled-icons/octicons/Mirror";
import {Edit as EditIcon} from "@styled-icons/boxicons-solid/Edit";
import Modal from "../../ComponentUtils/Modal";
import BlockEditor from "./BlockEditor/BlockEditor";

interface StateProps {
    canvas: CanvasType,
    graph: GraphVisualType,
    blockLibrary: BlockStorageType[]
}

interface DispatchProps {
    onAddedBlock: (blockStorageId: string, position: PointType, size: PointType) => void,
    onDeletedBlock: (blockStorageId: string) => void,
    clickedButton: (buttonGroup: number, buttonId: number) => void,
    onChangeContextMenu: (contextMenu?: React.ReactElement) => void,
    onChangeModal: (modal?: React.ReactElement) => void,
    onToggleBlockSelection: (visualBlockId: string, selected: boolean) => void,
    onMirrorBlock: (visualBlockId: string) => void
}

type Props = StateProps & DispatchProps

type State = {

}

class BlockLayer extends React.Component<Props, State> {
    // TODO: only render blocks and edges 2 screens out
    // TODO: Add curves from redux
    // TODO: Add curve while draggingFromPoint
    // TODO: reject curves for not connecting same type
    // TODO: Color curves depending on type

    onDragEnterHandler = (e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        e.stopPropagation();
    }

    onDragOverHandler = (e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        e.stopPropagation();
    }

    onDragLeaveHandler = (e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        e.stopPropagation();
    }

    onDropHandler = (e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        const cardID = e.dataTransfer.getData("cardID");
        const defaultBlockSize: PointType = {x: 100, y: 100};
        const worldPos = ScreenToWorld({x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY}, this.props.canvas.translation, this.props.canvas.zoom);
        const position: PointType = {
            x: worldPos.x - defaultBlockSize.x / 2.0,
            y: worldPos.y - defaultBlockSize.y / 2.0,
        }
        this.props.onAddedBlock(cardID, position, defaultBlockSize);
        e.stopPropagation();
    }

    onContextMenuBlockHandler = (e: React.MouseEvent, blockID: string): void => {
        e.preventDefault();
        const b1 = this.props.graph.blocks.find(block => block.id === blockID);
        if (b1 === undefined) { return; }
        const mir = b1.mirrored;

        this.props.onToggleBlockSelection(blockID, true);

        const contextMenu = <ContextMenu position={{ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY }} items={[
            {
                icon: <MirrorIcon/>,
                name: !mir ? "Mirror" : "Un-Mirror",
                action: () => {
                    this.props.onMirrorBlock(blockID);
                    this.props.onChangeContextMenu(undefined);
                }
            },
            {
                icon: <EditIcon/>,
                name: "Change Parameters",
                action: () => {
                    const block = this.props.graph.blocks.find(b => b.id === blockID);
                    if (block !== undefined) {
                        this.props.onChangeModal(
                            <Modal>
                                <BlockEditor block={block}/>
                            </Modal>
                        );
                    }
                }
            },
            "Spacer",
            {
                icon: <DeleteIcon/>,
                name: "Delete",
                action: () => {
                    this.props.onDeletedBlock(blockID);
                    this.props.onChangeContextMenu(undefined);
                }
            }
        ]}/>;
        this.props.onChangeContextMenu(contextMenu);
        e.stopPropagation();
    }

    render(): React.ReactNode {
        return (
            <div style={{width: "100%", height: "100%", position: "absolute", zIndex: 2,
                pointerEvents: this.props.canvas.isDraggingFromBlockLibrary?"auto":"none"}}
                 onDragEnter={this.onDragEnterHandler} onDragOver={this.onDragOverHandler}
                 onDragLeave={this.onDragLeaveHandler} onDrop={this.onDropHandler}>
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{pointerEvents: "none"}}>
                    {this.props.graph.blocks.map((block) => {
                        return (
                            <VisualBlockComponent key={block.id} id={block.id} onContextMenu={this.onContextMenuBlockHandler}/>
                        )}
                    )}
                 </svg>
            </div>
        );
    }
}

function mapStateToProps(state: StateType): StateProps {
    return {
        canvas: state.canvas,
        graph: state.graph,
        blockLibrary: state.blockLibrary
    };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
    return bindActionCreators({
        onAddedBlock: AddedBlockAction,
        onDeletedBlock: DeleteBlockAction,
        clickedButton: ClickedSidebarButtonAction,
        onToggleBlockSelection: ToggleSelectedBlockAction,
        onMirrorBlock: MirrorBlockAction,
        onChangeContextMenu: ChangedContextMenuAction,
        onChangeModal: ChangedModalAction
    }, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(BlockLayer)
