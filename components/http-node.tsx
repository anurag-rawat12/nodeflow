import React, { memo, useState } from 'react'
import { Node, useReactFlow } from '@xyflow/react'
import { GlobeIcon } from 'lucide-react'
import { BaseExecutionNode } from './base-execution'
import HttpSetting from './http-setting'
import { useNodeStatus } from '@/inngest/hook/use-node-status'
import { fetchHttpRequestToken } from '@/inngest/get-subscribe-token'
import { OutputDialog } from './output-dialog'
import { HttpRequestChannel } from '@/inngest/channels/http-request'


type HttpNodeProps = {
  variableName?: string
  endpoint?: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: string
}

type HttpsRequestNodeType = Node<HttpNodeProps>

export const HttpNode = memo((
  props: HttpsRequestNodeType
) => {

  const nodeData = props.data
  const config = nodeData?.endpoint ? `${nodeData.method || "GET"} : ${nodeData.endpoint}` : 'No Endpoint Configured'
  const [setting, setsetting] = useState(false)

  const { setNodes, getNode } = useReactFlow();

  const NodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: "http-request-execution",
    topic: "status",
    refreshToken: fetchHttpRequestToken
  })

  const handleSubmit = (data: {
    variableName: string;
    endpoint: string;
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    body?: string;
  }) => {
    setNodes((nodes) => nodes.map((node) => {
      if (node.id === props.id) {
        return {
          ...node,
          data: {
            ...node.data,
            variableName: data.variableName,
            endpoint: data.endpoint,
            method: data.method,
            body: data.body,
          },
        };
      }
      return node;
    }))
  }

  const [outputDialogOpen, setOutputDialogOpen] = useState(false)

  return (
    <>
      <HttpSetting
        open={setting}
        onOpenChange={setsetting}
        onSubmit={handleSubmit}
        variableName={nodeData.variableName}
        endpoint={nodeData?.endpoint}
        method={nodeData?.method}
        body={nodeData?.body}
      />
      <OutputDialog
        nodeId={props.id}
        open={outputDialogOpen}
        onOpenChange={setOutputDialogOpen}
      />
      <BaseExecutionNode
        id={props.id}
        icon={GlobeIcon}
        name={'HTTP Request'}
        status={NodeStatus}
        description={config}
        onSettings={() => { setsetting(true) }}
        onDoubleClick={() => { setOutputDialogOpen(true) }}
        {...props}
      />
    </>
  )

})

HttpNode.displayName = 'HttpNode';