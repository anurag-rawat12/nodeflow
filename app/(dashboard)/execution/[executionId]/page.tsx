"use client"

import { useState } from "react"
import { useParams, notFound } from "next/navigation"

import { Separator } from "@/components/ui/separator"
import { useExecution } from "@/lib/executionRouter"
import { Check, Cross, Dot, Signal, Ticket } from "lucide-react"

function statusUI(status: string) {
    switch (status) {
        case "SUCCESS":
            return {
                color: "text-green-600",
                bg: "bg-green-100",
                label: "Success",
                icon: "✓",
            }
        case "FAILED":
            return {
                color: "text-red-600",
                bg: "bg-red-100",
                label: "Failed",
                icon: "✕",
            }
        case "RUNNING":
            return {
                color: "text-blue-600",
                bg: "bg-blue-100",
                label: "Running",
                icon: "●",
            }
        default:
            return {
                color: "text-muted-foreground",
                bg: "bg-muted",
                label: "Pending",
                icon: "○",
            }
    }
}

export default function ExecutionDetailPage() {
    const params = useParams()
    const executionId = params.executionId as string

    const { getoneExecution } = useExecution()
    const { data: executions, isLoading, isError } =
        getoneExecution(executionId)

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto py-12 text-sm text-muted-foreground">
                Loading execution...
            </div>
        )
    }

    if (isError || !executions) {
        notFound()
    }

    return (
        <div className="max-w-4xl mx-auto py-10 space-y-8">

            {executions.map((execution) => {
                const isFailed = execution.status === "FAILED"
                const isSuccess = execution.status === "SUCCESS"
                const isRunning = execution.status === "RUNNING"

                return (
                    <div
                        key={execution.id}
                        className="w-full max-w-3xl rounded-2xl border bg-background p-8 shadow-sm transition hover:shadow-md"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4">
                                <div
                                    className={`flex h-10 w-10 items-center justify-center rounded-full ${isFailed
                                        ? "bg-red-100 text-red-600"
                                        : isSuccess
                                            ? "bg-green-100 text-green-600"
                                            : "bg-blue-100 text-blue-600"
                                        }`}
                                >
                                    {isFailed ? <Cross /> : isSuccess ? <Check /> : <Dot />}
                                </div>

                                <div className="space-y-1">
                                    <p
                                        className={`text-lg font-semibold ${isFailed
                                            ? "text-red-600"
                                            : isSuccess
                                                ? "text-green-600"
                                                : "text-blue-600"
                                            }`}
                                    >
                                        {execution.status.charAt(0) +
                                            execution.status.slice(1).toLowerCase()}
                                    </p>

                                    <p className="text-sm text-muted-foreground">
                                        Execution for{" "}
                                        <span className="text-foreground font-medium">
                                            {execution.workflow?.name}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            <p className="text-xs text-muted-foreground font-mono">
                                {execution.id.slice(-8)}
                            </p>
                        </div>

                        <div className="my-6 h-px bg-border" />

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                            <div>
                                <p className="text-muted-foreground">Workflow</p>
                                <p className="font-medium truncate">
                                    {execution.workflow?.name}
                                </p>
                            </div>

                            <div>
                                <p className="text-muted-foreground">Status</p>
                                <p className="font-medium">
                                    {execution.status}
                                </p>
                            </div>

                            <div>
                                <p className="text-muted-foreground">Started</p>
                                <p className="font-medium">
                                    {new Date(execution.startedAt).toLocaleString()}
                                </p>
                            </div>

                            <div>
                                <p className="text-muted-foreground">Event ID</p>
                                <p className="font-mono text-xs break-all">
                                    {execution.inngestEventId}
                                </p>
                            </div>
                        </div>


                        {execution.error && (
                            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                                <p className="font-medium mb-1">Error</p>
                                <pre className="text-xs whitespace-pre-wrap leading-relaxed">
                                    {execution.error}
                                </pre>
                            </div>
                        )}
                    </div>
                )
            })}





        </div>
    )
}
