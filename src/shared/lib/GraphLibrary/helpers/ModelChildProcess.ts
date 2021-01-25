import {Edge, Graph} from "../index";
import {BlockStorageType} from "../types/BlockStorage";

process.on("message", (message: any) => {
    const visualGraph: {blocks: BlockStorageType[], edges: Edge[]} = message.visualGraph;

    const g1 = new Graph();
    visualGraph.blocks.forEach((block: BlockStorageType) => {
        g1.addBlock(block);
    });

    visualGraph.edges.forEach((edge: Edge) => {
        g1.addEdge(edge);
    });

    if (g1.isValidGraph()) {
        g1.run(50, 0.01, process);
    } else {
        console.log("Not a Valid Graph");
    }

    process.exit()
});
