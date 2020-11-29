import path from "path";

import Block from "../Block";

let block: Block;

beforeEach(() => {
    block = new Block(path.resolve(__dirname, 'test_blocks', 'sum2.json'));
})

test('Port Type Test', () => {
    expect(() => {
        block.inputPorts[0].objectValue = 1.0;
    }).not.toThrow();
    expect(() => {
        block.inputPorts[0].objectValue = "test";
    }).toThrow();
});
