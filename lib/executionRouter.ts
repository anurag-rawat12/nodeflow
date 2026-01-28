import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useExecution() {
    const queryClient = useQueryClient()

    const getoneExecution = (executionId: string) =>
        useQuery({
            queryKey: ['execution', executionId],
            enabled: !!executionId,
            queryFn: async () => {
                const res = await fetch(`/api/executions/${executionId}`)
                if (!res.ok) throw new Error('Failed to fetch execution')
                return res.json()
            }
        })



    const getExecutions = useQuery({
        queryKey: ['executions'],
        queryFn: async () => {
            const res = await fetch('/api/executions')

            if (!res.ok) {
                throw new Error('Failed to fetch executions')
            }

            return res.json()
        },
    })



    return {
        getoneExecution,
        getExecutions
    }
}