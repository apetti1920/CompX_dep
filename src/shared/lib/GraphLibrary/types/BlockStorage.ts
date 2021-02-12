import {Version} from './generic'

export type PortStorageType = {
    id: string,
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
    display?: {displayStatic?: string, displayDynamic?: string},
    inputPorts: PortStorageType[],
    outputPorts: PortStorageType[],
    pseudoSource: string,
    callback: string
}

export type DataTransferType = {time: number, data: any};
