import {app, BrowserWindow, ipcMain, session} from 'electron';
import {SystemInfoChannel} from "./IPC/SystemInfoChannel";
import isDev from 'electron-is-dev';
const path = require('path')
const os = require('os')

import {api} from "./constants";
import {IpcChannelInterface} from "./IPC/IpcChannelInterface";

declare const MAIN_WINDOW_WEBPACK_ENTRY: never;

class Main {
    private mainWindow: BrowserWindow;

    public init(ipcChannels: IpcChannelInterface[]) {
        // Handle creating/removing shortcuts on Windows when installing/uninstalling.
        if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
            app.quit();
        }

        app.on('ready', this.onCreateWindow);
        app.on('window-all-closed', Main.onCloseWindow);
        app.on('activate', this.onActivateWindow);

        this.registerIpcChannels(ipcChannels);
    }

    private onCreateWindow() {
        // Create the browser window.
        this.mainWindow = new BrowserWindow({
            height: 600,
            width: 800,
            webPreferences: {
                nodeIntegration: true
            }
        });

        this.mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY).then(() => {
            // disableZoom(mainWindow);
        });

        if (isDev) {
            app.whenReady().then(() => {
                import('react-devtools-electron');
                //console.log("dirname", path.join(__dirname, 'react-devtools'));
                session.defaultSession.loadExtension(
                    path.join(os.homedir(), '/Library/Application Support/Google/Chrome/Default/Extensions/lmhkpmbekcpmknklioeibfkpmmfibljd/2.17.0_0')
                ).catch((err) => console.log("An error occurred: ", err))
                this.mainWindow.webContents.openDevTools({mode: 'undocked'});
            });
        }

        api.setupIPC();
    }
    private static onCloseWindow() {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    }
    private onActivateWindow() {
        if (BrowserWindow.getAllWindows().length === 0 || !this.mainWindow) {
            this.onCreateWindow();
        }
    }
    private registerIpcChannels(ipcChannels: IpcChannelInterface[]) {
        ipcChannels.forEach(channel => ipcMain.on(channel.getName(), (event, request) => channel.handle(event, request)));
    }
}

(new Main()).init([
    new SystemInfoChannel()
]);
