import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { requireAuth } from "@/lib/auth-utils"
import { NodeType } from '@prisma/client'

export async function POST(req: Request) {
  const session = await requireAuth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  const body = await req.json()
  const { name } = body

  if (!name) {
    return NextResponse.json(
      { error: "Name is required" },
      { status: 400 }
    )
  }

  const workflow = await prisma.workflow.create({
    data: {
      name,
      userID: session.user.id,
      nodes:{
        create:{
          type:NodeType.INITIAL,
          name:NodeType.INITIAL,
          position:{ x:0, y:0},
        }
      }
    },
  })

  return NextResponse.json(workflow, { status: 201 })
}

export async function GET(req: Request) {
  const session = await requireAuth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }
  const workflow = await prisma.workflow.findMany({
    where: {
      userID: session.user.id
    }
  })


  return NextResponse.json(workflow, { status: 201 })
}