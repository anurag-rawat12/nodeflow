import React, { memo, useState } from 'react'
import { Node, useReactFlow } from '@xyflow/react'
import { BaseExecutionNode } from './base-execution'
import { useNodeStatus } from '@/inngest/hook/use-node-status'
import { GrokToken, OpenaiToken } from '@/inngest/get-subscribe-token'
import { OutputDialog } from './output-dialog'
import GrokSetting from './grok-setting'


type GrokNodeProps = {
  variableName?: string
  systemPrompt?: string;
  credentialId?: string
  userPrompt?: string;

}

type GrokNodeType = Node<GrokNodeProps>

export const GrokNode = memo((
  props: GrokNodeType
) => {

  const nodeData = props.data
  const config = nodeData?.userPrompt ? `${"grok-3"} : ${nodeData.userPrompt.slice(0, 20)}` : 'Not Configured'
  const [setting, setsetting] = useState(false)

  const { setNodes, getNode } = useReactFlow();

  const NodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: "grok-execution",
    topic: "status",
    refreshToken: GrokToken
  })

  const handleSubmit = (data: {
    variableName: string;
    systemPrompt?: string;
    credentialId: string;
    userPrompt: string;
  }) => {
    setNodes((nodes) => nodes.map((node) => {
      if (node.id === props.id) {
        return {
          ...node,
          data: {
            ...node.data,
            variableName: data.variableName,
            credentialId: data.credentialId,
            systemPrompt: data.systemPrompt,
            userPrompt: data.userPrompt,
          },
        };
      }
      return node;
    }))
  }

  const [outputDialogOpen, setOutputDialogOpen] = useState(false)

  return (
    <>
      <GrokSetting
        open={setting}
        onOpenChange={setsetting}
        onSubmit={handleSubmit}
        variableName={nodeData.variableName}
        systemPrompt={nodeData.systemPrompt}
        userPrompt={nodeData.userPrompt}
      />
      <OutputDialog
        nodeId={props.id}
        open={outputDialogOpen}
        onOpenChange={setOutputDialogOpen}
      />
      <BaseExecutionNode
        id={props.id}
        icon="/images/grok.svg"
        name={'Grok'}
        status={NodeStatus}
        description={config}
        onSettings={() => { setsetting(true) }}
        onDoubleClick={() => { setOutputDialogOpen(true) }}
        {...props}
      />
    </>
  )

})
