'use client'

import { NodeProps, Position, useReactFlow } from '@xyflow/react'
import { Icon, LucideIcon } from 'lucide-react'
import React, { memo, useState } from 'react'
import WorkflowNode from './ui/workflow-node'
import { BaseNode, BaseNodeContent } from './base-node'
import { BaseHandle } from './base-handle'
import Image from 'next/image'
import { useWorkflow } from '@/lib/workflowRouter'
import { de, se } from 'date-fns/locale'
import { useParams } from 'next/navigation'
import { NodeStatus, NodeStatusIndicator } from './node-status-indicator'

interface BaseExecutionProps {
    id: string
    icon: LucideIcon | string
    name: string
    description: string
    children?: React.ReactNode
    status?: NodeStatus
    onSettings?: () => void
    onDoubleClick?: () => void
}

export const BaseExecutionNode = memo(
    ({
        id,
        icon: Icon,
        name,
        description,
        children,
        status = "initial",
        onSettings,
        onDoubleClick,

    }: BaseExecutionProps) => {

        const { deleteNode, getOneWorkflow } = useWorkflow()

        const params = useParams();
        const workflowId = params.workflowId as string;
        const { data } = getOneWorkflow(workflowId);



        const { getNodes, setNodes } = useReactFlow()
        const nodes = getNodes()

        const handleDelete = () => {

            if (!data) return;
            if (data.node.some((n: NodeProps) => n.id === id)) {
                deleteNode.mutate(id)
            } else {
                setNodes(nodes.filter((n) => n.id !== id))
            }
        }

        return (
            <WorkflowNode
                name={name}
                description={description}
                onDelete={handleDelete}
                onSettings={onSettings}

            >
                <NodeStatusIndicator status={status} variant="border">
                    <BaseNode onDoubleClick={onDoubleClick}>
                        <BaseNodeContent>
                            {
                                typeof Icon === 'string' ? (
                                    <Image
                                        src={Icon}
                                        alt={name}
                                        width={16}
                                        height={16}
                                    />
                                ) : (
                                    <Icon className="size-4 text-muted-foreground" />
                                )
                            }
                            {children}

                            <BaseHandle
                                id='target-1'
                                type='target'
                                position={Position.Left}
                            />
                            <BaseHandle
                                id='source-1'
                                type='source'
                                position={Position.Right}
                            />
                        </BaseNodeContent>
                    </BaseNode>
                </NodeStatusIndicator>

            </WorkflowNode>
        )
    }

)


BaseExecutionNode.displayName = 'BaseExecutionNode';