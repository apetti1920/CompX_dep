import {BlockStorageType} from "../../shared/lib/GraphLibrary/types/BlockStorage";

const path = require('path');
const fs = require('fs');

process.on("message", (message: any) => {
    process.send(GetBlockLibraryFiles(message.blocksDir));
    process.exit()
});

function GetBlockLibraryFiles(blocksDir: string): BlockStorageType[] {
    const blocks: BlockStorageType[] = [];
    fs.readdirSync(blocksDir).forEach(async (file: string) => {
        if (file.split(".").pop() === "json") {
            const pathStr = path.join(blocksDir, file);
            const data = fs.readFileSync(pathStr, {encoding: 'utf8', flag: 'r'});
            const jsonData: BlockStorageType = JSON.parse(data);
            const p = path.join(path.dirname(pathStr), `${jsonData.name}.jpg`);
            if (fs.existsSync(p)) {
                jsonData.imgFile = p;
            } else {
                jsonData.imgFile = "https://picsum.photos/75"
            }

            blocks.push(jsonData);
        }
    });
    return blocks;
}
