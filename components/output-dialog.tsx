"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { outputTriggerToken } from "@/inngest/get-subscribe-token"
import { useInngestSubscription } from "@inngest/realtime/hooks"
import { useEffect, useState } from "react"

export function OutputDialog({
    nodeId,
    open,
    onOpenChange,
}: {
    nodeId: string
    open: boolean
    onOpenChange: (open: boolean) => void
}) {
    const { data } = useInngestSubscription({
        refreshToken: outputTriggerToken,
        enabled: true,
    })

    const [nodeOutputs, setNodeOutputs] = useState<Record<string, any>>({})

    useEffect(() => {
        if (!data || data.length === 0) return

        setNodeOutputs((prev) => {
            const updated = { ...prev }

            for (const msg of data) {
                const nodeId = msg?.data?.nodeId
                const output = msg?.data?.data

                if (nodeId) {
                    updated[nodeId] = output
                }
            }

            return updated
        })
    }, [data])



    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Node Output</DialogTitle>
                </DialogHeader>

                {/* Output Viewer */}
                <div className="mt-2">
                    <Textarea
                        value={JSON.stringify(nodeOutputs[nodeId] || "no output", null, 2)}
                        readOnly
                        className=" h-[400px] resize-none font-mono text-xs leading-relaxed bg-muted/40 overflow-auto"
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}
