import {IpcChannelInterface} from "./IpcChannelInterface";
import {IpcMainEvent} from 'electron';
import {IpcRequest} from "../../../shared/types";
import {BLOCK_LIBRARY_CHANNEL} from "../../../shared/Channels";
import {BlockStorageType} from "../../../lib/GraphLibrary/types/BlockStorage";
import {blocksDir} from "../../constants";

const path = require('path');

const {fork} = require('child_process')

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
        cp.on("message", (message: string) => {
            const blocks: BlockStorageType[] = JSON.parse(message);
            event.sender.send(request.responseChannel, blocks)
        });
    }
}
