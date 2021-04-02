// @flow
import * as React from 'react';
import {MenuItemSpacerType} from "../../types";
import {MenuItem} from "./MenuItem";
import {PointType} from "../../../../../../shared/types";

type Props = {
    position: PointType,
    items: MenuItemSpacerType[]
};

type State = {

};

export class ContextMenu extends React.Component<Props, State> {
    render(): React.ReactNode {
        // TODO: Move over if at edge of screen
        return (
            <div style={{position: "absolute", zIndex: 4, left: `${this.props.position.x}px`,
                top: `${this.props.position.y}px`, width: "125px", backgroundColor: "var(--custom-link-color)",
                color: "var(--custom-text-color)", paddingTop: "3px", paddingBottom: "3px", pointerEvents: "auto"}}>
                {this.props.items.map((item, index) => <MenuItem key={index} menuItem={item}/>)}
            </div>
        );
    }
}
