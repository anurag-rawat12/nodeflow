import React, { memo, useState } from 'react'
import { Node, useReactFlow } from '@xyflow/react'
import { BaseExecutionNode } from './base-execution'
import { useNodeStatus } from '@/inngest/hook/use-node-status'
import { GeminiToken } from '@/inngest/get-subscribe-token'
import { OutputDialog } from './output-dialog'
import GeminiSetting from './Gemini-setting'


type GeminiNodeProps = {
  variableName?: string
  credentialId?: string
  systemPrompt?: string
  userPrompt?: string

}

type GeminiNodeType = Node<GeminiNodeProps>

export const GeminiNode = memo((
  props: GeminiNodeType
) => {

  const nodeData = props.data
  const config = nodeData?.userPrompt ? `${"gemini-2.5-flash"} : ${nodeData.userPrompt.slice(0, 20)}` : 'Not Configured'
  const [setting, setsetting] = useState(false)

  const { setNodes, getNode } = useReactFlow();

  const NodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: "gemini-execution",
    topic: "status",
    refreshToken: GeminiToken
  })

  const handleSubmit = (data: {
    variableName: string;
    model: string;
    credentialId: string
    systemPrompt?: string;
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
            model: data.model,
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
      <GeminiSetting
        open={setting}
        onOpenChange={setsetting}
        onSubmit={handleSubmit}
        variableName={nodeData.variableName}
        credentialId={nodeData.credentialId}
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
        icon="/images/gemini.svg"
        name={'Gemini'}
        status={NodeStatus}
        description={config}
        onSettings={() => { setsetting(true) }}
        onDoubleClick={() => { setOutputDialogOpen(true) }}
        {...props}
      />
    </>
  )

})
