import React, { memo } from 'react'
import { NodeProps } from '@xyflow/react'
import { MousePointerIcon } from 'lucide-react'

import { BaseTriggerNode } from './base-manual-trigger'
import { useNodeStatus } from '@/inngest/hook/use-node-status'
import { fetchManualTriggerToken } from '@/inngest/get-subscribe-token'

export const ManualTrigger = memo((props: NodeProps) => {

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: "manual-trigger-execution",
    topic: "status",
    refreshToken:fetchManualTriggerToken
  })

  return (
    <BaseTriggerNode
      id={props.id}
      status={nodeStatus}
      icon={MousePointerIcon}
      name="Execute Workflow"
      {...props}
    />
  )
})

ManualTrigger.displayName = 'ManualTrigger'
