"use client"

import { useState } from "react"
import { Key, Plus, Workflow } from "lucide-react"

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
import { CredentialType } from "@/app/generated/prisma/enums"
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

const CredentialPage = () => {
  const { createCredential, getCredentials } = useCredential()

  const { isLoading, data, error } = getCredentials

  const PAGE_SIZE = 6
  const [page, setPage] = useState(1)
  const [open, setOpen] = useState(false)

  const credentials = getCredentials.data || []

  const totalPages = Math.max(1, Math.ceil(credentials.length / PAGE_SIZE))

  const paginatedData = credentials.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  )

  const formSchema = z.object({
    key: z.string().min(1, "name is required"),
    value: z.string().min(1, "name is required"),
    type: z.string()
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      key: "",
      type: "OPENAI",
      value: ""
    },
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const res = await createCredential.mutateAsync({
      type: data.type,
      key: data.key,
      value: data.value
    })

    setOpen(false)

  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex w-[45vw] mx-auto items-center justify-between">
        <div className="space-y-1">
          <p className="font-semibold">Credentials</p>
          <p className="text-sm text-muted-foreground">
            Create and manage your credentials.
          </p>
        </div>

        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Credential
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Credential</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="key"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Key name
                    </FormLabel>

                    <FormControl>
                      <Input placeholder="myAI" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => {
                  const selected = credential.find((c) => c.type === field.value)

                  return (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Type
                      </FormLabel>

                      <FormControl>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start gap-2"
                            >
                              <Image
                                src={selected?.icon || "/images/openai.svg"}
                                alt={selected?.name || "OpenAI"}
                                width={20}
                                height={20}
                              />
                              <span className="text-sm">
                                {selected?.name || "OpenAI"}
                              </span>
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent className="min-w-[220px]">
                            <DropdownMenuRadioGroup
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              {credential.map((c) => (
                                <DropdownMenuRadioItem
                                  key={c.type}
                                  value={c.type}
                                  className="flex items-center gap-2"
                                >
                                  <Image
                                    src={c.icon}
                                    alt={c.name}
                                    width={18}
                                    height={18}
                                  />
                                  <span>{c.name}</span>
                                </DropdownMenuRadioItem>
                              ))}
                            </DropdownMenuRadioGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )
                }}
              />



              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Key value
                    </FormLabel>

                    <FormControl>
                      <Input placeholder="*********" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>

                <Button type="submit">
                  Save
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>


      <div className='flex justify-center items-center'>
        {
          isLoading &&
          <div className='mt-50'>
            <Loader />
          </div>
        }
        {
          error && <p className="text-center mt-50 text-red-500">Error loading workflows.</p>
        }
        {data && data.length === 0 && (
          <div className="mt-40 flex flex-col items-center justify-center gap-3 text-center">
            <Key className="h-10 w-10 text-muted-foreground" />

            <p className="text-md font-medium text-muted-foreground">
              No credential found
            </p>

            <p className="text-sm text-muted-foreground">
              Create your first credential to get started.
            </p>
          </div>
        )}
        {data && data.length > 0 && <CredentialList
          data={paginatedData}
          page={page}
          totalPages={totalPages}
          onPageChange={(newPage) => setPage(newPage)}
        />}
      </div>

    </div>
  )
}

export default CredentialPage
