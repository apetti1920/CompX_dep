import {IpcChannelInterface} from "./IpcChannelInterface";
import {IpcMainEvent} from 'electron';
import {IpcRequest} from "../../../shared/types";
import {execSync} from "child_process";
import {SYSTEM_INFO_CHANNEL} from "../../../shared/Channels";

export class SystemInfoChannel implements IpcChannelInterface {
    getName(): string {
        return SYSTEM_INFO_CHANNEL;
    }

    handle(event: IpcMainEvent, request: IpcRequest): void {
        if (!request.responseChannel) {
            request.responseChannel = `${this.getName()}_response`;
        }
        event.sender.send(request.responseChannel, { kernel: execSync('uname -a').toString() });
    }
}
