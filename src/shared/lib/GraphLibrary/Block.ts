import Port, {AcceptedPortTypes} from "./Port";
import {BlockStorageType, InternalDataStorageType} from "@compx/sharedtypes";

type Callback = ((t: number, dt: number, prevInputs: unknown[], prevOutputs: unknown[], newInputs: unknown[], displayData?: Map<string, unknown[]>) => unknown[]);

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
        this.inputPorts = block.inputPorts.map(portStorage => new Port(portStorage, this.id));
        this.outputPorts = block.outputPorts.map(portStorage => new Port(portStorage, this.id));
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
        callbackString = callbackString.replace(new RegExp("internalData\\[(\\b[0-9a-f]{8}\\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\\b[0-9a-f]{12}\\b)\\]","gm"), (a, b) => {
            return `Number(this.internalData.find(i => i.id === "${b}").value)`;
        });
        callbackString = callbackString.replace(new RegExp("display\\s*\\(([\\s\\S]*)\\)\\s*;?","gm"), (a, b) => {
            return `if (displayData !== undefined) {displayData["${this.id}"]=${b}}`;
        });

        callbackString = `try{${callbackString}}catch(err){console.log(err);}`

        try {
            const func = new Function("t", "dt", "prevInputs", "prevOutputs", "newInputs", "displayData", callbackString)
                .bind(this);
            return func;
        } catch (syntaxError) {
            console.error("illegal code; syntax errors: ", syntaxError);
            console.info(syntaxError.name ,"-", syntaxError.message);
            throw syntaxError;
        }

    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public setInternalData(dataName: string, data: any): void {
        const dataInd = this.internalData.findIndex(d => d.name === dataName);
        if (dataInd !== -1) {
            if (typeof data === this.internalData[dataInd].type) {
                this.internalData[dataInd].value = data;
            } else {
                throw Error("Incorrect DataType");
            }
        } else {
            throw Error("Value Does Not Exist in Internal Data")
        }
    }

    public compile(t: number, dt: number, prevInputs: unknown[], prevOutputs: unknown[], newInputs: unknown[],
            displayData?: Map<string, unknown[]>): void {
        // console.log("here", this.name, this.callback);
        try {
            const newOutputs = this.callback(t, dt, prevInputs, prevOutputs, newInputs, displayData);
            // e.logconsol("here", this.name, newOutputs);
            for (let i=0; i<this.outputPorts.length; i++) {
                this.outputPorts[i].objectValue = newOutputs[i] as AcceptedPortTypes;
            }
        } catch (runtimeError) {
            console.error("legal code; unforeseen result: ", runtimeError);
            console.info(runtimeError.name ,"-", runtimeError.message);
            throw runtimeError;
        }
    }
}
