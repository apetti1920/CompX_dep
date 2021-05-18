import {IpcChannelInterface} from "./IpcChannelInterface";
import {IpcMainEvent} from 'electron';
import {IpcRequest} from "../../../shared/types";
import {BLOCK_LIBRARY_CHANNEL} from "../../../shared/Channels";
import {BlockStorageType} from "@compx/sharedtypes";
import {blocksDir} from "../../constants";
import * as path from 'path'
import {fork} from 'child_process'

export class BlockLibraryChannel implements IpcChannelInterface {
    getName(): string {
        return BLOCK_LIBRARY_CHANNEL;
    }

    handle(event: IpcMainEvent, request: IpcRequest): void {
        if (!request.responseChannel) {
            request.responseChannel = `${this.getName()}_response`;
        }

        const cp = fork(path.join(__dirname, 'GetBlockLibraryFiles.js'));
        cp.send({"blocksDir": blocksDir});
        cp.on("message", (blocks: BlockStorageType[]) => {
            if (request.responseChannel !== undefined) {
                event.sender.send(request.responseChannel, blocks)
            }
        });
    }
}
