import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "./ui/button";
import { Input } from "./ui/input";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image";
import { useCredential } from "@/lib/credentialRouter";

const AnthropicSettingSchema = z.object({
    variableName: z.string().min(1, "Name is required"),
    systemPrompt: z.string().optional(),
    userPrompt: z.string().min(1, "User prompt is required"),
    credentialId: z.string().min(1, "Credential is required"),
});

type AnthropicSettingForm = z.infer<typeof AnthropicSettingSchema>;


const AnthropicSetting = ({
    open,
    onOpenChange,
    onSubmit,
    variableName,
    credentialId,
    systemPrompt,
    userPrompt
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit?: (data: AnthropicSettingForm) => void;
    variableName?: string;
    credentialId?: string;
    systemPrompt?: string;
    userPrompt?: string;
}) => {
    const form = useForm<AnthropicSettingForm>({
        resolver: zodResolver(AnthropicSettingSchema),
        defaultValues: {
            variableName: variableName || "",
            credentialId: credentialId || "",
            systemPrompt: systemPrompt || "",
            userPrompt: userPrompt || "",
        },
    });
 const { getCredentials } = useCredential();
    const { data } = getCredentials;


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-xl rounded-xl p-0 overflow-hidden">
                {/* Header */}
                <div className="px-6 pt-6 ">
                    <DialogTitle className="text-base font-semibold">
                        Anthropic Configuration
                    </DialogTitle>
                </div>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="px-6 space-y-5"
                    >

                        {/* VARIABLE NAME */}
                        <FormField
                            control={form.control}
                            name="variableName"
                            render={({ field }) => (
                                <FormItem className="space-y-2">
                                    <FormLabel className="text-sm font-medium">
                                        Variable Name
                                    </FormLabel>

                                    <FormControl>
                                        <Input placeholder="Anthropiccall" {...field} />
                                    </FormControl>

                                    <FormDescription className="text-xs">
                                        Use this name to reference the result in other nodes:{" "}
                                        <span className="font-mono text-foreground">
                                            {`{{${form.watch("variableName")}.response}}`}
                                        </span>
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        
                        <FormField
                            control={form.control}
                            name="credentialId"
                            render={({ field }) => {
                                const selected = data?.find((c) => c.id === field.value)

                                const AnthropicCreds = data?.filter((c) => c.type === "ANTHROPIC") || []

                                return (
                                    <FormItem className="space-y-2">
                                        <FormLabel className="text-sm font-medium">
                                            Choose your credential
                                        </FormLabel>

                                        <FormControl>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className="w-full justify-start gap-2"
                                                    >
                                                        <Image
                                                            src="/images/anthropic.svg"
                                                            alt="Anthropic"
                                                            width={20}
                                                            height={20}
                                                        />

                                                        <span className="text-sm truncate">
                                                            {selected?.key || "Select Anthropic credential"}
                                                        </span>
                                                    </Button>
                                                </DropdownMenuTrigger>

                                                <DropdownMenuContent className="min-w-[220px]">
                                                    <DropdownMenuRadioGroup
                                                        value={field.value}
                                                        onValueChange={field.onChange}
                                                    >
                                                        {AnthropicCreds.length === 0 && (
                                                            <div className="px-3 py-2 text-xs text-muted-foreground">
                                                                No Anthropic credentials found
                                                            </div>
                                                        )}

                                                        {AnthropicCreds.map((cred) => (
                                                            <DropdownMenuRadioItem
                                                                key={cred.id}
                                                                value={cred.id}
                                                                className="flex items-center gap-2"
                                                            >
                                                                <Image
                                                                    src="/images/anthropic.svg"
                                                                    alt="Anthropic"
                                                                    width={18}
                                                                    height={18}
                                                                />
                                                                <span className="truncate">{cred.key}</span>
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


                        {/* SYSTEM PROMPT */}
                        <FormField
                            control={form.control}
                            name="systemPrompt"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-sm font-medium">
                                        System Prompt (Optional)
                                    </FormLabel>

                                    <FormControl>
                                        <textarea
                                            rows={4}
                                            className="w-full rounded-md border bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                                            placeholder="You are a helpful assistant."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* USER PROMPT */}
                        <FormField
                            control={form.control}
                            name="userPrompt"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel className="text-sm font-medium">
                                        User Prompt
                                    </FormLabel>

                                    <FormControl>
                                        <textarea
                                            rows={5}
                                            className="w-full rounded-md border bg-background px-3 py-2 text-sm resize-none font-mono focus:outline-none focus:ring-2 focus:ring-ring"
                                            placeholder="Summarize this text: {{json httpResponse.data}}"
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormDescription className="text-xs leading-relaxed">
                                        The prompt to send to the AI. Use{" "}
                                        <span className="font-mono">{`{{variables}}`}</span> for simple
                                        values or{" "}
                                        <span className="font-mono">{`{{json variable}}`}</span> to
                                        stringify objects.
                                    </FormDescription>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* FOOTER */}
                        <div className="flex justify-end py-2">
                            <Button
                                type="submit"
                                className="px-6"
                                onClick={() => onOpenChange(false)}
                            >
                                Save
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>


    );
};

export default AnthropicSetting;
