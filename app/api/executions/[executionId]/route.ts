import { requireAuth } from "@/lib/auth-utils";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ executionId: string }> }) {

    const session = await requireAuth();
    const { executionId } = await params;

    if (!session?.user?.id) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        )
    }
    const res = prisma.execution.findMany({
        where: {
            id: executionId,
            workflow: {
                userID: session.user.id
            }
        },
        orderBy: {
            startedAt: 'desc'
        },
        include: {
            workflow: {
                select: {
                    name: true,
                    id: true
                }
            }
        }
    })

    return NextResponse.json(await res, { status: 200 })

}

