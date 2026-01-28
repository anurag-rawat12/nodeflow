import React, { memo, useState } from 'react'
import { Node, useReactFlow } from '@xyflow/react'
import { BaseExecutionNode } from './base-execution'
import { useNodeStatus } from '@/inngest/hook/use-node-status'
import { AnthropicToken } from '@/inngest/get-subscribe-token'
import { OutputDialog } from './output-dialog'
import AnthropicSetting from './anthropic-setting'


type AnthropicNodeProps = {
  variableName?: string
  systemPrompt?: string;
  credentialId?: string
  userPrompt?: string;

}

type AnthropicNodeType = Node<AnthropicNodeProps>

export const AnthropicNode = memo((
  props: AnthropicNodeType
) => {

  const nodeData = props.data
  const config = nodeData?.userPrompt ? `${"claude-sonnet-4-0"} : ${nodeData.userPrompt.slice(0, 20)}` : 'Not Configured'
  const [setting, setsetting] = useState(false)

  const { setNodes, getNode } = useReactFlow();

  const NodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: "anthropic-execution",
    topic: "status",
    refreshToken: AnthropicToken
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
      <AnthropicSetting
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
        icon="/images/anthropic.svg"
        name={'Anthropic'}
        status={NodeStatus}
        description={config}
        onSettings={() => { setsetting(true) }}
        onDoubleClick={() => { setOutputDialogOpen(true) }}
        {...props}
      />
    </>
  )

})
