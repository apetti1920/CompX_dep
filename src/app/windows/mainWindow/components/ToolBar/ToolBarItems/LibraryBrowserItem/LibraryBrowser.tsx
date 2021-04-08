// @flow
import * as React from 'react';

import Portal from "../../../ComponentUtils/Portal"
import {PointType} from "../../../../../../../shared/types";
import theme, {GetGlassStyle} from "../../../../../../theme";
import {Accordion} from "./Accordion";
import {StateType} from "../../../../../../store/types";
import {connect} from "react-redux";
import {BlockStorageType} from "../../../../../../../shared/lib/GraphLibrary/types/BlockStorage";
import {SearchBar} from "../../../ComponentUtils/SearchBar";

type ComponentProps = {
    open: boolean
    location: PointType
};

interface StateProps {
    blockLibrary: BlockStorageType[]
}

type Props = ComponentProps & StateProps

type State = {
    searchString: string
};

class LibraryBrowser extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            searchString: ""
        }
    }

    GetLibraryBrowserStyle = (): React.CSSProperties => ({
        width: "300px",
        maxHeight: "350px",
        position: 'fixed',
        top: `${this.props.location.y}px`,
        left: `${this.props.location.x}px`,
        zIndex: 99999,
        pointerEvents: this.props.open ? "auto" : "none",
        display: "flex",
        flexFlow: "column nowrap",
        opacity: this.props.open ? 1 : 0,
        borderRadius: "7px",
        padding: "5px",
        ...GetGlassStyle(theme.palette.accent, 0.8)
    })

    // padding: "5px",

    render(): React.ReactNode {
        return (
            <Portal>
                <div style={this.GetLibraryBrowserStyle()}>
                    <div style={{width: "100%", height: "30px"}}>
                        <SearchBar onChange={(currentString) => {this.setState({searchString: currentString})}}/>
                    </div>
                    {
                        this.state.searchString !== "" ? (
                            <Accordion data={this.props.blockLibrary.filter(b => {
                                if (this.state.searchString === "") { return false }
                                for (let i=0; i<b.tags.length; i++) {
                                    if (b.tags[i].toLowerCase().includes(this.state.searchString.toLowerCase())){
                                        return true;
                                    }
                                }
                                return b.name.toLowerCase().includes(this.state.searchString.toLowerCase());


                            })}/>
                        ) : <React.Fragment/>
                    }
                </div>
            </Portal>
        );
    }
}

function mapStateToProps(state: StateType): StateProps {
    return {
        blockLibrary: state.blockLibrary
    };
}

export default connect(mapStateToProps)(LibraryBrowser)
