import * as path from 'path'
import { v4 as uuidv4 } from 'uuid';

import {XmlToBlockStorageType} from "../helpers/utils";
import Graph from "../Graph";

function getSinSumGraph(): Graph {
    const blockPath = "/Users/aidanpetti/Library/Application Support/compx/app_storage/blocks";

    const g1 = new Graph();

    let b = XmlToBlockStorageType(path.join(blockPath, "sin.xml")); b.id = uuidv4(); const sin1 = g1.addBlock(b); g1.blocks[0].setInternalData("Angular Frequency", 60)
    b = XmlToBlockStorageType(path.join(blockPath, "sin.xml")); b.id = uuidv4(); const sin2 = g1.addBlock(b); g1.blocks[1].setInternalData("Angular Frequency", 40)
    const sum = g1.addBlock(XmlToBlockStorageType(path.join(blockPath, "sum.xml")));
    const scope = g1.addBlock(XmlToBlockStorageType(path.join(blockPath, "scope.xml")));

    g1.addEdge({outputBlockId: sin1, outputPortName: "z", inputBlockId: sum, inputPortName: "a"});
    g1.addEdge({outputBlockId: sin2, outputPortName: "z", inputBlockId: sum, inputPortName: "b"});
    g1.addEdge({outputBlockId: sum, outputPortName: "z", inputBlockId: scope, inputPortName: "x"});

    return g1;
}

test("Test Is Valid Graph", () => {
    const g1 = getSinSumGraph();
    expect(g1.isValidGraph()).toBeTruthy()
});
