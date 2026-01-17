import prisma from "@/lib/prisma";

export async function DELETE(req: Request, { params }: { params: Promise<{ nodeId: string }> }) {

    const { nodeId } = await params;

    const res = await prisma.node.delete({
        where: {
            id: nodeId
        }
    })

    if (!res) {
        return new Response("Node not found", { status: 404 });
    }

    return new Response(null, { status: 204 });
}