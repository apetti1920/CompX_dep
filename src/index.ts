import {app, BrowserWindow, IpcMainEvent} from 'electron';
import {disableZoom} from "electron-util";
import Graph from "./lib/GraphLibrary/Graph";
const ipc = require('electron').ipcMain;

const isDev = require('electron-is-dev');
const cp = require('child_process');

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
    disableZoom(mainWindow);
  });

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  ipc.on("run", (event: IpcMainEvent) => {
    const g1 = new Graph();

    const sum = g1.addBlock("sum");
    const gain0 = g1.addBlock("gain", new Map<string, unknown>([['gainValue', 1]]));
    const integral1 = g1.addBlock("integral", new Map<string, unknown>([['icValue', 0.0]]));
    const integral2 = g1.addBlock("integral", new Map<string, unknown>([['icValue', -0.2]]));
    const dampning = g1.addBlock("gain", new Map<string, unknown>([['gainValue', 0.24]]));
    const stiffness = g1.addBlock("gain", new Map<string, unknown>([['gainValue', -1.6]]));
    const scope = g1.addBlock("scope");

    g1.addEdge(sum, "z", gain0, "x");
    g1.addEdge(gain0, "z", integral1, "x");
    g1.addEdge(integral1, "z", integral2, "x");
    g1.addEdge(integral1, "z", dampning, "x");
    g1.addEdge(integral2, "z", scope, "x");
    g1.addEdge(integral2, "z", stiffness, "x");
    g1.addEdge(dampning, "z", sum, "a");
    g1.addEdge(stiffness, "z", sum, "b");

    const child = cp.fork();
    child.send('Please up-case this string');
    event.sender.send("reply", g1.getCompileOrder().map(b => b.name));
  })
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
