import {app, BrowserWindow, IpcMainEvent, ipcMain as ipc} from 'electron';
import fs from "fs";
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

    api.setupIPC();
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
