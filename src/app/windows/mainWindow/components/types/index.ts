import React from "react";

export type MenuItemType = {
    icon: React.ReactNode,
    name: string,
    action: ()=>void | MenuItemSpacerType[]
};

export type MenuItemSpacerType = MenuItemType | "Spacer";

export enum CanvasSelectionType {
    BLOCK, EDGE //, MULTIPLE
}

export enum MouseDownType {
    NONE, GRID, BLOCK, EDGE, PORT, SCROLL
}
