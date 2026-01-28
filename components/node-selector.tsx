'use client';

import React, { useCallback } from "react";
import { GlobeIcon, MousePointerIcon } from "lucide-react";
import { NodeType } from '@prisma/client'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "./ui/sheet";
import { Separator } from "./ui/separator";
import { Position, useReactFlow } from "@xyflow/react";
import { toast } from "sonner";
import { createId } from "@paralleldrive/cuid2";
import Image from "next/image";

export type NodeTypeOptions = {
    type: NodeType;
    label: string;
    description: string;
    icon: React.ComponentType<{ className?: string }> | string;
};

const triggerNodes: NodeTypeOptions[] = [
    {
        type: NodeType.MANUAL_TRIGGER,
        label: "Manual Trigger",
        description: "Starts the workflow manually",
        icon: MousePointerIcon,
    },
    {
        type: NodeType.GOOGLE_FORM_TRIGGER,
        label: "Google Form Trigger",
        description: "Starts the workflow from a Google Form submission",
        icon: '/images/googleform.svg',
    },
];

const executionNodes: NodeTypeOptions[] = [
    {
        type: NodeType.HTTP_REQUEST,
        label: "HTTP Request",
        description: "Makes an HTTP request",
        icon: GlobeIcon,
    },
    {
        type: NodeType.GEMINI,
        label: "Gemini",
        description: "Makes an Gemini API call",
        icon: "/images/gemini.svg",
    },
    {
        type: NodeType.ANTHROPIC,
        label: "Anthropic",
        description: "Makes an Anthropic API call",
        icon: "/images/anthropic.svg",
    },
    {
        type: NodeType.OPENAI,
        label: "OpenAI",
        description: "Makes an OpenAI API call",
        icon: "/images/openai.svg",
    },
    {
        type: NodeType.GROK,
        label: "Grok",
        description: "Makes a Grok API call",
        icon: "/images/grok.svg",
    },
];

interface NodeSelectorProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children?: React.ReactNode;
}

function NodeOption({
    node,
    onClick,
}: {
    node: NodeTypeOptions;
    onClick?: () => void;
}) {
    const Icon = node.icon;

    return (
        <button
            type="button"
            onClick={onClick}
            className="group flex w-full items-start gap-4 border-l-2 border-transparent px-6 py-4 text-left transition-colors
            hover:border-l-primary hover:bg-muted/50 focus-visible:outline-none cursor-pointer focus-visible:ring-2 focus-visible:ring-primary"
        >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground group-hover:text-primary">
                {typeof Icon === "string" ? (
                    <Image width={16} height={16} src={Icon} alt={node.label} className="h-5 w-5" />
                ) : (
                    <Icon className="h-5 w-5" />
                )}
            </div>

            <div className="flex min-w-0 flex-col">
                <span className="text-sm font-medium text-foreground">
                    {node.label}
                </span>
                <span className="text-xs text-muted-foreground line-clamp-2">
                    {node.description}
                </span>
            </div>
        </button>
    );
}


export function NodeSelector({
    open,
    onOpenChange,
    children,
}: NodeSelectorProps) {

    const { setNodes, getNodes, screenToFlowPosition } = useReactFlow()

    const handleNodeSelect = useCallback((node: NodeTypeOptions) => {

        if (node.type == NodeType.MANUAL_TRIGGER) {
            const nodes = getNodes()
            const hasManualTrigger = nodes.some(n => n.type === NodeType.MANUAL_TRIGGER)

            if (hasManualTrigger) {
                toast.error("A workflow can only have one manual trigger.")
                return
            }
        }

        setNodes((nodes) => {
            const hasInitialNode = nodes.some(n => n.type === NodeType.INITIAL)
            const centerX = window.innerWidth / 2
            const centerY = window.innerHeight / 2

            const flowPosition = screenToFlowPosition({
                x: centerX + (Math.random() - 0.5) * 200,
                y: centerY + (Math.random() - 0.5) * 200,
            })

            const newNode = {
                id: createId(),
                data: {},
                position: flowPosition,
                type: node.type
            }

            if (hasInitialNode) {
                return [newNode]
            }
            return [...nodes, newNode]

        })

        onOpenChange(false);


    }, [setNodes, getNodes, screenToFlowPosition, onOpenChange]);

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetTrigger asChild>{children}</SheetTrigger>

            <SheetContent
                side="right"
                className="w-full sm:max-w-md overflow-y-auto px-0"
            >
                <SheetHeader className="px-6 pb-4">
                    <SheetTitle className="text-base font-semibold">
                        Add a Node
                    </SheetTitle>
                    <SheetDescription className="text-sm">
                        Select a trigger or action to continue building your workflow.
                    </SheetDescription>
                </SheetHeader>

                <div className="flex flex-col">
                    {/* Triggers */}
                    <div className="px-6 pt-2 pb-1">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Triggers
                        </p>
                    </div>

                    {triggerNodes.map((node) => (
                        <NodeOption key={node.type} node={node} onClick={() => handleNodeSelect(node)} />
                    ))}

                    <Separator className="my-3" />

                    {/* Actions */}
                    <div className="px-6 pt-2 pb-1">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Actions
                        </p>
                    </div>

                    {executionNodes.map((node) => (
                        <NodeOption key={node.type} node={node} onClick={() => handleNodeSelect(node)} />
                    ))}
                </div>
            </SheetContent>
        </Sheet>
    );
}
