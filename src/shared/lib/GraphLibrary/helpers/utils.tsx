import {BlockStorageType, InternalDataStorageType, PortStorageType} from "../types/BlockStorage";
import {parse, validate} from "fast-xml-parser";
import * as fs from "fs";
import * as he from 'he';
import * as ts from 'typescript';


const options = {
    "compilerOptions": {
        "target": "es5", // Specify ECMAScript target version
        "lib": [
            "dom",
            "dom.iterable",
            "esnext"
        ], // List of library files to be included in the compilation
        "allowJs": true, // Allow JavaScript files to be compiled
        "skipLibCheck": true, // Skip type checking of all declaration files
        "esModuleInterop": true, // Disables namespace imports (import * as fs from "fs") and enables CJS/AMD/UMD style imports (import fs from "fs")
        "allowSyntheticDefaultImports": true, // Allow default imports from modules with no default export
        "strict": true, // Enable all strict type checking options
        "forceConsistentCasingInFileNames": true, // Disallow inconsistently-cased references to the same file.
        "module": "esnext", // Specify module code generation
        "moduleResolution": "node", // Resolve modules using Node.js style
        "noImplicitUseStrict": true,
        "isolatedModules": true, // Unconditionally emit imports for unresolved files
        "resolveJsonModule": true, // Include modules imported with .json extension
        "removeComments": true,
        "noEmit": true, // Do not emit output (meaning do not compile code, only perform type checking)
        "jsx": "react", // Support JSX in .tsx files
        "sourceMap": true, // Generate corrresponding .map file
        "declaration": true, // Generate corresponding .d.ts file
        "noUnusedLocals": true, // Report errors on unused locals
        "noUnusedParameters": true, // Report errors on unused parameters
        "incremental": true, // Enable incremental compilation by reading/writing information from prior compilations to a file on disk
        "noFallthroughCasesInSwitch": true // Report errors for fallthrough cases in switch statement
    },
    "include": [
        "src/**/*" // *** The files TypeScript should type check ***
    ],
    "exclude": ["node_modules", "build"] // *** The files to not type check ***
}

export function Zeros(dimensions: number[]): number[][] {
    const array: number[][] = [];

    for (let i = 0; i < dimensions[0]; i++) {
        array[i] = []
        for (let j = 0; j < dimensions[1]; j++) {
            array[i][j] = 0;
        }
    }

    return array;
}

export function findNextOrMissing(numberList: number[]): number {
    numberList.sort();
    for (let i=0; i<Math.max(...numberList); i++) {
        if (numberList[i] !== i) {
            return i;
        }
    }
    return numberList.length;
}

export function TranspileCode(code: string): string {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return ts.transpileModule(code, options).outputText;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function XmlToBlockStorageType(xmlPath: any): BlockStorageType {
    const data = fs.readFileSync(xmlPath, {encoding: 'utf8', flag: 'r'});
    if(validate(data) !== true) {
        throw TypeError("Not Valid XML");
    }

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

    let xml;
    try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        xml = parse(data, options);
    } catch (e) {
        throw TypeError("Could not Parse");
    }

    let tags: string[] = [];
    if (typeof xml['block']['tags'] !== 'undefined') {
        if(typeof xml['block']['tags']['tag'].map === 'function') {
            tags = xml['block']['tags']['tag'];
        } else {
            if (typeof xml['block']['tags']['tag'] === 'string') {
                tags.push(xml['block']['tags']['tag'])
            }
        }
    }

    let internalData: InternalDataStorageType[] = [];
    if (typeof xml['block']['internalData'] !== "undefined") {
        if(typeof xml['block']['internalData']['data'].map === 'function') {
            internalData = xml['block']['internalData']['data'].map((b: any): InternalDataStorageType => {
                const id = b['id'] ?? b['name'].toLowerCase();
                return {
                    id: id,
                    name: b['name'],
                    type: b['type'],
                    value: b['value']
                }
            })
        } else {
            if (typeof xml['block']['internalData']['data'] !== "undefined") {
                const id = xml['block']['internalData']['data']['id'] !== undefined ?
                    xml['block']['internalData']['data']['id'] :
                    xml['block']['internalData']['data']['name'].toLowerCase();
                internalData.push({
                    id: id,
                    name: xml['block']['internalData']['data']['name'],
                    type: xml['block']['internalData']['data']['type'],
                    value: xml['block']['internalData']['data']['value']
                });
            }
        }
    }

    let inputPorts: PortStorageType[] = [];
    if (typeof xml['block']['inputPorts'] !== 'undefined') {
        if (typeof xml['block']['inputPorts']['port'].map === 'function') {
            inputPorts = xml['block']['inputPorts']['port'].map((b: any): PortStorageType => {
                return {
                    id: b['id'],
                    name: b['name'],
                    type: b['type']
                }
            });
        } else {
            if (typeof xml['block']['inputPorts']['port'] !== "undefined") {
                inputPorts.push({
                    id: xml['block']['inputPorts']['port']['id'],
                    name: xml['block']['inputPorts']['port']['name'],
                    type: xml['block']['inputPorts']['port']['type']
                });
            }
        }
    }

    let outputPorts: PortStorageType[] = [];
    if (typeof xml['block']['outputPorts'] !== 'undefined') {
        if (typeof xml['block']['outputPorts']['port'].map === 'function') {
            outputPorts = xml['block']['outputPorts']['port'].map((b: any): PortStorageType => {
                return {
                    id: b['id'],
                    name: b['name'],
                    type: b['type']
                }
            });
        } else {
            if (typeof xml['block']['outputPorts']['port'] !== "undefined") {
                outputPorts.push({
                    id: xml['block']['outputPorts']['port']['id'],
                    name: xml['block']['outputPorts']['port']['name'],
                    type: xml['block']['outputPorts']['port']['type']
                });
            }
        }
    }

    let display: ({displayStatic?: string, displayDynamic?: string} | undefined) = undefined;
    if (typeof xml['block']['display'] !== 'undefined' &&
        typeof xml['block']['display']['displayStaticPath'] !== 'undefined')
    {
        display = {displayStatic: undefined, displayDynamic: undefined};
        display.displayStatic = TranspileCode(xml['block']['display']['displayStaticPath']);
    }

    if (typeof xml['block']['display'] !== 'undefined' &&
        typeof xml['block']['display']['displayDynamicPath'] !== 'undefined' && display !== null)
    {
        if (display === undefined) { display = {displayStatic: undefined, displayDynamic: undefined}; }
        display.displayDynamic = TranspileCode(xml['block']['display']['displayDynamicPath']);
    }

    return {
        id: xml['block']['id'],
        version: {
            major: +xml['block']['version']['major'], technical: +xml['block']['version']['technical'],
            editorial: +xml['block']['version']['editorial'], letter: xml['block']['version']['letter']
        },
        thumbnail: xml['block']['thumbnail'],
        name: xml['block']['name'],
        description: xml['block']['description'],
        tags: tags,
        display: display,
        internalData: internalData,
        inputPorts: inputPorts,
        outputPorts: outputPorts,
        pseudoSource: xml['block']['pseudoSource'],
        callback: xml['block']['callback']
    };
}
