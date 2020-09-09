import fs from "fs";
import { v4 as uuidv4 } from 'uuid';

import Port, {AcceptedPortTypes} from "./Port";
import {BlockStorageType, PortType} from "./types/BlockStorage";

type Callback = ((t: number, dt: number, prevInputs: unknown[], prevOutputs: unknown[], newInputs: unknown[]) => unknown[]);

export default class Block {
    readonly id: string;
    public name: string;
    private readonly description: string;
    public readonly tags: string[]
    public internalData: Map<string, unknown>;
    public readonly inputPorts: Port[];
    public readonly outputPorts: Port[];
    public readonly pseudoSource: boolean;
    public readonly callback: Callback;

    constructor(filePath: string) {
        const data = fs.readFileSync(filePath, 'utf8');
        const jsonData: BlockStorageType = JSON.parse(data);
        this.id = uuidv4();
        this.name = jsonData.name;
        this.description = jsonData.description;
        this.tags = jsonData.tags;
        this.internalData = new Map<string, unknown>();
        const iData = new Map(Object.entries(jsonData.internalData));
        iData.forEach((value, key) => this.internalData.set(key, value));
        this.inputPorts = jsonData.inputPorts.map((port: PortType) => new Port(port, this));
        this.outputPorts = jsonData.outputPorts.map((port: PortType) => new Port(port, this));
        this.pseudoSource = jsonData.pseudoSource === "true";
        this.callback = this.convertCallback(jsonData.callback);
    }

    private convertCallback(callbackData: string): Callback {
        let callbackString = callbackData.replace(new RegExp("prevInputs\\[(\\w+)\\]","gm"), (a, b) => {
            const index = this.inputPorts.map((port) => port.name).indexOf(b);
            return `prevInputs[${index}]`;
        });
        callbackString = callbackString.replace(new RegExp("prevOutputs\\[(\\w+)\\]","gm"), (a, b) => {
            const index = this.outputPorts.map((port) => port.name).indexOf(b);
            return `prevOutputs[${index}]`;
        });
        callbackString = callbackString.replace(new RegExp("inputPort\\[(\\w+)\\]","gm"), (a, b) => {
            const index = this.inputPorts.map((port) => port.name).indexOf(b);
            return `newInputs[${index}]`;
        });
        callbackString = callbackString.replace(new RegExp("internalData\\[(\\w+)\\]","gm"), (a, b) => {
            return `this.internalData.get("${b}")`;
        });

        let fn: Callback;
        eval(`fn = (t, dt, prevInputs, prevOutputs, newInputs) => {${callbackString}}`)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return fn;
    }

    compile(t: number, dt: number, prevInputs: unknown[], prevOutputs: unknown[], newInputs: unknown[]):void {
        const newOutputs = this.callback(t, dt, prevInputs, prevOutputs, newInputs);
        for (let i=0; i<this.outputPorts.length; i++) {
            this.outputPorts[i].objectValue = newOutputs[i] as AcceptedPortTypes;
        }
    }
}
