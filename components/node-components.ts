import { NodeType } from "@/app/generated/prisma/enums";
import { InitialNode } from "./ui/initial-node";
import { NodeTypes } from "@xyflow/react";
import { HttpNode } from "./http-node";
import { ManualTrigger } from "./manual-trigger";
import { googleFormTrigger } from "./google-form-trigger";
import { GeminiNode } from "./gemini-trigger";
import { OpenAINode } from "./openAI-trigger";
import { AnthropicNode } from "./anthropic-trigger";
import { GrokNode } from "./grok-trigger";

export const nodeComponents = {
    [NodeType.INITIAL]: InitialNode,
    [NodeType.HTTP_REQUEST]: HttpNode as unknown as NodeTypes[keyof NodeTypes],
    [NodeType.MANUAL_TRIGGER]: ManualTrigger,
    [NodeType.GOOGLE_FORM_TRIGGER]: googleFormTrigger,
    [NodeType.GEMINI]: GeminiNode as unknown as NodeTypes[keyof NodeTypes],
    [NodeType.ANTHROPIC]: AnthropicNode as unknown as NodeTypes[keyof NodeTypes],
    [NodeType.OPENAI]: OpenAINode as unknown as NodeTypes[keyof NodeTypes],
    [NodeType.GROK]: GrokNode as unknown as NodeTypes[keyof NodeTypes],

} as const satisfies NodeTypes;

export type RegisteredNodeComponents = keyof typeof nodeComponents;