// @flow
import * as React from 'react';
import {CanvasType, GraphVisualType, StateType} from "../../../../../store/types";
import {bindActionCreators, Dispatch} from "redux";
import {
    AddedBlockAction, ChangedContextMenuAction, ChangedModalAction,
    ClickedSidebarButtonAction,
    DeleteBlockAction, MirrorBlockAction,
    ToggleSelectedBlockAction
} from "../../../../../store/actions";
import {connect} from "react-redux";
import {PointType} from "../../../../../../shared/types";
import {BlockStorageType} from "@compx/sharedtypes";

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

class BlockLayer2 extends React.Component<Props, State> {
    render(): React.ReactElement {
        return (
            <g id="BlockLayer" pointerEvents="none" order={3}>
                <rect width="100px" height="100px" x="50px" y="50px"/>
            </g>
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


export default connect(mapStateToProps, mapDispatchToProps)(BlockLayer2)