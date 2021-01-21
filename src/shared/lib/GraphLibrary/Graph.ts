import { v4 as uuidv4 } from 'uuid';
import path from "path";

import Block from "./Block";
import Edge from "./Edge";
import {findNextOrMissing, Zeros} from "./helpers/utils";
import {BlockStorageType, InternalDataStorageType} from "./types/BlockStorage";
import {EdgeVisualType} from "../../../app/store/types";

const fs = require('fs')


export enum EdgeType {
    TREE,
    BACK,
    FORWARD,
    CROSS
}

enum NodeCompletion {
    WHITE,
    GRAY,
    BLACK
}

class DFSBlock {
    readonly block: Block;
    color: NodeCompletion;
    D: number;
    F: number;

    constructor(block: Block) {
        this.block = block;
        this.color = NodeCompletion.WHITE;
        this.D = -1;
        this.F = -1;
    }
}

class CompBlock {
    readonly block: Block;
    numInputs: number;

    constructor(block: Block) {
        this.block = block;
        this.numInputs = this.block.inputPorts.length;
    }
}

export default class Graph {
    public blocks: Block[];
    public readonly edges: Edge[];
    public filePath: string;

    constructor() {
        this.blocks = [];
        this.edges = [];
        this.filePath = "";
    }

    public getIdFromName(name: string): string {
        return this.blocks.find(b => b.name === name)?.id ?? "";
    }

    public addBlock(block: BlockStorageType): string {
        const b = new Block(block);
        this.blocks.push(b);
        return b.id;
    }

    public addEdge(edge: Edge): string {
        this.edges.push(edge);
        return edge.id;
    }

    public Transpose(): Graph {
        const tempGraph = new Graph();
        tempGraph.blocks = this.blocks;
        this.edges.forEach(e => tempGraph.edges.push(new class implements Edge {
            id = e.id;
            inputBlock = e.outputBlock;
            inputPort = e.outputPort;
            outputBlock = e.inputBlock;
            outputPort = e.inputPort;
        }));
        return tempGraph;
    }

    public getAdjacentBlocks(block: Block): Block[] {
        return this.edges.filter(e => e.outputBlock === block.id)
            .map(e => this.blocks.find(b => b.id === e.inputBlock)!);
    }

    public getSourceBlocks(): Block[] {
        return this.blocks.filter(b => b.inputPorts.length === 0 || b.pseudoSource);
    }

    public getSinkBlocks(): Block[] {
        return this.blocks.filter(b => b.outputPorts.length === 0);
    }

    public toAdjacencyMatrix(): boolean[][] {
        const inputs = this.blocks.flatMap(b => b.inputPorts);
        const outputs = this.blocks.flatMap(b => b.outputPorts);
        const retMatrix = Zeros([inputs.length, outputs.length]);

        for (let o = 0; o < outputs.length; o++) {
            for (let i = 0; i < inputs.length; i++) {
                const edgeOrDefault = this.edges.filter(e => e.outputBlock === outputs[o].parentId &&
                    e.inputBlock === inputs[i].parentId)[0] || null;
                retMatrix[i][o] = edgeOrDefault !== null ? 1 : 0;
            }
        }
        return retMatrix.map(r => r.map(s => s === 1));
    }

    public DFS(startBlock: Block): Block[] {
        const visited: boolean[] = Array(this.blocks.length);

        let dfsutil: { (arg0: Block, arg1: boolean[]): Block[]; (block: Block, tempVistited: boolean[]): Block[]; };
        // eslint-disable-next-line prefer-const
        dfsutil = (block: Block, tempVisited: boolean[]): Block[] => {
            tempVisited[this.blocks.indexOf(block)] = true;
            let retList: Block[] = [];
            retList.push(block);
            this.getAdjacentBlocks(block).forEach(adjBlock => {
                if (!tempVisited[this.blocks.indexOf(adjBlock)]) {
                    retList = retList.concat(dfsutil(adjBlock, tempVisited));
                }
            });
            return retList;
        }

        return dfsutil(startBlock, visited);
    }

    public BFS(startBlock: Block) : Block[] {
        const visited: boolean[] = Array(this.blocks.length);
        const queue: Block[] = [];

        visited[this.blocks.indexOf(startBlock)] = true;
        queue.push(startBlock);

        const retList: Block[] = [];
        while (queue.length > 0) {
            const element = queue.shift()!;
            retList.push(element);
            const neighbors = this.getAdjacentBlocks(element);
            neighbors.forEach(neighbor => {
                const index = this.blocks.indexOf(neighbor);
                if (!visited[index]) {
                    visited[index] = true;
                    queue.push(neighbor)
                }
            })
        }

        return retList;
    }

    public edgeClassifier(): Map<string, EdgeType> {
        const dfsBlocks = this.blocks.map(l => new DFSBlock(l));
        let t = 0;

        let dfsVisit: { (arg0: number): void; (index: number): void; };
        // eslint-disable-next-line prefer-const
        dfsVisit = (index: number) => {
            dfsBlocks[index].color = NodeCompletion.GRAY;
            dfsBlocks[index].D = t;
            t++;

            this.getAdjacentBlocks(dfsBlocks[index].block).map(l => {
                const findIndex = dfsBlocks.find(l2 => l2.block === l)!;
                return dfsBlocks.indexOf(findIndex);
            }).forEach(index2 => {
                if (dfsBlocks[index2].color === NodeCompletion.WHITE) {
                    dfsVisit(index2);
                }
            })

            dfsBlocks[index].color = NodeCompletion.BLACK;
            dfsBlocks[index].F = t;
            t++;
        };

        for (let i=0; i<dfsBlocks.length; i++) {
            if (dfsBlocks[i].color === NodeCompletion.WHITE) {
                dfsVisit(i);
            }
        }

        const retVec = new Map<string, EdgeType>();
        this.edges.forEach(edge => {
            const outBlock = dfsBlocks.find(l => l.block.id === edge.outputBlock)!;
            const inBlock = dfsBlocks.find(l => l.block.id === edge.inputBlock)!;

            if (inBlock.D - outBlock.D === 1 || outBlock.F - inBlock.F == 1) {
                retVec.set(edge.id, EdgeType.TREE);
            } else if (inBlock.D - outBlock.D < 0 && outBlock.F - inBlock.F < 0) {
                retVec.set(edge.id, EdgeType.BACK);
            } else if (inBlock.D - outBlock.D > 0 && outBlock.F - inBlock.F > 0) {
                retVec.set(edge.id, EdgeType.FORWARD);
            } else {
                retVec.set(edge.id, EdgeType.CROSS);
            }
        });

        return retVec;
    }

    public SCC(): Block[][] {
        const l = new Set<DFSBlock>();
        const dfsBlocks = this.blocks.map(b => new DFSBlock(b));
        const retList: Block[][] = [];
        let retIndex = -1;

        let visit: { (arg0: number): void; (index: number): void; };
        // eslint-disable-next-line prefer-const
        visit = (index: number) => {
            if (dfsBlocks[index].color != NodeCompletion.WHITE) return;
            dfsBlocks[index].color = NodeCompletion.GRAY;
            this.getAdjacentBlocks(dfsBlocks[index].block).forEach(v =>
                visit(dfsBlocks.indexOf(dfsBlocks.find(b => b.block == v)!)));
            l.add(dfsBlocks[index])
        };

        let assign: { (arg0: number, arg1: number): void; (uIndex: number, rootIndex: number): void; };
        // eslint-disable-next-line prefer-const
        assign = (uIndex: number, rootIndex: number) => {
            if (dfsBlocks[uIndex].color == NodeCompletion.BLACK) return;
            if (dfsBlocks[uIndex] == dfsBlocks[rootIndex]) {
                retIndex++;
                retList.push([]);
            }

            retList[retIndex].push(dfsBlocks[uIndex].block)
            dfsBlocks[uIndex].color = NodeCompletion.BLACK;

            this.getAdjacentBlocks(dfsBlocks[uIndex].block).map(b =>
                dfsBlocks.indexOf(dfsBlocks.find(b2 => b2.block == b)!)).forEach(v => {
                assign(v, rootIndex);
            });
        };

        for (let u = 0; u < dfsBlocks.length; u++) {
            visit(u);
        }

        [...l].map(b => dfsBlocks.indexOf(b)).forEach(u => assign(u, u))

        return retList;
    }

    public isValidGraph(): boolean {
        const groups = this.SCC();
        const sources = this.getSourceBlocks();
        const sinks = this.getSinkBlocks();

        const reducer = (accumulator: boolean, item: Block[]) => {
            return accumulator && (item.filter(value => sources.concat(...sinks).includes(value)).length > 0);
        };

        return groups.reduce(reducer, true);
    }

    public getCompileOrder(): Block[] {
        const sources = this.getSourceBlocks();
        const compileOrder: Block[] = [];
        const compBlocks = this.blocks.map(l => new CompBlock(l));

        sources.forEach(source => {
            if (!compileOrder.includes(source)) { compileOrder.push(source) }
            this.getAdjacentBlocks(source).flatMap(adjBlock => this.DFS(adjBlock)
                .filter(dfsBlock => !compileOrder.includes(dfsBlock))
                .map(dfsBlock => compBlocks.indexOf(compBlocks.find(l => l.block == dfsBlock)!)))
                .forEach(compIndex => {
                    compBlocks[compIndex].numInputs--;
                    if (compBlocks[compIndex].numInputs == 0) compileOrder.push(compBlocks[compIndex].block);
            })
        })

        return compileOrder;
    }

    public run(T: number, dT: number): void {
        let t = 0.0;
        const compOrder = this.getCompileOrder().map(b => b.id);
        while (t <= T) {
            compOrder.forEach(blockId => {
                const block = this.blocks.find(b => b.id === blockId);

                if (block != undefined) {
                    const prevInputs = block.inputPorts.map(p => p.objectValue);
                    const prevOutputs = block.outputPorts.map(p => p.objectValue);
                    const inputs = block.inputPorts.map(p => {
                        const edge = this.edges.find(e => e.inputBlock == p.parentId && e.inputPort == p.id);

                        if (edge !== undefined) {
                            const outputBlock = this.blocks.find(b => b.id === edge.outputBlock);

                            if (outputBlock != undefined) {
                                const outputPort = outputBlock.outputPorts.find(p => p.id === edge.outputPort);
                                if (outputPort !== undefined) {
                                    return outputPort.objectValue;
                                }
                            }
                        }
                        return null;
                    });

                    for (let i = 0; i < block.inputPorts.length; i++) {
                        block.inputPorts[i].objectValue = inputs[i];
                    }

                    block.compile(t, dT, prevInputs, prevOutputs, inputs);
                }
            });

            t += dT;
        }
    }
}
