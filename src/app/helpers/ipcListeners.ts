const { ipcRenderer, IpcRendererEvent } = window.require('electron');

export default class IPCListeners {
    constructor() {
        ipcRenderer.on('block-update', (event: typeof IpcRendererEvent, args: any[]) => {
            console.log(args);
        });
    }

    onStart = () => {
        ipcRenderer.send('get-blocks')
    }
}
