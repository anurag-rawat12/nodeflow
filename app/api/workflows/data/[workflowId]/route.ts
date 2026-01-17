import { NodeType } from '@/app/generated/prisma/enums'
import { requireAuth } from '@/lib/auth-utils'
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ workflowId: string }> }
) {
    const session = await requireAuth()

    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { workflowId } = await params
    const { nodes = [], edges = [] } = await req.json()

    const workflow = await prisma.workflow.findFirst({
        where: {
            id: workflowId,
            userID: session.user.id,
        },
        select: { id: true },
    })

    if (!workflow) {
        return NextResponse.json({ success: false }, { status: 401 })
    }

    await prisma.$transaction([
        prisma.connection.deleteMany({
            where: {
                workflowId: workflowId
            },
        }),

        prisma.node.deleteMany({
            where: {
                workflowId: workflowId
            },
        }),

        prisma.node.createMany({
            data: nodes.map((node: any) => ({
                id: node.id,
                workflowId: workflowId,
                name: node.type ?? 'unknown',
                type: Object.values(NodeType).includes(node.type)
                    ? node.type
                    : 'UNKNOWN',
                data: node.data ?? {},
                position: {
                    x: node.position.x,
                    y: node.position.y,
                },
            })),
        }),

        prisma.connection.createMany({
            data: edges.map((edge: any) => ({
                id: edge.id,
                workflowId: workflowId,
                fromNodeId: edge.source,
                toNodeId: edge.target,
                fromOutput: edge.sourceHandle ?? 'main',
                toInput: edge.targetHandle ?? 'main',
            })),
        }),

        prisma.workflow.update({
            where: { id: workflowId },
            data: { updatedAt: new Date() },
        }),
    ])

    return NextResponse.json({ success: true }, { status: 200 })
}
