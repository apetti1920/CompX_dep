import {IpcChannelInterface} from "./IpcChannelInterface";
import {IpcMainEvent} from 'electron';
import {IpcRequest} from "../../../shared/types";
import {RUN_MODEL_CHANNEL} from "../../../shared/Channels";
import {Edge, Graph} from "../../../shared/lib/GraphLibrary";
import {BlockStorageType} from "../../../shared/lib/GraphLibrary/types/BlockStorage";
import {EdgeType} from "../../../shared/lib/GraphLibrary/Graph";

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
        cp.send({"visualGraph": request.params});
        cp.on("message", (message: string) => {
            console.log(("here"));
        });
    }
}
