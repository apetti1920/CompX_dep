import {IpcChannelInterface} from "./IpcChannelInterface";
import {IpcMainEvent} from 'electron';
import {IpcRequest} from "../../../shared/types";
import {GET_DISPLAY_CHANNEL, RUN_MODEL_CHANNEL} from "../../../shared/Channels";
import main from "../../index";

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
            event.sender.send(GET_DISPLAY_CHANNEL, message);
        });
        cp.send({"visualGraph": request.params});
    }
}
