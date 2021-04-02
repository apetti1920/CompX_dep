// @flow
import * as React from 'react';
import _ from "lodash";

import LibraryBrowserCard from "./LibraryBrowserCard";
import {BlockStorageType} from "../../../../../../../shared/lib/GraphLibrary/types/BlockStorage";

const accordionStyle: React.CSSProperties = {
    width: "100%",
    backgroundColor: "blue",
    paddingTop: "5px"
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
            <div style={{width: "100%", height: "15px", backgroundColor: "green", marginBottom: "5px", cursor: "pointer"}}
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
            this.getOrderedKeywordList().map(k => (
                React.cloneElement(keywordSeparator(k), {key: k})
            ))
        );

        const expandedElement = (
            <React.Fragment>
                {keywordSeparator(this.state.expandedSubsectionID)}
                <div style={{width: "100%", backgroundColor: "teal", display: "flex", flexFlow: "row wrap", justifyContent:  "space-around"}}>
                    {
                        this.props.data.filter(d => d.tags.includes(this.state.expandedSubsectionID)).map(d => (
                            <LibraryBrowserCard key={d.id} data={d}/>
                        ))
                    }
                </div>
            </React.Fragment>
        )

        return (
            <div style={accordionStyle}>
                {this.state.expandedSubsectionID===undefined?unExpandedElement:expandedElement}
            </div>
        );
    }
}
