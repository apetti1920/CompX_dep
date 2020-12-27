import {TEST_SCOPE_CHANNEL} from "../../../shared/Channels";
import csv = require('csv-parser');
import * as fs from 'fs';

type d = {
    Date: string,
    Max: number,
    Min: number
}

export class TestScopeChannel implements IpcChannelInterface {
    getName(): string {
        return TEST_SCOPE_CHANNEL;
    }

    handle(event: IpcMainEvent, request: IpcRequest): void {
        if (!request.responseChannel) {
            request.responseChannel = `${this.getName()}_response`;
        }

        const results: d[] = [];
        fs.createReadStream('/Users/aidanpetti/Downloads/testdat.csv').pipe(csv())
            .on('data', (data) => results.push({Date: data["Date"] as string, Max: parseInt(data["Max"] as string), Min: parseInt(data["Min"] as string)}))
            .on('end', () => {
                event.sender.send(request.responseChannel, results);

            });
    }
}
