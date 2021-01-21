import Port, {AcceptedPortTypes} from "./Port";
import {BlockStorageType, InternalDataStorageType} from "./types/BlockStorage";

type Callback = ((t: number, dt: number, prevInputs: unknown[], prevOutputs: unknown[], newInputs: unknown[], internalData: InternalDataStorageType[]) => unknown[]);

export default class Block {
    readonly id: string;
    public name: string;
    private readonly description: string;
    public readonly tags: string[]
    public internalData: InternalDataStorageType[];
    public readonly inputPorts: Port[];
    public readonly outputPorts: Port[];
    public readonly pseudoSource: boolean;
    public readonly callback: Callback;

    constructor(block: BlockStorageType) {
        this.id = block.id;
        this.name = block.name;
        this.description = block.description;
        this.tags = block.tags;
        this.internalData = block.internalData;
        this.inputPorts = block.inputPorts.map(portStorage => new Port(portStorage, this));
        this.outputPorts = block.outputPorts.map(portStorage => new Port(portStorage, this));
        this.pseudoSource = block.pseudoSource === "true";
        this.callback = this.convertCallback(block.callback);
    }

    // eslint-disable-next-line @typescript-eslint/ban-types
    private convertCallback(callbackData: string): Callback {
        let callbackString = callbackData.replace(new RegExp("prevInputs\\[(\\w+)\\]","gm"), (a, b) => {
            const index = this.inputPorts.map(port => port.name).indexOf(b);
            return `prevInputs[${index}]`;
        });
        callbackString = callbackString.replace(new RegExp("prevOutputs\\[(\\w+)\\]","gm"), (a, b) => {
            const index = this.outputPorts.map(port => port.name).indexOf(b);
            return `prevOutputs[${index}]`;
        });
        callbackString = callbackString.replace(new RegExp("inputPort\\[(\\w+)\\]","gm"), (a, b) => {
            const index = this.inputPorts.map((port) => port.name).indexOf(b);
            return `newInputs[${index}]`;
        });
        callbackString = callbackString.replace(new RegExp("internalData\\[(\\w+)\\]","gm"), (a, b) => {
            return `this.internalData.find(i => (i.id === "${b}" || i.name === "${b}"))?.value`;
        });

        let fn: Callback;
        eval(`fn = (function(t, dt, prevInputs, prevOutputs, newInputs){${callbackString}}).bind(this);`);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return fn;
    }

    compile(t: number, dt: number, prevInputs: unknown[], prevOutputs: unknown[], newInputs: unknown[]):void {
        const newOutputs = this.callback(t, dt, prevInputs, prevOutputs, newInputs, this.internalData);
        for (let i=0; i<this.outputPorts.length; i++) {
            this.outputPorts[i].objectValue = newOutputs[i] as AcceptedPortTypes;
        }
    }
}
