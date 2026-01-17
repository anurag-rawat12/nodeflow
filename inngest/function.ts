import { NonRetriableError } from "inngest";
import { inngest } from "./Client";
import prisma from "@/lib/prisma";

export const executeWorkflow = inngest.createFunction(
    { id: "execute-workflow" },
    { event: "execute-workflow" },
    async ({ event, step }) => {
        const workflowId = event.data.workflowId;
        console.log("workflow id:", workflowId);

        if (!workflowId) {
            throw new NonRetriableError("No workflow ID provided");
        }

        const nodes = await step.run("prepare-woklow", async () => {
            const workflow = await prisma.workflow.findUniqueOrThrow({
                where: {
                    id: workflowId
                },
                include: {
                    nodes: true,
                    connections: true,
                }
            })

            return workflow.nodes
        })

        return { nodes }
    }
);