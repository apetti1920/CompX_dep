import {IpcMainEvent} from "electron";

import {IpcChannelInterface} from "./IpcChannelInterface";
import {GET_THEME_CHANNEL} from "../../../shared/Channels";
import {IpcRequest} from "../../../shared/types";
import {themesDir} from "../../constants";

const path = require('path');
const {fork} = require('child_process')

export default class GetThemeChannel implements IpcChannelInterface {
    getName(): string {
        return GET_THEME_CHANNEL
    }

    handle(event: IpcMainEvent, request: IpcRequest): void {
        if (!request.responseChannel) {
            request.responseChannel = `${this.getName()}_response`;
        }

        const cp = fork(path.join(__dirname, 'GetThemeFiles.js'));
        cp.send({"themesDir": themesDir});
        cp.on("message", (themes: string[]) => {
            event.sender.send(request.responseChannel, themes)
        });
    }
}
