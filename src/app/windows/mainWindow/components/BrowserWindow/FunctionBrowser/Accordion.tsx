// @flow
import * as React from 'react';
// eslint-disable-next-line import/no-unresolved
import CSS from "csstype";
import {FunctionBrowserCard} from "./FunctionBrowserCard";
import {BlockStorageType} from "../../../../../../shared/lib/GraphLibrary/types/BlockStorage";

const headerButtonStyle: CSS.Properties = {
    width: "100%", height: "var(--sidebar-width)", margin: "var(--border-width)",
    backgroundColor: "var(--custom-accent-color)", display: "flex",
    justifyContent: "center", alignItems: "center",
    fontFamily: "var(--custom-font-family)", color: "var(--custom-text-color)",
    userSelect: "none"
};

type Props = {
    data: BlockStorageType[]
};

type State = {
    categoryClicked?: string;
    returnComponent: React.ReactNode;
};

export class Accordion extends React.Component<Props, State> {
    //TODO: Might change over to keeping other tabs visible while separate block chooser drops down
    constructor(props: Props) {
        super(props);

        this.state = {
            categoryClicked: undefined,
            returnComponent: (<React.Fragment/>)
        }
    }

    componentDidMount(): void {
        this.createAccordionClosed();
    }

    headerButtonClicked(category: string): void {
        if (this.state.categoryClicked === undefined) {
            this.createAccordionOpen(category);
        } else {
            this.createAccordionClosed();
        }
    }

    createAccordionOpen(category: string): void {
        const tempState = {...this.state};
        tempState.categoryClicked = category;
        tempState.returnComponent = (
            <React.Fragment>
                <div key={category} style={headerButtonStyle} onClick={() => this.headerButtonClicked(category)}>{category}</div>
                <div style={{display: "flex", flexFlow: "row wrap", alignItems: "start",
                    alignContent: "start", justifyContent: "space-evenly"}}>
                    {
                        this.props.data.filter(dat => dat.tags.includes(category)).map(dat => {
                            return (<FunctionBrowserCard key={dat.name} data={dat}/>)
                        })
                    }
                </div>
            </React.Fragment>
        )
        this.setState(tempState);
    }

    createAccordionClosed(): void {
        const tempState = {...this.state};
        const typesList = this.props.data.map(dat => dat.tags).flat();
        const typesSet: string[] = typesList.filter((item, index) =>
            typesList.indexOf(item) === index);
        tempState.returnComponent = (
            typesSet.map(type => {
                return (
                    <div key={type} style={headerButtonStyle} onClick={() => this.headerButtonClicked(type)}>{type}</div>
                )
            }))
        tempState.categoryClicked = undefined;
        this.setState(tempState);
    }

    render(): React.ReactElement {
        return (
            <React.Fragment>
                {this.state.returnComponent}
            </React.Fragment>
        );
    }
}
