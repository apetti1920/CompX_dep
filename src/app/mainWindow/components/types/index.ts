import React from "react";

export type PointType = {
    x: number,
    y: number
}

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
    BLOCK, EDGE, MULTIPLE
}

export enum MouseDown {
    NONE, GRID, BLOCK, EDGE, PORT
}
