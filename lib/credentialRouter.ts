'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useCredential() {
    const queryClient = useQueryClient()

    const createCredential = useMutation({
        mutationFn: async ({ key, value, type }: { key: string, value: string, type: string }) => {
            const res = await fetch("/api/credential", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key, value, type })
            })
            if (!res.ok) throw new Error('Failed to create credential')
            return res.json()
        },
        onSuccess: (credential) => {
            queryClient.invalidateQueries({ queryKey: ['credentials'] })
            toast.success(`Credential created successfully`)
        },
    })

    const updateCredential = useMutation({
        mutationFn: async (
            { credentialId, key, value, type }:
                { credentialId: string, key: string, value: string, type: string }) => {

            const res = await fetch(`/api/credential/${credentialId}`, {
                method: "PUT",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key, value, type })
            })


            if (!res.ok) throw new Error('Failed to update credential')
            return res.json()
        },
        onSuccess: (credential) => {
            queryClient.invalidateQueries({ queryKey: ["credentials"] })
            queryClient.invalidateQueries({ queryKey: ["credential", credential.id] })
            toast.success(`Credential updated successfully`)
        },
    })

    const removeCredential = useMutation({
        mutationFn: async ({ credentialId }: { credentialId: string }) => {
            const res = await fetch(`/api/credential/${credentialId}`, {
                method: "DELETE"
            })
            if (!res.ok) throw new Error('Failed to delete credential')
            return res.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['credentials'] })
            toast.success(`Credential deleted successfully`)
        },
    })

    const getCredentials = useQuery({
        queryKey: ['credentials'],
        queryFn: async () => {
            const res = await fetch("/api/credential")
            if (!res.ok) throw new Error('Failed to fetch credentials')
            return res.json()
        }
    })

    const getOneCredential = (credentialId: string) => useQuery({
        queryKey: ['credentials', credentialId],
        enabled: !!credentialId,
        queryFn: async () => {
            const res = await fetch(`/api/credential/${credentialId}`)

            if (!res.ok) throw new Error('Failed to fetch credentials')

            return res.json()
        }
    })

    return {
        createCredential,
        getCredentials,
        removeCredential,
        updateCredential,
        getOneCredential
    }
}