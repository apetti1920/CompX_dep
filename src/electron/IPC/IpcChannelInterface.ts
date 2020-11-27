import {IpcMainEvent} from 'electron';
import {IpcRequest} from "../../shared/types";

export interface IpcChannelInterface {
    getName(): string;

    handle(event: IpcMainEvent, request: IpcRequest): void;
}
