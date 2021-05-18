// @flow
import * as React from 'react';
import Portal from "./Portal";
import theme, {GetGlassStyle} from "../../../../theme";
import {bindActionCreators, Dispatch} from "redux";
import { ChangedModalAction } from "../../../../store/actions";
import {connect} from "react-redux";
import {CanvasType, StateType} from "../../../../store/types";


interface ComponentProps {
    children?: React.ReactNode
}

type StateProps = {
    canvas: CanvasType
};

interface DispatchProps {
    onChangeModal: (modal?: React.ReactElement) => void
}

type Props = ComponentProps & StateProps & DispatchProps;

type State = {

}

class Modal extends React.Component<Props, State> {
    render(): React.ReactElement {
        return (
            <Portal>
                <div style={{position: "fixed", width: "100vw", height: "100vh",
                    top: `${theme.spacing.titlebarHeight}px`, left: "0px", ...GetGlassStyle(theme.palette.background, 0.8)}}
                     onClick={()=>this.props.onChangeModal(undefined)}>
                    <div style={{position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                        width: "50%", height: "50%", borderRadius: "7px", padding: "5px", overflow: "hidden",
                        ...GetGlassStyle(theme.palette.accent, 1.5)}}
                         onClick={(event)=> {
                             event.preventDefault();
                             event.stopPropagation();
                         }}>
                        {this.props.children}
                    </div>
                </div>
            </Portal>
        );
    }
}

function mapStateToProps(state: StateType): StateProps {
    return {
        canvas: state.canvas
    };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
    return bindActionCreators({
        onChangeModal: ChangedModalAction
    }, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(Modal)
