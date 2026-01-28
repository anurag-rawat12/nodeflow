import { inngest } from "@/inngest/Client";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    try {

        const url = new URL(req.url);
        const workflowId = url.searchParams.get("workflowId");

        if (!workflowId) {
            return NextResponse.json({
                message: "workflowId is required",
                status: 400
            });
        }

        const body = await req.json();

        const formData = {
            formId: body.formId,
            formTitle: body.formTitle,
            responseId: body.responseId,
            responses: body.responses,
            timestamp: body.timestamp,
            respondentEmail: body.respondentEmail,
            raw: body
        }

        const res = await inngest.send({
            name: "execute-workflow",
            data: {
                workflowId: workflowId,
                initialData: { googleForm: formData }
            }
        })

        return res;

    } catch (error) {
        return NextResponse.json({
            message: "google form error",
            status: 500
        });
    }
}