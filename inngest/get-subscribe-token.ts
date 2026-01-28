"use server";
import { getSubscriptionToken, Realtime } from "@inngest/realtime";
import { inngest } from "./Client";
import { HttpRequestChannel } from "./channels/http-request";
import { manualTriggerChannel } from "./channels/manual-trigger";
import { googleFormTriggerChannel } from "./channels/google-from";
import { outputChannel } from "./channels/output";
import { geminiChannel } from "./channels/gemini";
import { anthropicChannel } from "./channels/anthropic";
import { openaiChannel } from "./channels/openai";
import { grokChannel } from "./channels/grok";

export async function fetchHttpRequestToken(): Promise<Realtime.Subscribe.Token> {

    const token = await getSubscriptionToken(inngest, {
        channel: HttpRequestChannel(),
        topics: ["status"],
    });

    return token;
}

export async function fetchManualTriggerToken(): Promise<Realtime.Subscribe.Token> {

    const token = await getSubscriptionToken(inngest, {
        channel: manualTriggerChannel(),
        topics: ["status"],
    });

    return token;
}

export async function googleFormTriggerToken(): Promise<Realtime.Subscribe.Token> {

    const token = await getSubscriptionToken(inngest, {
        channel: googleFormTriggerChannel(),
        topics: ["status"],
    });

    return token;
}

export async function outputTriggerToken(): Promise<Realtime.Subscribe.Token> {

    const token = await getSubscriptionToken(inngest, {
        channel: outputChannel(),
        topics: ["output"],
    });

    return token;
}

export async function GeminiToken(): Promise<Realtime.Subscribe.Token> {

    const token = await getSubscriptionToken(inngest, {
        channel: geminiChannel(),
        topics: ["status"],
    });

    return token;
}

export async function AnthropicToken(): Promise<Realtime.Subscribe.Token> {

    const token = await getSubscriptionToken(inngest, {
        channel: anthropicChannel(),
        topics: ["status"],
    });

    return token;
}

export async function OpenaiToken(): Promise<Realtime.Subscribe.Token> {

    const token = await getSubscriptionToken(inngest, {
        channel: openaiChannel(),
        topics: ["status"],
    });

    return token;
}

export async function GrokToken(): Promise<Realtime.Subscribe.Token> {

    const token = await getSubscriptionToken(inngest, {
        channel: grokChannel(),
        topics: ["status"],
    });

    return token;
}