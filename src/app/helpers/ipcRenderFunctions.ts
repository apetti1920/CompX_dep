const { ipcRenderer, IpcRendererEvent } = window.require('electron');

export function setupIPCListeners(): void {
    ipcRenderer.on('block_update', (event: typeof IpcRendererEvent, args: any[]) => {
        console.log(args);
    });
}

export function getBlockUpdate(): void {
    ipcRenderer.send('block_update');
}
