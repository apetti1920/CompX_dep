// @flow
import * as React from 'react';
import _ from "lodash";

import LibraryBrowserCard from "./LibraryBrowserCard";
import {BlockStorageType} from "../../../../../../../shared/lib/GraphLibrary/types/BlockStorage";

import theme from "../../../../../../theme";
import {SetOpacity} from "../../../../../../utilities";

const accordionStyle: React.CSSProperties = {
    width: "100%",
    maxHeight: "inherit",
    backgroundColor: "none",
}

type Props = {
    data: BlockStorageType[]
};
type State = {
    expandedSubsectionID?: string
};

export class Accordion extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            expandedSubsectionID: undefined
        }
    }

    getOrderedKeywordList = (): string[] => {
        const allKeywords = this.props.data.map(d => d.tags).reduce((a, v) => a.concat(v),  []);
        const uniqueKeywords = [...new Set(allKeywords)];
        uniqueKeywords.sort((a, b): number => {
            const diff = this.props.data.filter(d => d.tags.includes(b)).length -
                this.props.data.filter(d => d.tags.includes(a)).length;
            if (diff!==0) { return diff }
            else { return b<a?1:-1 }
        });
        return uniqueKeywords
    }

    render(): React.ReactNode {
        const keywordSeparator = (keyword: string) => (
            <div style={{width: "100%", height: "15px", backgroundColor: SetOpacity(theme.palette.accent, 0.6), marginTop: "5px", marginBottom: "5px",
                padding: "5px", cursor: "pointer", borderRadius: "7px"}}
                 onClick={()=>{
                     const tempState: State = _.cloneDeep(this.state);
                     if (tempState.expandedSubsectionID===undefined) {
                         tempState.expandedSubsectionID = keyword;
                     } else {
                         tempState.expandedSubsectionID = undefined
                     }
                     this.setState(tempState);
                 }}>{keyword}</div>
        )

        const unExpandedElement = (
            <div style={{width: "100%", flexGrow: 1, display: "flex", flexFlow: "column nowrap", overflowY: "auto", overflowX: "visible"}}>
                {
                    this.getOrderedKeywordList().map(k => (
                        React.cloneElement(keywordSeparator(k), {key: k})
                    ))
                }
            </div>

        );

        const expandedElement = (
            <React.Fragment>
                {keywordSeparator(this.state.expandedSubsectionID)}
                <div style={{width: "100%", backgroundColor: SetOpacity(theme.palette.link, 0.4), flexGrow: 1,
                    color: theme.palette.shadow, borderRadius: "7px", display: "flex", flexFlow: "row wrap",
                    justifyContent:  "space-around", overflowY: "auto"}}>
                    {
                        this.props.data.filter(d => d.tags.includes(this.state.expandedSubsectionID)).map(d => (
                            <LibraryBrowserCard key={d.id} data={d}/>
                        ))
                    }
                </div>
            </React.Fragment>
        )

        return this.state.expandedSubsectionID===undefined?unExpandedElement:expandedElement;
    }
}
