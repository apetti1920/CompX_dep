import {app, BrowserWindow, ipcMain, session} from 'electron';
import {SystemInfoChannel} from "./IPC/Channels/SystemInfoChannel";
import isDev from 'electron-is-dev';
import {IpcChannelInterface} from "./IPC/Channels/IpcChannelInterface";
import {BlockLibraryChannel} from "./IPC/Channels/BlockLibraryChannel";
import {RunModelChannel} from "./IPC/Channels/RunModelChannel";
import {TestScopeChannel} from "./IPC/Channels/TestScopeChannel";

const path = require('path')
const os = require('os')

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
            width: 1000,
            height: 750,
            icon: __dirname + "/logo.ico",
            webPreferences: {
                nodeIntegration: true
            }
        });

        this.mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY).then(() => { // MAIN_WINDOW_WEBPACK_ENTRY
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
    new SystemInfoChannel(),
    new BlockLibraryChannel(),
    new RunModelChannel(),
    new TestScopeChannel()
]);
