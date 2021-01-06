import {BlockStorageType, InternalDataStorageType, PortStorageType} from "../types/BlockStorage";
import React from "react";

export function Zeros(dimensions: number[]): number[][] {
    const array: number[][] = [];

    for (let i = 0; i < dimensions[0]; i++) {
        array[i] = []
        for (let j = 0; j < dimensions[1]; j++) {
            array[i][j] = 0;
        }
    }

    return array;
}

export function findNextOrMissing(numberList: number[]): number {
    numberList.sort();
    for (let i=0; i<Math.max(...numberList); i++) {
        if (numberList[i] !== i) {
            return i;
        }
    }
    return numberList.length;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function XmlToBlockStorageType(xml: any): BlockStorageType {
    let tags: string[] = [];
    if (typeof xml['block']['tags'] !== 'undefined') {
        if(typeof xml['block']['tags']['tag'].map === 'function') {
            tags = xml['block']['tags']['tag'];
        } else {
            if (typeof xml['block']['tags']['tag'] === 'string') {
                tags.push(xml['block']['tags']['tag'])
            }
        }
    }

    let internalData: InternalDataStorageType[] = [];
    if (typeof xml['block']['internalData'] !== "undefined") {
        if(typeof xml['block']['internalData']['data'].map === 'function') {
            internalData = xml['block']['internalData']['data'].map((b: any): InternalDataStorageType => {
                const id = b['id'] ?? b['name'].toLowerCase();
                return {
                    id: id,
                    name: b['name'],
                    type: b['type'],
                    value: b['value']
                }
            })
        } else {
            if (typeof xml['block']['internalData']['data'] !== "undefined") {
                const id = xml['block']['internalData']['data']['id'] !== undefined ?
                    xml['block']['internalData']['data']['id'] :
                    xml['block']['internalData']['data']['name'].toLowerCase();
                internalData.push({
                    id: id,
                    name: xml['block']['internalData']['data']['name'],
                    type: xml['block']['internalData']['data']['type'],
                    value: xml['block']['internalData']['data']['value']
                });
            }
        }
    }

    let inputPorts: PortStorageType[] = [];
    if (typeof xml['block']['inputPorts'] !== 'undefined') {
        if (typeof xml['block']['inputPorts']['port'].map === 'function') {
            inputPorts = xml['block']['inputPorts']['port'].map((b: any): PortStorageType => {
                return {
                    name: b['name'],
                    type: b['type']
                }
            });
        } else {
            if (typeof xml['block']['inputPorts']['port'] !== "undefined") {
                inputPorts.push({
                    name: xml['block']['inputPorts']['port']['name'],
                    type: xml['block']['inputPorts']['port']['type']
                });
            }
        }
    }

    let outputPorts: PortStorageType[] = [];
    if (typeof xml['block']['outputPorts'] !== 'undefined') {
        if (typeof xml['block']['outputPorts']['port'].map === 'function') {
            outputPorts = xml['block']['outputPorts']['port'].map((b: any): PortStorageType => {
                return {
                    name: b['name'],
                    type: b['type']
                }
            });
        } else {
            if (typeof xml['block']['outputPorts']['port'] !== "undefined") {
                outputPorts.push({
                    name: xml['block']['outputPorts']['port']['name'],
                    type: xml['block']['outputPorts']['port']['type']
                });
            }
        }
    }

    return {
        id: xml['block']['id'],
        version: {major: +xml['block']['version']['major'], technical: +xml['block']['version']['technical'],
            editorial: +xml['block']['version']['editorial'], letter: xml['block']['version']['letter']},
        thumbnail: xml['block']['thumbnail'],
        name: xml['block']['name'],
        description: xml['block']['description'],
        tags: tags,
        display: xml['block']['display'],
        internalData: internalData,
        inputPorts: inputPorts,
        outputPorts: outputPorts,
        pseudoSource: xml['block']['pseudoSource'],
        callback: xml['block']['callback']
    }
}
