'use client'

import React, { memo } from 'react'
import Image from 'next/image'
import { NodeProps, Position, useReactFlow } from '@xyflow/react'
import { LucideIcon } from 'lucide-react'

import WorkflowNode from './ui/workflow-node'
import { BaseNode, BaseNodeContent } from './base-node'
import { BaseHandle } from './base-handle'
import { useWorkflow } from '@/lib/workflowRouter'
import { useParams } from 'next/navigation'
import { NodeStatus, NodeStatusIndicator } from './node-status-indicator'

interface BaseTriggerProps {
  id: string
  icon: LucideIcon | string
  name: string
  description?: string
  children?: React.ReactNode
  status?: NodeStatus
  onSettings?: () => void
  onDoubleClick?: () => void
}

export const BaseTriggerNode = memo(
  ({
    id,
    icon: Icon,
    name,
    description,
    children,
    status = "initial",
    onSettings,
    onDoubleClick,
  }: BaseTriggerProps) => {

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
        <NodeStatusIndicator className='rounded-l-2xl' status={status} variant="border">
          <BaseNode
            onDoubleClick={onDoubleClick}
            className="relative rounded-l-2xl group"
          >
            <BaseNodeContent>
              {typeof Icon === 'string' ? (
                <Image
                  src={Icon}
                  alt={name}
                  width={16}
                  height={16}
                  className="shrink-0"
                />
              ) : (
                <Icon className="size-4 text-muted-foreground" />
              )}

              {children}

              <BaseHandle
                id="source-1"
                type="source"
                position={Position.Right}
              />
            </BaseNodeContent>
          </BaseNode>
        </NodeStatusIndicator>
      </WorkflowNode>
    )
  }
)
