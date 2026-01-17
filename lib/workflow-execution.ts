"use server";

import { inngest } from "@/inngest/Client";
import prisma from "./prisma";
import { requireAuth } from "./auth-utils";

export async function execute({ workflowId }: { workflowId: string }) {

  const session = await requireAuth();
  if (!session) throw new Error("Not authenticated");

  const workflow = await prisma.workflow.findUniqueOrThrow({
    where: {
      id: workflowId,
      userID: session.user.id
    },
  })

  if (!workflow) {
    throw new Error("Workflow not found");
  }

  const res = await inngest.send({
    name: "execute-workflow",
    data: {
      workflowId: workflow.id
    }
  });

  return workflow;
}

