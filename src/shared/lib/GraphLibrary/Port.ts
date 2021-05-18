import {PortStorageType} from "@compx/sharedtypes";

export enum PortTypes { string, number}
export type AcceptedPortTypes = (string | number | null)

export default class Port {
    public readonly id: string;
    public readonly name: string;
    public readonly parentId: string;
    public readonly type: PortTypes;
    private _objectValue: AcceptedPortTypes;

    constructor(portData: PortStorageType, parentId: string) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.id = portData["id"];
        this.name = portData["name"];
        this.parentId = parentId;

        switch (portData["type"]) {
            case PortTypes.number.toString():
                this.type = PortTypes.number;
                break;
            case PortTypes.string.toString():
                this.type = PortTypes.string;
                break;
            default:
                this.type = PortTypes.number;
                break;
        }
        this._objectValue = null;
    }

    get objectValue(): AcceptedPortTypes {
        return this._objectValue;
    }

    set objectValue(value: AcceptedPortTypes) {
        switch (this.type) {
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
        throw `Port value (${value}) must be type of type ${PortTypes[this.type]}`
    }

}
