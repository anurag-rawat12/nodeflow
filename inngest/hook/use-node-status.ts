'use client';

import { Realtime } from "@inngest/realtime";
import { useEffect, useState } from "react";
import { useInngestSubscription } from "@inngest/realtime/hooks";
import { NodeStatus } from "@/components/node-status-indicator";

interface UseNodeStatusProps {
    nodeId: string;
    channel: string;
    topic: string;
    refreshToken: () => Promise<Realtime.Subscribe.Token>;
}
export const useNodeStatus = ({
    nodeId, channel, topic, refreshToken
}: UseNodeStatusProps) => {

    const [status, setStatus] = useState("initial")

    const { data } = useInngestSubscription({
        refreshToken: refreshToken,
        enabled: true
    });
    useEffect(() => {
        if (!data) return;

        const message = data.filter(
            (msg) =>
                msg.kind === "data" &&
                msg.channel === channel &&
                msg.topic === topic &&
                msg.data.nodeId === nodeId
        )
            .sort((a, b) => {
                if (a.kind == "data" && b.kind == "data") {
                    return (
                        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    )
                }
                return 0;

            })[0]

        if (message && message.kind === "data") {
            setStatus(message.data.status as NodeStatus)
        }
    }, [data, channel, topic, nodeId]);

    return status as NodeStatus;

}