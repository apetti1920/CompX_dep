import {TEST_SCOPE_CHANNEL} from "../../../shared/Channels";
import csv = require('csv-parser');
import * as fs from 'fs';
import {IpcChannelInterface} from "./IpcChannelInterface";
import IpcMainEvent = Electron.Main.IpcMainEvent;
import {IpcRequest} from "../../../shared/types";

export class TestScopeChannel implements IpcChannelInterface {
    getName(): string {
        return TEST_SCOPE_CHANNEL;
    }

    handle(event: IpcMainEvent, request: IpcRequest): void {
        if (!request.responseChannel) {
            request.responseChannel = `${this.getName()}_response`;
        }

        const results: number[] = [];
        fs.createReadStream('/Users/aidanpetti/Downloads/testdat.csv').pipe(csv())
            .on('data', (data) => results.push(parseInt(data["Max"] as string)))
            .on('end', () => {
                event.sender.send(request.responseChannel, results);
            });
    }
}
