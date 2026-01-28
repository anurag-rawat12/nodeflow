import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { requireAuth } from "@/lib/auth-utils"
import { encrypt } from "@/lib/encryption";

export async function POST(req: Request) {
    const session = await requireAuth();

    if (!session?.user?.id) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        )
    }

    const body = await req.json()
    const { key, value, type } = body

    if (!key || !value || !type) {
        return NextResponse.json(
            { error: "details is required" },
            { status: 400 }
        )
    }

    const encryptedValue = encrypt(value);
    const credential = await prisma.credential.create({
        data: {
            key,
            value: encryptedValue,
            type,
            userId: session.user.id,
        },
    })

    return NextResponse.json(credential, { status: 201 })
}

export async function GET(req: Request) {
    const session = await requireAuth();

    if (!session?.user?.id) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        )
    }
    const credential = await prisma.credential.findMany({
        where: {
            userId: session.user.id

        }
    })


    return NextResponse.json(credential, { status: 201 })
}