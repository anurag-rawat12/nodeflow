import React, { memo, useState } from 'react'
import { NodeProps } from '@xyflow/react'
import GoogleFormSetting from './google-form-setting'
import { BaseTriggerNode } from './base-manual-trigger'
import { googleFormTriggerToken } from '@/inngest/get-subscribe-token'
import { useNodeStatus } from '@/inngest/hook/use-node-status'

export const googleFormTrigger = memo((props: NodeProps) => {

    const [setting, setsetting] = useState(false)
    const NodeStatus = useNodeStatus({
        nodeId: props.id,
        channel: "google-form-execution",
        topic: "status",
        refreshToken: googleFormTriggerToken
    })

    return (
        <>
            <GoogleFormSetting
                open={setting}
                onOpenChange={setsetting}
            />
            <BaseTriggerNode
                id={props.id}
                status={NodeStatus}
                icon='/images/googleform.svg'
                name="Google form"
                description='When form is submitted'
                onSettings={() => { setsetting(true) }}
                onDoubleClick={() => { setsetting(true) }}
                {...props}
            />
        </>
    )
})
