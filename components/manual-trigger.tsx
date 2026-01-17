import React, { memo } from 'react'
import { NodeProps } from '@xyflow/react'
import { MousePointerIcon } from 'lucide-react'

import { BaseTriggerNode } from './base-trigger'

export const ManualTrigger = memo((props: NodeProps) => {
  return (
    <BaseTriggerNode
      id={props.id}
      icon={MousePointerIcon}
      name="Execute Workflow"
      {...props}
    />
  )
})

ManualTrigger.displayName = 'ManualTrigger'
