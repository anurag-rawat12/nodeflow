import { NonRetriableError } from "inngest";
import { inngest } from "./Client";
import prisma from "@/lib/prisma";
import { getExecutor, topologicalSort } from "./utils";
import { ExecutionStatus, NodeType } from "@/app/generated/prisma/enums";
import { HttpRequestChannel } from "./channels/http-request";
import { manualTriggerChannel } from "./channels/manual-trigger";
import { googleFormTriggerChannel } from "./channels/google-from";
import { outputChannel } from "./channels/output";
import { openaiChannel } from "./channels/openai";
import { anthropicChannel } from "./channels/anthropic";
import { geminiChannel } from "./channels/gemini";
import { grokChannel } from "./channels/grok";

export const executeWorkflow = inngest.createFunction(
    {
        id: "execute-workflow",
        retries: 0,
        onFailure: async ({ event, error }) => {
            const inngestEventId = event.data.event.id
            return await prisma.execution.updateMany({
                where: {
                    inngestEventId: inngestEventId
                },
                data: {
                    status: ExecutionStatus.FAILED,
                    finishedAt: new Date(),
                    error: error.message
                }
            })
        }

    },
    {
        event: "execute-workflow",
        channel: [
            HttpRequestChannel(),
            manualTriggerChannel(),
            googleFormTriggerChannel(),
            outputChannel(),
            openaiChannel(),
            anthropicChannel(),
            geminiChannel(),
            grokChannel()
        ]
    },
    async ({ event, step, publish }) => {
        const inngestEventId = event.id
        const workflowId = event.data.workflowId;

        if (!workflowId) {
            throw new NonRetriableError("No workflow ID provided");
        }

        await step.run("create-execution-record", async () => {
            return await prisma.execution.create({
                data: {
                    workflowId: workflowId,
                    inngestEventId: inngestEventId
                }
            })
        })


        const sortedNodes = await step.run("prepare-workflow", async () => {
            const workflow = await prisma.workflow.findUniqueOrThrow({
                where: {
                    id: workflowId
                },
                include: {
                    nodes: true,
                    connections: true,
                }
            })

            return topologicalSort(workflow.nodes, workflow.connections)
        })

        let context = event.data.initialData || {}

        for (const node of sortedNodes) {
            const executor = getExecutor(node.type as NodeType);
            context = await executor({
                data: node.data,
                nodeId: node.id,
                context,
                step,
                publish
            })
        }

        await step.run("update-execution-record", async () => {
            return await prisma.execution.update({
                where: {
                    inngestEventId: inngestEventId,
                    workflowId: workflowId,
                },
                data: {
                    status: ExecutionStatus.SUCCESS,
                    finishedAt: new Date(),
                    output: context
                }
            })
        })

        return {
            workflowId,
            result: context
        }
    }
);