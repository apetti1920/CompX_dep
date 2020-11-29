// @flow
import * as React from 'react';
import {connect} from "react-redux";

import {Accordion} from "./Accordion";
import {StateType} from "../../../store/types/stateTypes";
import {BlockStorageType} from "../../../../shared/lib/GraphLibrary/types/BlockStorage";

interface StateProps {
    blockLibrary: BlockStorageType[]
}

type Props = StateProps

class FunctionBrowser extends React.Component<Props, never> {
    // TODO: Update periodically as background files change
    // TODO: Set loading until data has been loaded
    // TODO: Add scroll functionality for the eventuality there will be more blocks

    render(): React.ReactElement {
        return (
            <Accordion data={this.props.blockLibrary}/>
        );
    }
}

function mapStateToProps(state: StateType): StateProps {
    return {
        blockLibrary: state.blockLibrary
    };
}

export default connect(mapStateToProps)(FunctionBrowser)
