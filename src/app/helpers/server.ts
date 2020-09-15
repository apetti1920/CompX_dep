const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
io.on('connection', () => {
    console.log('a user connected');

    // const g1 = new Graph();
    //
    // const sum = g1.addBlock("sum");
    // const gain0 = g1.addBlock("gain", new Map<string, unknown>([['gainValue', 1]]));
    // const integral1 = g1.addBlock("integral", new Map<string, unknown>([['icValue', 0.0]]));
    // const integral2 = g1.addBlock("integral", new Map<string, unknown>([['icValue', -0.2]]));
    // const dampning = g1.addBlock("gain", new Map<string, unknown>([['gainValue', 0.24]]));
    // const stiffness = g1.addBlock("gain", new Map<string, unknown>([['gainValue', -1.6]]));
    // const scope = g1.addBlock("scope");
    //
    // g1.addEdge(sum, "z", gain0, "x");
    // g1.addEdge(gain0, "z", integral1, "x");
    // g1.addEdge(integral1, "z", integral2, "x");
    // g1.addEdge(integral1, "z", dampning, "x");
    // g1.addEdge(integral2, "z", scope, "x");
    // g1.addEdge(integral2, "z", stiffness, "x");
    // g1.addEdge(dampning, "z", sum, "a");
    // g1.addEdge(stiffness, "z", sum, "b");

    // g1.run(30.0, 0.1)
});

http.listen(3001, () => {
    console.log('listening on *:3001');
});
