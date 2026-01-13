'use client'

import type { NodeProps } from "@xyflow/react"
import { PlusIcon } from "lucide-react"
import { memo, useState } from "react"
import { PlaceholderNode } from "../placeholder-node"
import WorkflowNode from "./workflow-node"
import { NodeSelector } from "../node-selector"

export const InitialNode = memo((props: NodeProps) => {

  const [selector, setselector] = useState(false)
  return (
    <NodeSelector
      open={selector}
      onOpenChange={setselector}
    >
      <WorkflowNode showToolbar={false}>
        <PlaceholderNode
          {...props}
          onClick={() => { setselector(true) }}
        >
          <div className="cursor-pointer flex items-center justify-center">
            <PlusIcon className="size-4" />

          </div>
        </PlaceholderNode>
      </WorkflowNode>
    </NodeSelector>
  )
});
