import {Edge, Graph} from "../index";
import {BlockStorageType} from "../types/BlockStorage";

process.on("message", (message: any) => {
    console.log("runtime3", message);
    const visualGraph: {blocks: BlockStorageType[], edges: Edge[]} = message.visualGraph;

    const g1 = new Graph();
    visualGraph.blocks.forEach((block: BlockStorageType) => {
        g1.addBlock(block);
    });

    visualGraph.edges.forEach((edge: Edge) => {
        g1.addEdge(edge);
    });

    if (g1.isValidGraph()) {
        process.send({cmd: "run_progress", data: {progress: "starting"}});
        g1.run(message.settings.runTime, 0.1, process);
        process.send({cmd: "run_progress", data: {progress: "finished"}});

    } else {
        process.send({cmd: "run_progress", data: {error: "Not a valid Graph"}});
    }

    process.exit()
});
