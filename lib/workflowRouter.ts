'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useWorkflow() {
  const queryClient = useQueryClient()

  // CREATE
  const createWorkflow = useMutation({
    mutationFn: async (name: string) => {
      const res = await fetch('/api/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })

      if (!res.ok) throw new Error('Failed to create workflow')
      return res.json()
    },
    onSuccess: (workflow) => { 
      queryClient.invalidateQueries({ queryKey: ['workflows'] })
      toast.success(`Workflow ${workflow.name} created`)
    },
  })

  // REMOVE
  const removeWorkflow = useMutation({
    mutationFn: async (workflowId: string) => {
      const res = await fetch(`/api/workflows/${workflowId}`, {
        method: 'DELETE',
      })

      if (!res.ok) throw new Error('Failed to delete workflow')
      return null
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] })
      toast.success('Workflow deleted successfully')
    },
  })

  // UPDATE
  const updateNameWorkflow = useMutation({
    mutationFn: async ({
      name,
      workflowId,
    }: {
      name: string
      workflowId: string
    }) => {
      const res = await fetch(`/api/workflows/${workflowId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })

      if (!res.ok) throw new Error('Failed to update workflow')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] })
      toast.success('Workflow updated successfully')
    },
  })

  // GET ONE
  const getOneWorkflow = (workflowId: string) =>
    useQuery({
      queryKey: ['workflows', workflowId],
      enabled: !!workflowId,
      queryFn: async () => {
        const res = await fetch(`/api/workflows/${workflowId}`)

        if (!res.ok) {
          throw new Error('Failed to fetch workflow')
        }

        return res.json()
      },
    })

  // GET ALL
  const getAllWorkflows = useQuery({
    queryKey: ['workflows'],
    queryFn: async () => {
      const res = await fetch('/api/workflows')

      if (!res.ok) {
        throw new Error('Failed to fetch workflows')
      }

      return res.json()
    },
  })

  return {
    createWorkflow,
    removeWorkflow,
    updateNameWorkflow,
    getOneWorkflow,
    getAllWorkflows,
  }
}
