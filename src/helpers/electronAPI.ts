import {app, remote, ipcMain, ipcMain as ipc, IpcMainEvent} from 'electron';

import {api, blocksDir} from "./constants";
import {BlockStorageType} from "../lib/GraphLibrary/types/BlockStorage";

const path = require('path');
const fs = require('fs');

export default class electronAPI {
    public getFileDataPath(objPath?: string): string {
        let userDataPath: string;

        try {
            userDataPath = (app || remote.app).getPath('userData');
        } catch (e) {
            throw "can not get app or remote"
        }

        objPath = objPath ?? "";
        return path.join(userDataPath, ...objPath.split('/'));
    }

    public setupIPC(): void {
        ipc.on("block_update", (event: IpcMainEvent) => {
            fs.readdir(api.getFileDataPath("blocks"), (err: any, files: string[]) => {
                if (err) {
                    console.log(err);
                    return;
                }

                const blocks: BlockStorageType[] = [];
                files.forEach(async (file) => {
                    if (file.split(".").pop() === "json") {
                        const pathStr = api.getFileDataPath(`blocks/${file}`);
                        const data = fs.readFileSync(pathStr, {encoding:'utf8', flag:'r'});
                        const jsonData: BlockStorageType = JSON.parse(data);
                        const p = path.join(path.dirname(pathStr), `${jsonData.name}.jpg`);
                        console.log(p);
                        if (fs.existsSync(p)) {
                            jsonData.imgFile = p;
                        } else {
                            jsonData.imgFile = "https://picsum.photos/75"
                        }

                        console.log(jsonData.imgFile);
                        blocks.push(jsonData);
                    }
                });
                event.sender.send('block_update', blocks);
            })
        });
    }
}
