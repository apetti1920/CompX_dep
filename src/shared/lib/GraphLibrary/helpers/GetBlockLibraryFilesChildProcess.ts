import {BlockStorageType} from "../types/BlockStorage";

import {parse, validate} from 'fast-xml-parser';
import {XmlToBlockStorageType} from "./utils";

const path = require('path');
const fs = require('fs');
const he = require('he');

process.on("message", (message: any) => {
    process.send(GetBlockLibraryFilesChildProcess(message.blocksDir));
    process.exit()
});

function GetBlockLibraryFilesChildProcess(blocksDir: string): BlockStorageType[] {
    const blocks: BlockStorageType[] = [];
    fs.readdirSync(blocksDir).forEach(async (file: string) => {
        if (file.split(".").pop() === "xml") {
            const pathStr = path.join(blocksDir, file);
            const data = fs.readFileSync(pathStr, {encoding: 'utf8', flag: 'r'});
            if(validate(data) === true) {
                const options = {
                    attributeNamePrefix : "@_",
                    attrNodeName: "@_",
                    textNodeName : "#text",
                    ignoreAttributes : true,
                    ignoreNameSpace : true,
                    allowBooleanAttributes : false,
                    parseNodeValue : false,
                    parseAttributeValue : true,
                    trimValues: true,
                    cdataTagName: false, //default is 'false'
                    cdataPositionChar: "\\c",
                    attrValueProcessor: (a: any) => he.decode(a, {isAttributeValue: true}),//default is a=>a
                    tagValueProcessor : (a: any) => he.decode(a) //default is a=>a
                }
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                const xmlData = parse(data, options);
                const blockStorage = XmlToBlockStorageType(xmlData);
                blocks.push(blockStorage);
            }
        }
    });
    return blocks;
}
