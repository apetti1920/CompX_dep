import * as path from 'path';
import * as fs from 'fs';
import fetch from "node-fetch";

import {BlockStorageType, XmlToBlockStorageType, FileSystemInfoJsonType, FileInfoJsonType} from "@compx/sharedtypes";


process.on("message", async (message: any) => {
    if (process.send !== undefined) {
        console.log(message)
        const blocks = await GetBlockLibraryFilesChildProcess(message.blocksDir);
        process.send(blocks);
        process.exit();
    }
});

async function GetBlockLibraryFilesChildProcess(blocksDir: string): Promise<BlockStorageType[]> {
    if (fs.existsSync(blocksDir)) {
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
    } else {
        console.log(blocksDir, " does not exist");
        // const response = await fetch('http://localhost:1234');
        // const json: FileSystemInfoJsonType = await response.json();
        //
        // json.blocks.forEach((block: FileInfoJsonType) => {
        //     fs.access(`${blocksDir}/${block.checkSum}.xml`, fs.constants.R_OK, err => {
        //         if (err) {
        //             throw
        //         }
        //         console.log(`${blocksDir}/${block.checkSum}.xml ${exists?"Exists":"Doesnt Exist"}`);
        //     })
        // })

        // Promise.all(promises).then((content: BlockStorageType[]) => {
        //     console.log(JSON.stringify({"blocks": content}));
        // })

        return [];
    }
}
