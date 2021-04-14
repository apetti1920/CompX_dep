import React from "react";

export type MenuItemType = {
    name: string,
    icon?: React.ReactElement,
    action?: ()=>void
    submenu?: MenuItemSpacerType[]
};

export type MenuItemSpacerType = MenuItemType | "Spacer";

export enum CanvasSelectionType {
    BLOCK, EDGE //, MULTIPLE
}

export enum MouseDownType {
    NONE, GRID, BLOCK, EDGE, PORT, SCROLL
}
