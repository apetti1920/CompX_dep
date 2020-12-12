// @flow
import * as React from 'react';
import {CanvasSelectedItemType, GraphVisualType, StateType} from "../../../../../store/types";
import {bindActionCreators, Dispatch} from "redux";
import {
    ClickedSidebarButtonAction,
    MovedCanvasAction,
    UpdatedCanvasSelectionAction,
    UpdatedGraphAction,
    ZoomedCanvasAction
} from "../../../../../store/actions";
import {connect} from "react-redux";
import {BlockStorageType} from "../../../../../../shared/lib/GraphLibrary/types/BlockStorage";
import {CanvasSelectionType} from "../../types";

interface StateProps {
    selectedBlockItems: CanvasSelectedItemType[]
    graph: GraphVisualType
    blockLibrary: BlockStorageType[]
}

interface DispatchProps {
    onUpdatedGraph: (newGraph: GraphVisualType) => void
}

type Props = StateProps & DispatchProps

type State = undefined

export class CanvasEdit extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    render(): React.ReactNode {
        return (
            <div style ={{width: "100%", height: "100%", background: "blue"}}>
                <ul>
                    {this.props.selectedBlockItems.map((item, index) => <li key={index}>{item.id}</li>)}
                </ul>
            </div>
        );
    }
}

function mapStateToProps(state: StateType): StateProps {
    return {
        selectedBlockItems: state.canvas.canvasSelectedItems
            .filter(selected => selected.selectedType === CanvasSelectionType.BLOCK),
        graph: state.graph,
        blockLibrary: state.blockLibrary
    };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
    return bindActionCreators({
        onZoom: ZoomedCanvasAction,
        onTranslate: MovedCanvasAction,
        onUpdatedGraph: UpdatedGraphAction,
        onUpdatedActiveSidebarButton: ClickedSidebarButtonAction,
        onUpdatedCanvasSelectedItems: UpdatedCanvasSelectionAction
    }, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(CanvasEdit)
