import {UpdatedBlockLibraryActionType} from "../store/actions/actionTypes";

const { ipcRenderer, IpcRendererEvent } = window.require('electron');

import store from '../../app/store'
import {BlockStorageType} from "../../lib/GraphLibrary/types/BlockStorage";
import {GraphVisualType} from "../store/types/graphTypes";

export function setupIPCListeners(): void {
    ipcRenderer.on('block_update', (event: typeof IpcRendererEvent, args: BlockStorageType[]) => {
        store.dispatch({type: UpdatedBlockLibraryActionType, payload: args})
    });
}

export function removeIPCListeners(): void {
    ipcRenderer.removeAllListeners();
}

export function getBlockUpdate(): void {
    ipcRenderer.send('block_update');
}

export function runModel(model: GraphVisualType): void {
    ipcRenderer.send('run_model', model);
}
