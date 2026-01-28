import React, { memo, useState } from 'react'
import { Node, useReactFlow } from '@xyflow/react'
import { BaseExecutionNode } from './base-execution'
import { useNodeStatus } from '@/inngest/hook/use-node-status'
import { OpenaiToken } from '@/inngest/get-subscribe-token'
import { OutputDialog } from './output-dialog'
import OpenAISetting from './openAI-setting'


type OpenAINodeProps = {
  variableName?: string
  systemPrompt?: string;
  userPrompt?: string;
  credentialId?: string;

}

type OpenAINodeType = Node<OpenAINodeProps>

export const OpenAINode = memo((
  props: OpenAINodeType
) => {

  const nodeData = props.data
  const config = nodeData?.userPrompt ? `${"gpt-4"} : ${nodeData.userPrompt.slice(0, 20)}` : 'Not Configured'
  const [setting, setsetting] = useState(false)

  const { setNodes, getNode } = useReactFlow();

  const NodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: "openai-execution",
    topic: "status",
    refreshToken: OpenaiToken
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
            credentialId: data.credentialId || "",
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
      <OpenAISetting
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
        icon="/images/openai.svg"
        name={'OpenAI'}
        status={NodeStatus}
        description={config}
        onSettings={() => { setsetting(true) }}
        onDoubleClick={() => { setOutputDialogOpen(true) }}
        {...props}
      />
    </>
  )

})
