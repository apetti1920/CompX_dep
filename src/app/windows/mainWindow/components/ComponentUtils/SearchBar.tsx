// @flow
import * as React from 'react';
import styled from "styled-components";
import _ from "lodash";

import theme from "../../../../theme";

const SearchField = styled.input`
    font-size: 14px;
    background: none;
    color: ${theme.palette.text};
    flex-grow: 5;
    border: none;
    appearance: none;
    outline: none;
    &::-webkit-search-cancel-button {
      appearance: none;
    }`;

type Props = {
    onChange: (inputString: string) => void
};

type State = {
    currentString?: string
};

export class SearchBar extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            currentString: ""
        }
    }

    onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const tempState: State = _.cloneDeep(this.state);
        tempState.currentString = event.target.value
        this.props.onChange?.(event.target.value);
        this.setState(tempState);
    }

    render(): React.ReactNode {
        return (
            <React.Fragment>
                <svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" display="none">
                    <symbol id="search" viewBox="0 0 32 32">
                        <path d="M 19.5 3 C 14.26514 3 10 7.2651394 10 12.5 C 10 14.749977 10.810825 16.807458 12.125 18.4375 L 3.28125 27.28125 L 4.71875 28.71875 L 13.5625 19.875 C 15.192542 21.189175 17.250023 22 19.5 22 C 24.73486 22 29 17.73486 29 12.5 C 29 7.2651394 24.73486 3 19.5 3 z M 19.5 5 C 23.65398 5 27 8.3460198 27 12.5 C 27 16.65398 23.65398 20 19.5 20 C 15.34602 20 12 16.65398 12 12.5 C 12 8.3460198 15.34602 5 19.5 5 z" />
                    </symbol>
                </svg>
                <div style={{width: "100%", height: "100%", display: "flex", flexFlow: "row nowrap", alignContent: "center"}}>
                    <div className="search-button" style={{
                        flexGrow: 1, padding: 0, margin: 0,
                        border: "none", background: "none", outline: "none !important"
                    }}>
                        <svg className="submit-button" style={{
                            display: "block", margin: "auto", paddingTop: "5px", paddingBottom: "5px",
                            width: "20px", height: "20px", fill: theme.palette.text
                        }}>
                            <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#search"/>
                        </svg>
                    </div>
                    <SearchField type="search" value={this.state.currentString}
                           placeholder="Search" className="search-input" onChange={this.onChange}/>
                </div>
            </React.Fragment>
        );
    }
}
