import {Version} from './generic'

export type PortStorageType = {
    name: string,
    type: string
}

export type InternalDataStorageType = {
    name: string,
    type: "number",
    value: any
}

export type BlockStorageType = {
    id: string,
    version: Version,
    imgFile: string
    name: string,
    description: string,
    tags: string[],
    internalData: InternalDataStorageType[],
    inputPorts: PortStorageType[],
    outputPorts: PortStorageType[],
    pseudoSource: string,
    callback: string
}
