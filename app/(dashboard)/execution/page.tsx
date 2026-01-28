"use client"

import { useState } from "react"
import { BoxIcon, Key, Plus, Workflow } from "lucide-react"

import { Button } from "@/components/ui/button"
import Loader from "@/components/ui/Loader"
import WorkflowList from "@/components/ui/workflowlist"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { useCredential } from "@/lib/credentialRouter"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { CredentialType } from '@prisma/client'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"
import CredentialList from "@/components/ui/credential-list"
import ExecutionList from "@/components/ui/executionList"
import { useExecution } from "@/lib/executionRouter"

export const credential = [
  {
    type: CredentialType.ANTHROPIC,
    name: "Anthropic",
    icon: "/images/anthropic.svg"
  },
  {
    type: CredentialType.GEMINI,
    name: "Gemini",
    icon: "/images/gemini.svg"
  },
  {
    type: CredentialType.GROK,
    name: "Grok",
    icon: "/images/grok.svg"
  },
  {
    type: CredentialType.OPENAI,
    name: "OpenAI",
    icon: "/images/openai.svg"
  }
]

const ExecutionPage = () => {
  const { getExecutions } = useExecution();

  const { data, isLoading, error, refetch } = getExecutions;

  const PAGE_SIZE = 6
  const [page, setPage] = useState(1)
  const [open, setOpen] = useState(false)

  const executions = data || []

  const totalPages = Math.max(1, Math.ceil(executions.length / PAGE_SIZE))

  const paginatedData = executions.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  )

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex w-[45vw] mx-auto items-center justify-between">
        <div className="space-y-1">
          <p className="font-semibold">Executions</p>
          <p className="text-sm text-muted-foreground">
            View your workflows execution history
          </p>
        </div>
      </div>



      <div className='flex justify-center items-center'>
        {
          isLoading &&
          <div className='mt-50'>
            <Loader />
          </div>
        }
        {
          error && <p className="text-center mt-50 text-red-500">Error loading executions.</p>
        }
        {data && data.length === 0 && (
          <div className="mt-40 flex flex-col items-center justify-center gap-3 text-center">
            <BoxIcon className="h-10 w-10 text-muted-foreground" />

            <p className="text-md font-medium text-muted-foreground">
              No execution history found
            </p>
          </div>
        )}
        {data && data.length > 0 && <ExecutionList
          data={paginatedData}
          page={page}
          totalPages={totalPages}
          onPageChange={(newPage) => setPage(newPage)}
        />}
      </div>

    </div>
  )
}

export default ExecutionPage
