import {IpcChannelInterface} from "./IpcChannelInterface";
import {IpcMainEvent} from 'electron';
import {IpcRequest} from "../../../shared/types";
import {RUN_MODEL_CHANNEL} from "../../../shared/Channels";

const path = require('path');
const {fork} = require('child_process')

export class RunModelChannel implements IpcChannelInterface {
    getName(): string {
        return RUN_MODEL_CHANNEL;
    }

    handle(event: IpcMainEvent, request: IpcRequest): void {
        if (!request.responseChannel) {
            request.responseChannel = `${this.getName()}_response`;
        }

        const cp = fork(path.join(__dirname, 'ModelLib.js'));
        cp.on("message", (message: any) => {
            if (message["cmd"] === "display_data") {
                event.sender.send(request.responseChannel, message["data"]);
            } else {
                console.log(message);
            }
        });
        cp.send({"visualGraph": request.params});
    }
}
