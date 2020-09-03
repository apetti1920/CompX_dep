import Graph from "./Graph";

process.on('run', function(g: Graph, t: number, dt: number) {
    console.log("here")
    g.run(t, dt);
});
