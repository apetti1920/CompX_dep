// @flow
import * as React from 'react';
import {InternalDataStorageType} from "../../../../../../../shared/lib/GraphLibrary/types/BlockStorage";
import {SetOpacity} from "../../../../../../utilities";
import theme from "../../../../../../theme";
import styled from "styled-components";

type Props = {
    blockId: string
    internalData: InternalDataStorageType,
    onChangedInternalData: (blockId: string, internalDataId: string, value: any) => void
};

type State = {
    inputText: string
};

export class MenuItem extends React.Component<Props, State> {
    private InputField: any

    constructor(props: Props) {
        super(props);

        this.SetInputField(false);
        this.state = {
            inputText: this.props.internalData.value.toString()
        }
    }

    SetInputField = (isFocused: boolean) => {
        this.InputField = styled.input`
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
        `
    }

    onBlurHandler = (): void => {
        if (this.state.inputText !== this.props.internalData.value.toString()) {
            this.props.onChangedInternalData(this.props.blockId, this.props.internalData.id, this.state.inputText);
        }
    }

    render(): React.ReactElement {
        return (
            <div style={{borderRadius: "2px", backgroundColor: SetOpacity(theme.palette.shadow, 0.6), padding: "4px"}}>
                <label style={{color: SetOpacity(theme.palette.accent, 0.8), paddingRight: "4px",
                    borderRight: `1px solid ${SetOpacity(theme.palette.accent, 0.8)}`}}>
                    {this.props.internalData.name}
                </label>
                <this.InputField  type="text" placeholder={this.props.internalData.value.toString()}
                                  value={this.state.inputText!==this.props.internalData.value.toString()?this.state.inputText:""}
                                 onChange={(e: React.ChangeEvent<HTMLInputElement>)=>{
                                     this.setState({inputText: e.currentTarget.value})
                                 }} onBlur={this.onBlurHandler}/>
            </div>
        );
    }
}
