import { channel, topic } from "@inngest/realtime"

export const grokChannel = channel("grok-execution")
    .addTopic(
        topic("status").type<{
            nodeId: string,
            status: "loading" | "success" | "error"
        }>()
    )