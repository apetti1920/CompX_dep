// @flow
import * as React from 'react';
import {GraphVisualType, MouseType, StateType} from "../../../../../store/types";
import {bindActionCreators, Dispatch} from "redux";
import {connect} from "react-redux";
import {
    ChangedInternalDataAction
} from "../../../../../store/actions";

const _ = require('lodash');

interface StateProps {
    graph: GraphVisualType
}

interface DispatchProps {
    onChangedInternalData: (blockId: string, internalDataId: string, value: any) => void
}

type Props = StateProps & DispatchProps

type State = undefined;

export class CanvasEdit extends React.Component<Props, State> {
    onInputChange = (e: React.ChangeEvent<HTMLInputElement>, blockId: string, internalDataId: string): void => {
        const newValue = !isNaN(Number(e.target.value))?e.target.value:"0";
        _.debounce(() => {
            this.props.onChangedInternalData(blockId, internalDataId, newValue || "0");
        }, 1500)()
    }

    render(): React.ReactNode {
        const tempGraph = {...this.props.graph};

        return (
            <div style ={{width: "100%", height: "100%", background: "var(--custom-background-color)", color: "var(--custom-text-color)"}}>
                <ul>
                    {this.props.graph.blocks.filter(b => b.selected).map((item, index) => {
                        const blockIndex = tempGraph.blocks.findIndex(block => block.id === item.id);
                        return (
                            <div key={index} style={{width: "100%", height: "100%"}}>
                                <h1 style={{fontSize: "150%"}}>{this.props.graph.blocks[blockIndex].blockStorage.name
                                    .replace(/(^\w)|(\s+\w)/g,
                                        letter => letter.toUpperCase())}</h1>
                                <form>
                                    {
                                        this.props.graph.blocks[blockIndex].blockStorage.internalData.map(intDat => {
                                            return (
                                                <label key={intDat.id + "_" + intDat.value}>
                                                    {intDat.name}:
                                                    <br/>
                                                    <input type="text" name={intDat.name} defaultValue={intDat.value || '0'}
                                                           onChange={(e)=>
                                                               this.onInputChange(e, this.props.graph.blocks[blockIndex].id, intDat.id)} />
                                                               <br/><br/>
                                                </label>
                                            )
                                        })
                                    }
                                </form>
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
        graph: state.graph
    };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
    return bindActionCreators({
        onChangedInternalData: ChangedInternalDataAction
    }, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(CanvasEdit)
