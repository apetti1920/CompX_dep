import { app, remote, ipcMain } from 'electron';
import {blocksDir} from "./constants";

const path = require('path');
const fs = require('fs');

export default class electronAPI {
    private readonly userDataPath: string;

    constructor() {
        try {
            this.userDataPath = (app || remote.app).getPath('userData');
        } catch (e) {
            this.userDataPath = "";
        }
    }

    public getFileDataPath(objPath: string): string {
        return path.join(this.userDataPath, ...objPath.split('/'));
    }

    public setupIPC(): void {
        ipcMain.on('get-blocks', (event, any) => {
            // fetch blocks
            fs.readdir(blocksDir, (err: any, files: string | any[]) => {
                event.reply('block-update', {numFiles: files.length})
            });
        });
    }
}
