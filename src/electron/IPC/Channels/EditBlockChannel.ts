import {IpcChannelInterface} from "./IpcChannelInterface";
import {IpcMainEvent} from 'electron';
import {IpcRequest} from "../../../shared/types";
import {EDIT_BLOCK_CHANNEL} from "../../../shared/Channels";
import store from "../../../app/store"

const path = require('path');
const {fork} = require('child_process')

declare const EDIT_BLOCK_WINDOW_WEBPACK_ENTRY: never;

export class EditBlockChannel implements IpcChannelInterface {
    getName(): string {
        return EDIT_BLOCK_CHANNEL;
    }

    handle(event: IpcMainEvent, request: IpcRequest): void {
        if (!request.responseChannel) {
            request.responseChannel = `${this.getName()}_response`;
        }

        // Open new Window
        console.log(request.params.blockID);
        const { BrowserWindow } = require('electron');
        const win = new BrowserWindow({ width: 800, height: 600 });
        win.loadURL(EDIT_BLOCK_WINDOW_WEBPACK_ENTRY);
    }
}
