import { channel, topic } from "@inngest/realtime"

export const outputChannel = channel("store-output")
    .addTopic(
        topic("output").type<{
            nodeId: string,
            data: string
        }>()
    )