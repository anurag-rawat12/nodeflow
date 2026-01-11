import { NodeType } from "@/app/generated/prisma/enums";
import { InitialNode } from "./ui/initial-node";
import { NodeTypes } from "@xyflow/react";

export const nodeComponents = {
    [NodeType.INITIAL]: InitialNode,
} as const satisfies NodeTypes;

export type RegisteredNodeComponents = keyof typeof nodeComponents;