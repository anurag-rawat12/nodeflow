import React, { memo, useState } from 'react'
import { Node, useReactFlow } from '@xyflow/react'
import { GlobeIcon } from 'lucide-react'
import { BaseExecutionNode } from './base-execution'
import HttpSetting from './http-setting'


type HttpNodeProps = {
  endpoint?: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: string
  [key: string]: unknown
}

type HttpsRequestNodeType = Node<HttpNodeProps>

export const HttpNode = memo((
  props: HttpsRequestNodeType
) => {

  const nodeData = props.data
  const config = nodeData?.endpoint ? `${nodeData.method || "GET"} : ${nodeData.endpoint}` : 'No Endpoint Configured'
  const [setting, setsetting] = useState(false)

  const { setNodes } = useReactFlow();

  const handleSubmit = (data: {
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
            endpoint: data.endpoint,
            method: data.method,
            body: data.body,
          },
        };
      }
      return node;
    }))
  }

  return (
    <>
      <HttpSetting
        open={setting}
        onOpenChange={setsetting}
        onSubmit={handleSubmit}
        endpoint={nodeData?.endpoint}
        method={nodeData?.method}
        body={nodeData?.body}
      />
      <BaseExecutionNode
        id={props.id}
        icon={GlobeIcon}
        name="HTTP Request"
        description={config}
        onSettings={() => { setsetting(true) }}
        onDoubleClick={() => { setsetting(true) }}
        {...props}
      />
    </>
  )

})

HttpNode.displayName = 'HttpNode';