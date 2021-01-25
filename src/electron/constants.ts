import {app, remote} from "electron";

const path = require('path');

const getFileDataPath = (objPath?: string): string => {
    let userDataPath: string;

    try {
        userDataPath = (app || remote.app).getPath('userData');
    } catch (e) {
        throw "can not get app or remote";
    }

    objPath = objPath ?? "";
    console.log(path.join(userDataPath, ...objPath.split('/')));
    return path.join(userDataPath, ...objPath.split('/'));
}

export const blocksDir = getFileDataPath("blocks");
export const getBlockDir = (id: string): string => getFileDataPath(`blocks/${id}`);

