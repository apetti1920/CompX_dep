import {Edge, Graph} from "./index";
import {BlockStorageType} from "./types/BlockStorage";

process.on("message", (message: any) => {
    const visualGraph: {blocks: BlockStorageType[], edges: Edge[]} = message.visualGraph;

    const g1 = new Graph();
    visualGraph.blocks.forEach((block: BlockStorageType) => {
        g1.addBlock(block);
    });


    visualGraph.edges.forEach((edge: Edge) => {
        g1.addEdge(edge.outputBlock, edge.outputPort, edge.inputBlock, edge.inputPort)
    });

    console.log(g1);
    console.log(g1.isValidGraph())
    if (g1.isValidGraph()) {
        g1.run(10, 0.01);
    } else {
        console.log("fuck");
    }
    process.send("here3");
    process.exit()
});
