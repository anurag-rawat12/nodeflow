'use client';
import { useState, useCallback, useEffect } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Node, Edge, NodeChange, EdgeChange, Connection, Background, Controls, MiniMap, Panel } from '@xyflow/react';
import { useWorkflow } from '@/lib/workflowRouter';
import NavigationHeader from './navigation';
import Loader from './Loader';

import '@xyflow/react/dist/style.css';
import { nodeComponents } from '../node-components';
import { AddNodeButton } from '../add-node-button';


const WorkflowDetails = ({ workflowId }: { workflowId: string }) => {

    const { getOneWorkflow, updateNameWorkflow } = useWorkflow();
    const { data, isLoading } = getOneWorkflow(workflowId);


    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);

    useEffect(() => {
        if (!data) return;

        setNodes(data.node);
        setEdges(data.edges);
    }, [data]);


    const onNodesChange = useCallback(
        (changes: NodeChange[]) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
        [],
    );
    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
        [],
    );
    const onConnect = useCallback(
        (params: Connection) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
        [],
    );

    return (
        isLoading ? <Loader /> :
            <div className="flex flex-col h-[95vh]">
                <NavigationHeader
                    onSave={(newName) => {
                        updateNameWorkflow.mutate({ name: newName, workflowId });
                    }}
                    root="workflow"
                    data={data.name}
                />

                <div className="flex-1">
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        fitView
                        nodeTypes={nodeComponents}
                    >
                        <Background />
                        <Controls />
                        <MiniMap />
                        <Panel position="top-right">
                            <AddNodeButton />
                        </Panel>
                    </ReactFlow>
                </div>
            </div>
    )
}

export default WorkflowDetails