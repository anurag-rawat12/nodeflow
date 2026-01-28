import { Connection, node, NodeType } from "@/app/generated/prisma/client";
import { anthropicExecutor, geminiExecutor, googleFormTriggerExecutor, grokExecutor, httpTriggerExecutor, manualTriggerExecutor, openAIExecutor } from "@/lib/executor";
import toposort from "toposort";

export const topologicalSort = (
    nodes: node[],
    connections: Connection[]
): node[] => {

    if (connections.length === 0) {
        return nodes;
    }

    const edges: [string, string][] = connections.map((conn) =>
        [conn.fromNodeId,
        conn.toNodeId]
    );

    const connectedNodeIds = new Set<string>();
    connections.forEach((conn) => {
        connectedNodeIds.add(conn.fromNodeId);
        connectedNodeIds.add(conn.toNodeId);
    });

    for (const node of nodes) {
        if (!connectedNodeIds.has(node.id)) {
            edges.push([node.id, node.id]);
        }
    }


    let sortedNodeIds: string[];
    try {
        sortedNodeIds = toposort(edges);
        sortedNodeIds = [...new Set(sortedNodeIds)];
    } catch (error) {
        if (error instanceof Error && error.message.includes("Cyclic")) {
            throw new Error("Cyclic dependency detected in workflow nodes");
        }
        throw error
    }

    const nodeMap = new Map(nodes.map((n) => [n.id, n]));

    return sortedNodeIds.map((id) => nodeMap.get(id)!)

}

export const executorRegistry: any = {
    [NodeType.MANUAL_TRIGGER]: manualTriggerExecutor,
    [NodeType.HTTP_REQUEST]: httpTriggerExecutor,
    [NodeType.GOOGLE_FORM_TRIGGER]: googleFormTriggerExecutor,
    [NodeType.GEMINI]: geminiExecutor,
    [NodeType.ANTHROPIC]: anthropicExecutor,
    [NodeType.OPENAI]: openAIExecutor,
    [NodeType.GROK]: grokExecutor,
};

export const getExecutor = (type: NodeType) => {
    const executor = executorRegistry[type];

    if (!executor) {
        throw new Error(`No executor found for node type: ${type}`);
    }

    return executor;
};
