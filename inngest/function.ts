import { inngest } from "./Client";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export const aiResponse = inngest.createFunction(
    { id: "execute" },
    { event: "execute" },
    async ({ event, step }) => {
        await step.sleep("executing", "1s");

        const prompt = event.data?.prompt

        const { steps } = await step.ai.wrap(
            "gemini-text",
            generateText, {
            model: google("gemini-2.5-flash"),
            prompt
        }
        );

        return { steps };
    }
);