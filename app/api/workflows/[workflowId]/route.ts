import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { requireAuth } from "@/lib/auth-utils"
import { Edge, Node } from "@xyflow/react";

export async function DELETE(req: Request, { params }: { params: Promise<{ workflowId: string }> }) {
    const session = await requireAuth();
    const { workflowId } = await params;

    if (!workflowId) {
        return NextResponse.json(
            { error: "Workflow ID is required" },
            { status: 400 }
        )
    }

    if (!session?.user?.id) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        )
    }

    const workflow = await prisma.workflow.delete({
        where: {
            id: workflowId,
            userID: session.user.id
        }
    })
    if (!workflow) {
        return NextResponse.json(
            { error: "Workflow not found or you do not have permission to delete it" },
            { status: 404 }
        )
    }

    return NextResponse.json(workflow, { status: 201 })
}

export async function PUT(req: Request, { params }: { params: Promise<{ workflowId: string }> }) {
    const session = await requireAuth();
    const { workflowId } = await params;
    const body = await req.json()
    const { name } = body
    if (!name) {
        return NextResponse.json(
            { error: "Name is required" },
            { status: 400 }
        )
    }
    if (!session?.user?.id) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        )
    }
    const workflow = await prisma.workflow.update({
        where: {
            id: workflowId,
            userID: session.user.id
        },
        data: {
            name: name
        }
    })

    return NextResponse.json(workflow, { status: 201 })
}

export async function GET(req: Request, { params }: { params: Promise<{ workflowId: string }> }) {
    const session = await requireAuth();
    const { workflowId } = await params;

    if (!session?.user?.id) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        )
    }
    const workflow = await prisma.workflow.findUnique({
        where: {
            id: workflowId,
            userID: session.user.id
        },
        include: {
            nodes: true,
            connections: true
        }
    })

    // transform server node to react flow node

    const node: Node[] = workflow?.nodes.map((n) => ({
        id: n.id,
        type: n.type,
        position: n.position as { x: number; y: number },
        data : (n.data as Record<string, any>) || {}
    }))

    const edges: Edge[] = workflow?.connections.map((e)=>({
        id: e.id,
        source: e.fromNodeId,
        target: e.toNodeId,
        sourceHandle: e.fromOutput,
        targetHandle: e.toInput
    }))

    return NextResponse.json({ workflow, node, edges }, { status: 201 })
}