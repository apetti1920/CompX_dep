import {Version} from './generic'
import React from "react";

export type PortStorageType = {
    name: string,
    type: string
}

export type InternalDataStorageType = {
    id: string,
    name: string,
    type: "number",
    value: any
}

export type BlockStorageType = {
    id: string,
    version: Version,
    thumbnail: string
    name: string,
    description: string,
    tags: string[],
    internalData: InternalDataStorageType[],
    display: string,
    inputPorts: PortStorageType[],
    outputPorts: PortStorageType[],
    pseudoSource: string,
    callback: string
}
