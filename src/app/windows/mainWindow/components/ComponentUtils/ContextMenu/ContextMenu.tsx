// @flow
import * as React from 'react';
import Portal from "../Portal"
import {MenuItemSpacerType} from "../../types";
import {MenuItem} from "./MenuItem";
import {PointType} from "../../../../../../shared/types";
import theme, {GetGlassStyle} from "../../../../../theme";

type Props = {
    position: PointType|undefined,
    items: MenuItemSpacerType[]
};

type State = {
};

export class ContextMenu extends React.Component<Props, State> {
    private readonly menuMargin: number = 15;

    constructor(props: Props) {
        super(props);

        this.state = {
            position: {x: 0, y: 0},
            isOpen: false
        }
    }

    isOpen = (): boolean => this.props.position !== undefined;

    getMenuStyle = (): React.CSSProperties => {
        const width = 125; const height = 125;

        const bdys = {
            l: this.menuMargin,
            t: this.menuMargin + theme.spacing.titlebarHeight + theme.spacing.toolbarHeight,
            r: document.body.clientWidth + width - this.menuMargin,
            b: window.innerHeight + height - this.menuMargin
        }

        const pt = this.props.position??{x: 0, y: 0};

        if (pt.x < bdys.l) pt.x = bdys.l;
        else if (pt.x > bdys.r) pt.x = bdys.r;
        if (pt.y < bdys.t) pt.y = bdys.t;
        else if (pt.y > bdys.b) pt.y = bdys.b;

        return {
            position: 'fixed',
            top: `${pt.y}px`,
            left: `${pt.x}px`,
            width: `${width}px`,
            height: `${height}px`,
            zIndex: 99999,
            pointerEvents: this.isOpen() ? "auto" : "none",
            display: "inline-block",
            opacity: this.isOpen() ? 1.0 : 0.0,
            border: `1px solid ${theme.palette.shadow}`,
            ...GetGlassStyle(theme.palette.accent, 1.5)
        }
    };

    render(): React.ReactNode {
        // TODO: Move over if at edge of screen
        return (
            <Portal>
                <div style={this.getMenuStyle()}>
                    {this.props.items.map((item, index) => <MenuItem key={index} menuItem={item}/>)}
                </div>
            </Portal>
        );
    }
}
