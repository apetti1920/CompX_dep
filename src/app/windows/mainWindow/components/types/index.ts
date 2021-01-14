import React from "react";

export type DataType = {
    id: number,
    name: string,
    type: string[],
    pictureFile: string
}

export type MenuItemType = {
    icon: React.ReactNode,
    name: string,
    action: ()=>void | MenuItemSpacerType[]
};

export type MenuItemSpacerType = MenuItemType | "Spacer";

export const DnDItemType = {
    LIBRARY_CARD: 'LIBRARY_CARD'
}

export enum CanvasSelectionType {
    BLOCK, EDGE //, MULTIPLE
}

export enum MouseDownType {
    NONE, GRID, BLOCK, EDGE, PORT, SCROLL
}
