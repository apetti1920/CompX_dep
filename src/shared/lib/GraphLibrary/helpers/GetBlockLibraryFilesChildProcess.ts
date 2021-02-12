import {BlockStorageType} from "../types/BlockStorage";
import {XmlToBlockStorageType} from "./utils";

const path = require('path');
const fs = require('fs');


process.on("message", (message: any) => {
    process.send(GetBlockLibraryFilesChildProcess(message.blocksDir));
    process.exit()
});

function GetBlockLibraryFilesChildProcess(blocksDir: string): BlockStorageType[] {
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
