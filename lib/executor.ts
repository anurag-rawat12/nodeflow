import { NonRetriableError } from "inngest";
import Handlebars from "handlebars"
import axios from "axios";
import { Realtime } from "@inngest/realtime";
import { HttpRequestChannel } from "@/inngest/channels/http-request";
import { manualTriggerChannel } from "@/inngest/channels/manual-trigger";
import { googleFormTriggerChannel } from "@/inngest/channels/google-from";
import { outputChannel } from "@/inngest/channels/output";
import { geminiChannel } from "@/inngest/channels/gemini";
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createXai } from '@ai-sdk/xai';
import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { openaiChannel } from "@/inngest/channels/openai";
import { grokChannel } from "@/inngest/channels/grok";
import { anthropicChannel } from "@/inngest/channels/anthropic";
import prisma from "./prisma";
import { decrypt } from "./encryption";

Handlebars.registerHelper('json', (context) => {
    const stringified = JSON.stringify(context, null, 2);
    const safeString = new Handlebars.SafeString(stringified);
    return safeString;
})

export const manualTriggerExecutor = async ({
    data,
    nodeId,
    context,
    step,
    publish
}: { data: any, nodeId: string, context: any, step: any, publish: Realtime.PublishFn }) => {

    await publish(
        manualTriggerChannel().status({
            nodeId: nodeId,
            status: "loading"
        })
    )

    const result = await step.run("manual-trigger", async () => context)

    await publish(
        manualTriggerChannel().status({
            nodeId: nodeId,
            status: "success"
        })
    )

    return result;
}

type httpsRequestData = {
    variableName: string;
    endpoint: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: string;
}

export const httpTriggerExecutor = async ({
    data,
    nodeId,
    context,
    step,
    publish
}: { data: httpsRequestData, nodeId: string, context: any, step: any, publish: Realtime.PublishFn }) => {

    await publish(
        HttpRequestChannel().status({
            nodeId: nodeId,
            status: "loading"
        })
    )

    if (!data.endpoint) {
        await publish(
            HttpRequestChannel().status({
                nodeId: nodeId,
                status: "error"
            })
        )
        throw new NonRetriableError("No endpoint provided for HTTP Trigger");
    }

    if (!data.variableName) {
        await publish(
            HttpRequestChannel().status({
                nodeId: nodeId,
                status: "error"
            })
        )
        throw new NonRetriableError("variableName not configured");
    }

    const endpoint = Handlebars.compile(data.endpoint)(context);

    try {
        const result = await step.run("http-request", async () => {

            let requestBody: any = undefined;

            if (data.body && data.body.trim() !== "") {
                const resolved = Handlebars.compile(data.body)(context);
                requestBody = JSON.parse(resolved);
            } else {
                requestBody = "{}"
            }

            const res = await axios({
                method: data.method,
                url: endpoint,
                data: requestBody,
                headers: {
                    "Content-Type": "application/json",
                },
            });


            const contentType = res.headers["content-type"] || "";

            let responseData: any;

            if (contentType.includes("application/json")) {
                responseData = res.data;
            } else {
                responseData = String(res.data);
            }

            const payload = {
                httpResponse: {
                    status: res.status,
                    statusText: res.statusText,
                    data: responseData,
                },
            };

            return {
                ...context,
                [data.variableName]: payload,
            };
        });

        await publish(
            HttpRequestChannel().status({
                nodeId: nodeId,
                status: "success"
            })
        )

        await publish(
            outputChannel().output({
                nodeId: nodeId,
                data: result
            })
        )


        return result;
    } catch (error) {
        await publish(
            HttpRequestChannel().status({
                nodeId: nodeId,
                status: "error"
            })
        )
        throw error;
    }
}

export const googleFormTriggerExecutor = async ({
    data,
    nodeId,
    context,
    step,
    publish
}: { data: any, nodeId: string, context: any, step: any, publish: Realtime.PublishFn }) => {

    await publish(
        googleFormTriggerChannel().status({
            nodeId: nodeId,
            status: "loading"
        })
    )

    const result = await step.run("google-form-trigger", async () => context)

    await publish(
        googleFormTriggerChannel().status({
            nodeId: nodeId,
            status: "success"
        })
    )

    return result;
}


type AIData = {
    variableName?: string
    userPrompt?: string
    credentialId?: string
    systemPrompt?: string
}

export const geminiExecutor = async ({
    data,
    nodeId,
    context,
    step,
    publish
}: { data: AIData, nodeId: string, context: any, step: any, publish: Realtime.PublishFn }) => {

    await publish(
        geminiChannel().status({
            nodeId: nodeId,
            status: "loading"
        })
    )

    if (!data.variableName) {
        await publish(
            geminiChannel().status({
                nodeId: nodeId,
                status: "error"
            })
        )
        throw new NonRetriableError("variableName not configured");
    }

    if (!data.userPrompt) {
        await publish(
            geminiChannel().status({
                nodeId: nodeId,
                status: "error"
            })
        )
        throw new NonRetriableError("userPrompt is missing");
    }

    const updatedSystemPrompt = data.systemPrompt ? Handlebars.compile(data.systemPrompt)(context) : "you are a helpful assistant.";
    const updatedUserPrompt = data.userPrompt ? Handlebars.compile(data.userPrompt)(context) : "";

    const credId = data.credentialId

    const API_KEY = await prisma.credential.findUnique({
        where: {
            id: credId
        },
        select: {
            value: true,
        }
    })

    if (API_KEY.value === null) {
        await publish(
            geminiChannel().status({
                nodeId: nodeId,
                status: "error"
            })
        )
        throw new NonRetriableError("API key is missing");
    }

    const google = createGoogleGenerativeAI({
        apiKey: decrypt(API_KEY.value),
    })


    try {

        const { steps } = await step.ai.wrap(
            `gemini-invoke`,
            generateText,
            {
                model: google("gemini-2.5-flash"),
                system: updatedSystemPrompt,
                prompt: updatedUserPrompt,
                experimental_telemetry: {
                    isEnabled: true,
                    recordInputs: true,
                    recordOutputs: true,
                }
            }
        )

        const text = steps[0].content[0].type === 'text' ? steps[0].content[0].text : '';

        await publish(
            geminiChannel().status({
                nodeId: nodeId,
                status: "success"
            })
        )

        return {
            ...context,
            [data.variableName]: {
                response: text
            }
        }
    } catch (error) {
        await publish(
            geminiChannel().status({
                nodeId: nodeId,
                status: "error"
            })
        )
        throw error;
    }

}

export const openAIExecutor = async ({
    data,
    nodeId,
    context,
    step,
    publish
}: { data: AIData, nodeId: string, context: any, step: any, publish: Realtime.PublishFn }) => {

    await publish(
        openaiChannel().status({
            nodeId: nodeId,
            status: "loading"
        })
    )

    if (!data.variableName) {
        await publish(
            openaiChannel().status({
                nodeId: nodeId,
                status: "error"
            })
        )
        throw new NonRetriableError("variableName not configured");
    }

    if (!data.userPrompt) {
        await publish(
            openaiChannel().status({
                nodeId: nodeId,
                status: "error"
            })
        )
        throw new NonRetriableError("userPrompt is missing");
    }

    const updatedSystemPrompt = data.systemPrompt ? Handlebars.compile(data.systemPrompt)(context) : "you are a helpful assistant.";
    const updatedUserPrompt = data.userPrompt ? Handlebars.compile(data.userPrompt)(context) : "";

    const credId = data.credentialId

    const API_KEY = await prisma.credential.findUnique({
        where: {
            id: credId
        },
        select: {
            value: true,
        }
    })

    if (API_KEY.value === null) {
        await publish(
            openaiChannel().status({
                nodeId: nodeId,
                status: "error"
            })
        )
        throw new NonRetriableError("API key is missing");
    }

    const openAI = createOpenAI({
        apiKey: decrypt(API_KEY.value),
    })

    try {

        const { steps } = await step.ai.wrap(
            "openai-invoke",
            generateText,
            {
                model: openAI("gpt-4"),
                system: updatedSystemPrompt,
                prompt: updatedUserPrompt,
                experimental_telemetry: {
                    isEnabled: true,
                    recordInputs: true,
                    recordOutputs: true,
                }
            }
        )

        const text = steps[0].content[0].type === 'text' ? steps[0].content[0].text : '';

        await publish(
            openaiChannel().status({
                nodeId: nodeId,
                status: "success"
            })
        )

        await publish(
            outputChannel().output({
                nodeId: nodeId,
                data: {
                    ...context,
                    [data.variableName]: {
                        response: text
                    }
                }
            })
        )
        return {
            ...context,
            [data.variableName]: {
                response: text
            }
        }
    } catch (error) {
        await publish(
            openaiChannel().status({
                nodeId: nodeId,
                status: "error"
            })
        )
        throw error;
    }

}

export const grokExecutor = async ({
    data,
    nodeId,
    context,
    step,
    publish
}: { data: AIData, nodeId: string, context: any, step: any, publish: Realtime.PublishFn }) => {

    await publish(
        grokChannel().status({
            nodeId: nodeId,
            status: "loading"
        })
    )

    if (!data.variableName) {
        await publish(
            grokChannel().status({
                nodeId: nodeId,
                status: "error"
            })
        )
        throw new NonRetriableError("variableName not configured");
    }

    if (!data.userPrompt) {
        await publish(
            grokChannel().status({
                nodeId: nodeId,
                status: "error"
            })
        )
        throw new NonRetriableError("userPrompt is missing");
    }

    const updatedSystemPrompt = data.systemPrompt ? Handlebars.compile(data.systemPrompt)(context) : "you are a helpful assistant.";
    const updatedUserPrompt = data.userPrompt ? Handlebars.compile(data.userPrompt)(context) : "";

    const credId = data.credentialId

    const API_KEY = await prisma.credential.findUnique({
        where: {
            id: credId
        },
        select: {
            value: true,
        }
    })

    if (API_KEY.value === null) {
        await publish(
            grokChannel().status({
                nodeId: nodeId,
                status: "error"
            })
        )
        throw new NonRetriableError("API key is missing");
    }

    const grok = createXai({
        apiKey: decrypt(API_KEY.value),
    })

    try {

        const { steps } = await step.ai.wrap(
            "grok-invoke",
            generateText,
            {
                model: grok("grok-3"),
                system: updatedSystemPrompt,
                prompt: updatedUserPrompt,
                experimental_telemetry: {
                    isEnabled: true,
                    recordInputs: true,
                    recordOutputs: true,
                }
            }
        )

        const text = steps[0].content[0].type === 'text' ? steps[0].content[0].text : '';

        await publish(
            grokChannel().status({
                nodeId: nodeId,
                status: "success"
            })
        )

        await publish(
            outputChannel().output({
                nodeId: nodeId,
                data: {
                    ...context,
                    [data.variableName]: {
                        response: text
                    }
                }
            })
        )
        return {
            ...context,
            [data.variableName]: {
                response: text
            }
        }
    } catch (error) {
        await publish(
            grokChannel().status({
                nodeId: nodeId,
                status: "error"
            })
        )
        throw error;
    }

}


export const anthropicExecutor = async ({
    data,
    nodeId,
    context,
    step,
    publish
}: { data: AIData, nodeId: string, context: any, step: any, publish: Realtime.PublishFn }) => {

    await publish(
        anthropicChannel().status({
            nodeId: nodeId,
            status: "loading"
        })
    )

    if (!data.variableName) {
        await publish(
            anthropicChannel().status({
                nodeId: nodeId,
                status: "error"
            })
        )
        throw new NonRetriableError("variableName not configured");
    }

    if (!data.userPrompt) {
        await publish(
            anthropicChannel().status({
                nodeId: nodeId,
                status: "error"
            })
        )
        throw new NonRetriableError("userPrompt is missing");
    }

    const updatedSystemPrompt = data.systemPrompt ? Handlebars.compile(data.systemPrompt)(context) : "you are a helpful assistant.";
    const updatedUserPrompt = data.userPrompt ? Handlebars.compile(data.userPrompt)(context) : "";

    const credId = data.credentialId

    const API_KEY = await prisma.credential.findUnique({
        where: {
            id: credId
        },
        select: {
            value: true,
        }
    })

    if (API_KEY.value === null) {
        await publish(
            anthropicChannel().status({
                nodeId: nodeId,
                status: "error"
            })
        )
        throw new NonRetriableError("API key is missing");
    }

    const anthropic = createAnthropic({
        apiKey: decrypt(API_KEY.value),
    })

    try {

        const { steps } = await step.ai.wrap(
            "anthropic-invoke",
            generateText,
            {
                model: anthropic("claude-sonnet-4-0"),
                system: updatedSystemPrompt,
                prompt: updatedUserPrompt,
                experimental_telemetry: {
                    isEnabled: true,
                    recordInputs: true,
                    recordOutputs: true,
                }
            }
        )

        const text = steps[0].content[0].type === 'text' ? steps[0].content[0].text : '';

        await publish(
            anthropicChannel().status({
                nodeId: nodeId,
                status: "success"
            })
        )

        await publish(
            outputChannel().output({
                nodeId: nodeId,
                data: {
                    ...context,
                    [data.variableName]: {
                        response: text
                    }
                }
            })
        )
        return {
            ...context,
            [data.variableName]: {
                response: text
            }
        }
    } catch (error) {
        await publish(
            anthropicChannel().status({
                nodeId: nodeId,
                status: "error"
            })
        )
        throw error;
    }

}