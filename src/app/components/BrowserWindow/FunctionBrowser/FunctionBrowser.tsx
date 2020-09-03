// @flow
import * as React from 'react';

import {DataType} from "../../types";
import {Accordion} from "../../ComponentUtils/Accordion";

type Props = {

};
type State = {

};


// TODO: Add Id
const data: DataType[] = [
    {id: 0, name: "sum", type: ["math"], pictureFile: "https://picsum.photos/181/40"},
    {id: 1, name: "divide", type: ["math"], pictureFile: "https://picsum.photos/72/40"},
    {id: 2, name: "product", type: ["math"], pictureFile: "https://picsum.photos/312/40"},
    {id: 3, name: "mass", type: ["math", "physics"], pictureFile: "https://picsum.photos/221/40"},
    {id: 4, name: "inertia", type: ["math", "physics"], pictureFile: "https://picsum.photos/12/40"},
    {id: 5, name: "stream", type: ["networking"], pictureFile: "https://picsum.photos/47/40"}
]

export class FunctionBrowser extends React.Component<Props, State> {
    // TODO: Of course connect this to the backend
    // TODO: Probably do some sort of caching with redux
    // TODO: Update periodically as background files change
    // TODO: Set loading until data has been loaded
    // TODO: Add scroll functionality for the eventuality there will be more blocks
    render(): React.ReactElement {
        return (
            <Accordion data={data}/>
        );
    }
}
