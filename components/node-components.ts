import { NodeType } from "@/app/generated/prisma/enums";
import { InitialNode } from "./ui/initial-node";
import { NodeTypes } from "@xyflow/react";
import { HttpNode } from "./http-node";
import { ManualTrigger } from "./manual-trigger";

export const nodeComponents = {
    [NodeType.INITIAL]: InitialNode,
    [NodeType.HTTP_REQUEST]: HttpNode as unknown as NodeTypes[keyof NodeTypes],
    [NodeType.MANUAL_TRIGGER]: ManualTrigger,


} as const satisfies NodeTypes;

export type RegisteredNodeComponents = keyof typeof nodeComponents;