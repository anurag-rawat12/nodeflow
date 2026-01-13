import { NodeType } from "@/app/generated/prisma/enums";
import { InitialNode } from "./ui/initial-node";
import { NodeTypes } from "@xyflow/react";
import HttpsNode from "./http-node";
import ManualNode from "./manual-node";

export const nodeComponents = {
    [NodeType.INITIAL]: InitialNode,
    [NodeType.MANUAL_TRIGGER]: ManualNode,
    [NodeType.HTTP_REQUEST]: HttpsNode,


} as const satisfies NodeTypes;

export type RegisteredNodeComponents = keyof typeof nodeComponents;