import * as path from 'path';
import * as fs from 'fs';

import {BlockStorageType} from "../types/BlockStorage";
import {XmlToBlockStorageType} from "./utils";
import {AxiosResponse} from "axios";

const axios = require("axios");


const makeRequest = async (url: string) => {
    try {
        const response = await axios.get(url);
        if (response.status === 200) { // response - object, eg { status: 200, message: 'OK' }
            console.log('success stuff');
            return true;
        }
        return false;
    } catch (err) {
        console.error(err)
        return false;
    }
}


process.on("message", (message: any) => {
    process.send(GetBlockLibraryFilesChildProcess(message.blocksDir));
    process.exit()
});

function GetBlockLibraryFilesChildProcess(blocksDir: string): BlockStorageType[] {
    console.log("heeeeeeere3");

    axios.get('https://api.github.com/users/github')
        .then(function (response: AxiosResponse<any>) {
            console.log("respppp", response);
        })
        .catch(function (error: any) {
            console.log("errrrr", error);
        })


    const blocks: BlockStorageType[] = [];
    fs.readdirSync(blocksDir).forEach((file: string) => {
        if (file.split(".").pop() === "xml") {
            try {
                const block = XmlToBlockStorageType(path.join(blocksDir, file));
                blocks.push(block);
            } catch (e) {
                console.log(e);
            }
        }
    });
    return blocks;
}
