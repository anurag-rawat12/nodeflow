import { requireAuth } from "@/lib/auth-utils";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {

    const session = await requireAuth();

    if (!session?.user?.id) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        )
    }
    const res = prisma.execution.findMany({
        where: {
            workflow: {
                userID: session.user.id
            }
        },
        include:{
            workflow: true
        }
    })

    return NextResponse.json(await res, { status: 200 })

}