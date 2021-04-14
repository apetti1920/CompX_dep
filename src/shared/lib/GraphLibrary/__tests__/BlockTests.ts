// const path = require('path')
//
// import Block from "../Block";
//
// let block: Block;
//
// beforeEach(() => {
//     block = new Block(path.resolve(__dirname, 'test_blocks', 'constant.json'));
// });
//
// test("Block From File", () => {
//     expect(block.inputPorts.length).toBe(0);
//     expect(block.outputPorts.length).toBe(1);
//     expect(block.pseudoSource).toBe(false);
// });
//
// test("Test Callback", () => {
//     block.internalData.push({name: "constantValue", type: "number", value: 5});
//     const ans = block.callback(0.0, 0.01, [], [], []);
//     expect(ans[0]).toBe(5);
// })
