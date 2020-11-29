import Graph, {EdgeType} from "../Graph";

test("Test Get Sources", () => {
    const g1 = TestUtils.getGraph();
    const sources = g1.getSourceBlocks().map(b => b.name);

    expect(sources).toContain("constant_0");
    expect(sources).toContain("integral_0");
    expect(sources).toContain("integral_1");
    expect(sources.length).toBe(3);
});

test("Test Get Adjacency Matrix", () => {
    const g1 = TestUtils.getGraph();
    expect(g1.toAdjacencyMatrix().length === g1.blocks.flatMap(b => b.inputPorts).length);
    expect(g1.toAdjacencyMatrix()[0].length === g1.blocks.flatMap(b => b.outputPorts).length);
})

test("Test Get Adjacent Blocks", () => {
    const g1 = TestUtils.getGraph();
    const adjBlocks = g1.getAdjacentBlocks(g1.blocks[2]).map(b => b.name);
    expect(adjBlocks).toContain("integral_1");
    expect(adjBlocks).toContain("gain_0");
})

test("Test DFS", () => {
    const g1 = TestUtils.getGraph();
    const dfs = g1.DFS(g1.blocks[0]).map(b => b.id);
    expect(dfs[0]).toBe(g1.blocks[0].id);
    expect(dfs[1]).toBe(g1.blocks[1].id);
    expect(dfs[2]).toBe(g1.blocks[2].id);
    expect(dfs[3]).toBe(g1.blocks[3].id);
    expect(dfs[4]).toBe(g1.blocks[6].id);
    expect(dfs[5]).toBe(g1.blocks[5].id);
    expect(dfs[6]).toBe(g1.blocks[4].id);
});

test("Test Edge Classifier", () => {
    const g1 = TestUtils.getGraph();
    const edgesClassifiers = g1.edgeClassifier();
    expect(edgesClassifiers.get(g1.edges.find(e => e.outputBlock === g1.getIdFromName("gain_0") &&
        e.inputBlock === g1.getIdFromName("sum_0"))!.id)).toBe(EdgeType.BACK);
    expect(edgesClassifiers.get(g1.edges.find(e => e.outputBlock === g1.getIdFromName("gain_1") &&
        e.inputBlock === g1.getIdFromName("sum_0"))!.id)).toBe(EdgeType.BACK);
});

test("Test SCC", () => {
    const g = TestUtils.getGraph();
    const scc = g.SCC();
    const a = scc.map(l => l.map(l2 => l2.name));

    expect(a[0]).toContain("scope_0");
    expect(a[1]).toContain("gain_1");
    expect(a[1]).toContain("integral_0");
    expect(a[1]).toContain("integral_1");
    expect(a[1]).toContain("gain_0");
    expect(a[1]).toContain("sum_0");
    expect(a[2]).toContain("constant_0");
});

test("Is Valid Graph", () => {
    const g = TestUtils.getGraph();
    expect(g.isValidGraph()).toBe(true);
});

test("Test Compile Order", () => {
    const g = TestUtils.getGraph();
    const compOrder = g.getCompileOrder().map(l => l.name);

    expect(compOrder.slice(0, 3)).toContain("constant_0");
    expect(compOrder.slice(0, 3)).toContain("integral_0");
    expect(compOrder.slice(0, 3)).toContain("integral_1");
    expect(compOrder.slice(3, 6)).toContain("scope_0");
    expect(compOrder.slice(3, 6)).toContain("gain_0");
    expect(compOrder.slice(3, 6)).toContain("gain_1");
    expect(compOrder[6]).toBe("sum_0");
});

test("Test Run", () => {
    const g = TestUtils.getGraphMassSpringDamper();
    g.run(30.0, 0.1);
});

class TestUtils {
    public static getGraph(): Graph {
        const g1 = new Graph(true);

        const constant = g1.addBlockByName("constant", new Map<string, unknown>([['constantValue', -9.8]]));
        const sum = g1.addBlockByName("sum");
        const integral1 = g1.addBlockByName("integral");
        const integral2 = g1.addBlockByName("integral");
        const gain1 = g1.addBlockByName("gain", new Map<string, unknown>([['gainValue', 5]]));
        const gain2 = g1.addBlockByName("gain", new Map<string, unknown>([['gainValue', 1]]));
        const scope = g1.addBlockByName("scope");

        g1.addEdge(constant, "z", sum, "w");
        g1.addEdge(sum, "z", integral1, "x");
        g1.addEdge(integral1, "z", integral2, "x");
        g1.addEdge(integral1, "z", gain1, "x");
        g1.addEdge(integral2, "z", scope, "x");
        g1.addEdge(integral2, "z", gain2, "x");
        g1.addEdge(gain1, "z", sum, "a");
        g1.addEdge(gain2, "z", sum, "b");

        return g1;
    }

    public static getGraphMassSpringDamper(): Graph {
        const g1 = new Graph(true);

        const sum = g1.addBlockByName("sum");
        const gain0 = g1.addBlockByName("gain", new Map<string, unknown>([['gainValue', 1]]));
        const integral1 = g1.addBlockByName("integral", new Map<string, unknown>([['icValue', 0.0]]));
        const integral2 = g1.addBlockByName("integral", new Map<string, unknown>([['icValue', -0.2]]));
        const dampning = g1.addBlockByName("gain", new Map<string, unknown>([['gainValue', 0.24]]));
        const stiffness = g1.addBlockByName("gain", new Map<string, unknown>([['gainValue', -1.6]]));
        const scope = g1.addBlockByName("scope");

        g1.addEdge(sum, "z", gain0, "x");
        g1.addEdge(gain0, "z", integral1, "x");
        g1.addEdge(integral1, "z", integral2, "x");
        g1.addEdge(integral1, "z", dampning, "x");
        g1.addEdge(integral2, "z", scope, "x");
        g1.addEdge(integral2, "z", stiffness, "x");
        g1.addEdge(dampning, "z", sum, "a");
        g1.addEdge(stiffness, "z", sum, "b");

        return g1;
    }

    public static getSimpleGraph(): Graph {
        const g = new Graph(true);
        const const1 = g.addBlockByName("constant", new Map<string, unknown>([['constantValue', 1/10]]));
        const gain = g.addBlockByName("gain", new Map<string, unknown>([['gainValue', 1/10]]));
        const sum = g.addBlockByName("sum");
        const integral = g.addBlockByName("integral", new Map<string, unknown>([['icValue', 0]]))
        const gain2 = g.addBlockByName("gain", new Map<string, unknown>([['gainValue', -1/5]]))
        const scope = g.addBlockByName("scope");

        g.addEdge(const1, "z", gain, "x");
        g.addEdge(gain, "z", sum, "x");
        g.addEdge(sum, "z", integral, "x");
        g.addEdge(integral, "z", scope, "x");
        g.addEdge(integral, "z", gain2, "a");
        g.addEdge(gain2, "z", sum, "b");
        return g
    }

    public static getSinGraph(): Graph {
        const g = new Graph(true);
        const sin = g.addBlockByName("sin");
        const scope = g.addBlockByName("scope");

        g.addEdge(sin, "z", scope, "x");
        return g;
    }
}
