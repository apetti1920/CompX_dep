import Block from "./Block";
import {PortType} from "../../types/BlockStorage";

export enum PortTypes { string, number}
export type AcceptedPortTypes = (string | number | null)

export default class Port {
    private readonly id: string;
    public readonly name: string;
    public readonly objectType: PortTypes;
    public parent: Block;
    private _objectValue: AcceptedPortTypes;

    constructor(portData: PortType, parent: Block) {
        this.id = portData["id"];
        this.name = portData["name"];
        this.parent = parent;

        switch (portData["type"]) {
            case PortTypes.number.toString():
                this.objectType = PortTypes.number;
                break;
            case PortTypes.string.toString():
                this.objectType = PortTypes.string;
                break;
            default:
                this.objectType = PortTypes.number;
                break;
        }
        this._objectValue = null;
    }

    get objectValue(): AcceptedPortTypes {
        return this._objectValue;
    }

    set objectValue(value: AcceptedPortTypes) {
        switch (this.objectType) {
            case PortTypes.number:
                if (typeof value === PortTypes[PortTypes.number] || value === null) {
                    this._objectValue = value;
                    return;
                }
                break;
            case PortTypes.string:
                if (typeof value === PortTypes[PortTypes.string] || value === null) {
                    this._objectValue = value;
                    return;
                }
                break;
        }
        throw `Port value (${value}) must be type of type ${PortTypes[this.objectType]}`
    }

}
