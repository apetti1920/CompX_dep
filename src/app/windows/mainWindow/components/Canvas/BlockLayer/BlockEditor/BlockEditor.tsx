// @flow
import * as React from 'react';
import {BlockVisualType} from "../../../../../../store/types";
import {bindActionCreators, Dispatch} from "redux";
import {ChangedInternalDataAction} from "../../../../../../store/actions";
import {connect} from "react-redux";
import {MenuItem} from "./MenuItem";

type ComponentProps = {
    block: BlockVisualType
};

interface DispatchProps {
    onChangedInternalData: (blockId: string, internalDataId: string, value: any) => void
}

type Props = ComponentProps & DispatchProps

type State = {

};

class BlockEditor extends React.Component<Props, State> {
    tempOnChangedInternalData = (blockId: string, internalDataId: string, value: any): void => {
        this.props.onChangedInternalData(blockId, internalDataId, value);
        this.forceUpdate();
    }

    render(): React.ReactElement {
        return (
            <div style={{display: "flex", flexFlow: "column nowrap"}}>
                <h1 style={{flex: "0 1 auto", textAlign: "center"}}>{this.props.block.blockStorage.name}</h1>
                <div style={{flex: "1 1 auto", display: "flex", flexFlow: "row wrap", placeContent: "space-around", overflowY: "scroll"}}>
                    {this.props.block.blockStorage.internalData.map(b =>
                        (<MenuItem key= {b.id} blockId={this.props.block.id} internalData={b} onChangedInternalData={this.tempOnChangedInternalData}/>))
                    }
                </div>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
    return bindActionCreators({
        onChangedInternalData: ChangedInternalDataAction
    }, dispatch)
}


export default connect(null, mapDispatchToProps)(BlockEditor)
