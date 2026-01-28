import { channel, topic } from "@inngest/realtime"

export const HttpRequestChannel = channel("http-request-execution")
    .addTopic(
        topic("status").type<{
            nodeId: string,
            status: "loading" | "success" | "error"
        }>()
    )