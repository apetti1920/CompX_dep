import {app, BrowserWindow, IpcMainEvent} from 'electron';
import fs from "fs";
import {ipcMain as ipc} from 'electron';
import isDev from 'electron-is-dev';

import {api} from "./helpers/constants";
import {BlockStorageType} from "./lib/GraphLibrary/types/BlockStorage";

declare const MAIN_WINDOW_WEBPACK_ENTRY: never;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
    app.quit();
}

const createWindow = (): void => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        height: 600,
        width: 800,
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY).then(() => {
        // disableZoom(mainWindow);
    });

    if (isDev) {
        mainWindow.webContents.openDevTools({mode: 'undocked'});
        // app.whenReady().then(() => {
        //   installExtension([REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS])
        //       .then((name) => console.log(`Added Extension:  ${name}`))
        //       .catch((err) => console.log('An error occurred: ', err));
        // });
    }

    ipc.on("block_update", (event: IpcMainEvent) => {
        fs.readdir(api.getFileDataPath("blocks"), (err, files) => {
            if (err) {
                console.log(err);
                return;
            }

            const blocks: BlockStorageType[] = [];
            files.forEach((file) => {
                if (file.split(".").pop() === "json") {
                    const path = api.getFileDataPath(`blocks/${file}`);
                    const data = fs.readFileSync(path, {encoding:'utf8', flag:'r'});
                    const jsonData: BlockStorageType = JSON.parse(data);
                    blocks.push(jsonData);
                }
            });
            event.sender.send('block_update', blocks);
        })
    });
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
