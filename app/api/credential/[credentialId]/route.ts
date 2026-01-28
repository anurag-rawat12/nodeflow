import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { requireAuth } from "@/lib/auth-utils"
import { Edge, Node } from "@xyflow/react";
import { encrypt } from "@/lib/encryption";

export async function DELETE(req: Request, { params }: { params: Promise<{ credentialId: string }> }) {
    const session = await requireAuth();
    const { credentialId } = await params;

    if (!credentialId) {
        return NextResponse.json(
            { error: "Credential ID is required" },
            { status: 400 }
        )
    }

    if (!session?.user?.id) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        )
    }

    const credential = await prisma.credential.delete({
        where: {
            id: credentialId,
            userId: session.user.id
        }
    })
    if (!credential) {
        return NextResponse.json(
            { error: "Workflow not found or you do not have permission to delete it" },
            { status: 404 }
        )
    }

    return NextResponse.json(credential, { status: 201 })
}

export async function PUT(req: Request, { params }: { params: Promise<{ credentialId: string }> }) {
    const session = await requireAuth();
    const { credentialId } = await params;
    const body = await req.json()
    const { key, value, type } = body

    if (!key || !value || !type) {
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

    const encryptedValue = encrypt(value);
    const credential = await prisma.credential.update({
        where: {
            id: credentialId,
            userId: session.user.id
        },
        data: { 
            key,
            value: encryptedValue,
            type
        }
    })

    return NextResponse.json(credential, { status: 201 })
}

export async function GET(req: Request, { params }: { params: Promise<{ credentialId: string }> }) {
    const session = await requireAuth();
    const { credentialId } = await params;

    if (!session?.user?.id) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        )
    }
    const credential = await prisma.credential.findUnique({
        where: {
            id: credentialId,
            userId: session.user.id
        }
    })
    return NextResponse.json(credential, { status: 201 })
}