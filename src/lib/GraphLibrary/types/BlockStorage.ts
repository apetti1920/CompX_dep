import {Version} from './generic'

export type PortType = {
    id: string,
    name: string,
    type: string
}

export type BlockStorageType = {
    version: Version,
    imgFile: string
    name: string,
    description: string,
    tags: string[],
    internalData: Map<string, any>,
    inputPorts: PortType[],
    outputPorts: PortType[],
    pseudoSource: string,
    callback: string
}
