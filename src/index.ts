import {app, BrowserWindow, IpcMainEvent, ipcMain as ipc} from 'electron';
import installExtension, { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } from 'electron-devtools-installer';
import isDev from 'electron-is-dev';
const path = require('path')
const os = require('os')

import {api} from "./helpers/constants";

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
        app.whenReady().then(() => {
            mainWindow.webContents.openDevTools({mode: 'undocked'});
        });
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
