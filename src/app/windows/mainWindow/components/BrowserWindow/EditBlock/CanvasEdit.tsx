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
import {ChangeEvent} from "react";

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
        const tempGraph = {...this.props.graph};

        return (
            <div style ={{width: "100%", height: "100%", background: "var(--custom-background-color)", color: "var(--custom-text-color)"}}>
                <ul>
                    {this.props.selectedBlockItems.map((item, index) => {
                        const blockIndex = tempGraph.blocks.findIndex(block => block.id === item.id);
                        return (
                            <div key={index} style={{width: "100%", height: "100%"}}>
                                <h1 style={{fontSize: "150%"}}>{this.props.graph.blocks[blockIndex].blockStorage.name
                                    .replace(/(^\w)|(\s+\w)/g,
                                        letter => letter.toUpperCase())}</h1>
                                {/*<li>{item.id}*/}
                                {/*    <ul>*/}
                                {/*        {Object.keys(this.props.graph.blocks[blockIndex].blockStorage.internalData)*/}
                                {/*            .map((key2, index2) => {*/}
                                {/*            // eslint-disable-next-line @typescript-eslint/ban-ts-comment*/}
                                {/*            // @ts-ignore*/}
                                {/*            const defaultValue = tempGraph.blocks[blockIndex]*/}
                                {/*                .blockStorage.internalData[key2];*/}
                                {/*            return (*/}
                                {/*                <React.Fragment/>*/}
                                {/*                // <li key={index2}>*/}
                                {/*                //     {key2}*/}
                                {/*                //     <input type="text" defaultValue={defaultValue}*/}
                                {/*                //            onChange={(e: ChangeEvent<HTMLInputElement>)=> {*/}
                                {/*                //                e.preventDefault();*/}
                                {/*                //                // eslint-disable-next-line @typescript-eslint/ban-ts-comment*/}
                                {/*                //                // @ts-ignore*/}
                                {/*                //                tempGraph.blocks[blockIndex].blockStorage*/}
                                {/*                //                    .internalData[key2] = parseFloat(e.target.value);*/}
                                {/*                //                e.stopPropagation();*/}
                                {/*                //            }}/><br/><br/>*/}
                                {/*                // </li>*/}
                                {/*            )*/}
                                {/*        })}*/}
                                {/*    </ul>*/}
                                {/*</li>*/}
                            </div>
                        )
                    })}
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
