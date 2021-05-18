// @flow
/** @jsx jsx */
import { css, jsx } from '@emotion/react'
import * as React from 'react';
import {InternalDataStorageType} from "@compx/sharedtypes";
import {SetOpacity} from "../../../../../../utilities";
import theme from "../../../../../../theme";
import {bindActionCreators, Dispatch} from "redux";
import {ChangedInternalDataAction} from "../../../../../../store/actions";
import {connect} from "react-redux";
import {StateType} from "../../../../../../store/types";

type ComponentProps = {
    blockId: string
    internalDataID: string,
};

interface DispatchProps {
    onChangedInternalData: (blockId: string, internalDataId: string, value: any) => void
}

interface StateProps {
    internalData: InternalDataStorageType
}

type Props = ComponentProps & DispatchProps & StateProps

type State = {

};

class MenuItem extends React.Component<Props, State> {
    onBlurHandler = (e: React.FocusEvent<HTMLInputElement>): void => {
        console.log("here")
        this.props.onChangedInternalData(this.props.blockId, this.props.internalData.id, e.target.value);
        e.target.value = "";
        e.target.placeholder = this.props.internalData.value.toString();
    }

    render(): React.ReactElement {
        return (
            <div style={{borderRadius: "2px", backgroundColor: SetOpacity(theme.palette.shadow, 0.6), padding: "4px"}}>
                <label style={{color: SetOpacity(theme.palette.accent, 0.8), paddingRight: "4px",
                    borderRight: `1px solid ${SetOpacity(theme.palette.accent, 0.8)}`}}>
                    {this.props.internalData.name}
                </label>
                <input
                    css={css`
                            flex-grow: 1;
                            max-width: 90px;
                            vertical-align: middle;
                            border-style: none;
                            background: transparent;
                            outline: none;
                            text-align: right;
                            color: ${SetOpacity(theme.palette.accent, 0.8)};
                            &::placeholder {
                                color: ${SetOpacity(theme.palette.text, 0.4)};
                            }
                            &::-webkit-search-cancel-button {
                              appearance: none;
                            }
                    `}
                    placeholder={this.props.internalData.value.toString()}
                    onFocus={(e) => e.target.placeholder = ""}
                    onBlur={(e) => this.onBlurHandler(e)}
                />
            </div>
        );
    }
}

function mapStateToProps(state: StateType, ownProps: ComponentProps): StateProps {
    const b1 = state.graph.blocks.find(b => b.id === ownProps.blockId);
    if (b1 !== undefined) {
        const d1 = b1.blockStorage.internalData.find(d => d.id === ownProps.internalDataID);
        if (d1 !== undefined) {
            return {
                internalData: d1
            }
        } else {
            throw Error("InternalData Not found");
        }
    } else {
        throw Error("Block Not found");
    }
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
    return bindActionCreators({
        onChangedInternalData: ChangedInternalDataAction
    }, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(MenuItem)
