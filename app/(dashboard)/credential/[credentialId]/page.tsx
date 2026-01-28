"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

import { useCredential } from "@/lib/credentialRouter"
import Loader from "@/components/ui/Loader"
import { Eye, EyeClosed, EyeOff } from "lucide-react"
import Image from "next/image"
import { credential } from "../page"

const formSchema = z.object({
    key: z.string().min(1, "Key name is required"),
    type: z.string().min(1, "Provider is required"),
    value: z.string().min(1, "Secret is required"),
})

type FormValues = z.infer<typeof formSchema>

const Page = () => {
    const { updateCredential, getOneCredential } = useCredential()
    const params = useParams()

    const { data, isLoading } = getOneCredential(params.credentialId as string)

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            key: "",
            type: "",
            value: "",
        },
    })

    useEffect(() => {
        if (data) {
            form.reset({
                key: data.key || "",
                type: data.type || "",
                value: data.value || "",
            })
        }
    }, [data, form])

    const onSubmit = async (values: FormValues) => {
        await updateCredential.mutateAsync({
            credentialId: params.credentialId as string,
            key: values.key,
            type: values.type,
            value: values.value
        })
    }

    const [showSecret, setShowSecret] = useState(false)

    return (
        isLoading
            ? <Loader />
            :
            <div className="w-xl  mx-auto py-10">
                {/* Header */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold">Edit Credential</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Update secret used by your workflows.
                    </p>
                </div>

                {/* Form Card */}
                <div className="rounded-xl border bg-background p-6 shadow-sm">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-5"
                        >
                            {/* Key Name */}
                            <FormField
                                control={form.control}
                                name="key"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium">
                                            Credential Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder="my api key" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Provider */}
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium">
                                            Provider
                                        </FormLabel>
                                        <FormControl>
                                            <div className="flex gap-2 ">
                                                <Image src={
                                                    credential.find(c => c.type === data.type)?.icon
                                                }
                                                    alt={data.key} width={20} height={20} />
                                                <span className="text-sm">
                                                    {
                                                        credential.find(c => c.type === data.type)?.name
                                                    }
                                                </span>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Secret */}
                            <FormField
                                control={form.control}
                                name="value"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium">
                                            Secret Key
                                        </FormLabel>

                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type={showSecret ? "text" : "password"}
                                                    placeholder="sk-************************"
                                                    {...field}
                                                    className="pr-10"
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() => setShowSecret((prev) => !prev)}
                                                    className="absolute right-3 cursor-pointer top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                                >
                                                    {showSecret ? (
                                                        <Eye className="h-4 w-4" />
                                                    ) : (
                                                        <EyeOff className="h-4 w-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </FormControl>

                                        <p className="text-xs text-muted-foreground mt-1">
                                            This value is encrypted and never shown again.
                                        </p>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />


                            {/* Actions */}
                            <div className="pt-4 flex justify-end gap-3">
                                <Button
                                    type="submit"
                                    disabled={updateCredential.isPending}
                                    className="px-6"
                                >
                                    {updateCredential.isPending ? "Saving..." : "Save Changes"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
    )
}

export default Page
