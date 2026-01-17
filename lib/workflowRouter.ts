'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { NodeProps } from '@xyflow/react'
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

  type Node = {
    id: string
    type: string
    data?: Record<string, any>
    position: { x: number, y: number }
  }
  type Edge = {
    id: string
    source: string
    target: string
    sourceHandle?: string | null
    targetHandle?: string | null

  }
  // UPDATE
  const updateWorkflow = useMutation({
    mutationFn: async ({
      workflowId,
      nodes,
      edges,
    }: {
      workflowId: string
      nodes: Node[]
      edges: Edge[]
    }) => {
      const res = await fetch(`/api/workflows/data/${workflowId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nodes, edges
        }),
      })

      if (!res.ok) throw new Error('Failed to update workflow')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] })
      toast.success('Workflow saved successfully')
    },
  })

  // UPDATE NAME
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

  // DELETE NODE
  const deleteNode = useMutation({
    mutationFn: async (nodeId: string) => {

      const res = await fetch(`/api/nodes/${nodeId}`, {
        method: 'DELETE',
      })

      if (!res.ok) throw new Error('Failed to delete node')
      return null;

    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] })
      toast.success('Node deleted successfully')
    },
  })

  return {
    createWorkflow,
    removeWorkflow,
    updateNameWorkflow,
    getOneWorkflow,
    getAllWorkflows,
    updateWorkflow,
    deleteNode
  }
}
