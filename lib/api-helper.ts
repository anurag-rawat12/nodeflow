"use server";

import { inngest } from "@/inngest/Client";

export async function triggerAI(prompt: string) {
  await inngest.send({
    name: "execute",
    data: {
      prompt: prompt,    
    },
  });
}
