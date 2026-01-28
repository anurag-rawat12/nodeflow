import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { FilePen, Link2 } from "lucide-react";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";


const httpSettingSchema = z.object({
    variableName: z.string().min(1, "Name is required"),
    method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
    endpoint: z.string().min(1, "Endpoint is required"),
    body: z.string().optional(),
});

type HttpSettingForm = z.infer<typeof httpSettingSchema>;


const methods = ["GET", "POST", "PUT", "PATCH", "DELETE"] as const;

const methodColors: Record<(typeof methods)[number], string> = {
    GET: "border-green-500 text-green-600 bg-green-50",
    POST: "border-blue-500 text-blue-600 bg-blue-50",
    PUT: "border-yellow-500 text-yellow-700 bg-yellow-50",
    PATCH: "border-purple-500 text-purple-600 bg-purple-50",
    DELETE: "border-red-500 text-red-600 bg-red-50",
};


const HttpSetting = ({
    open,
    onOpenChange,
    onSubmit,
    variableName,
    endpoint,
    method,
    body,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit?: (data: HttpSettingForm) => void;
    variableName?: string;
    endpoint?: string;
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    body?: string;
}) => {
    const form = useForm<HttpSettingForm>({
        resolver: zodResolver(httpSettingSchema),
        defaultValues: {
            variableName: variableName || "",
            method: method || "GET",
            endpoint: endpoint || "",
            body: body || "",
        },
    });

    const selectedMethod = form.watch("method");


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-130">
                <DialogHeader>
                    <DialogTitle>HTTP Request Settings</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        {/* name */}
                        <FormField
                            control={form.control}
                            name="variableName"
                            render={({ field }) => (
                                <FormItem className="space-y-2">
                                    <FormLabel className="text-sm font-medium">
                                        Variable Name
                                    </FormLabel>

                                    <FormControl>
                                        <div className="relative">
                                            <FilePen className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                                            <Input
                                                className="pl-9"
                                                placeholder="Enter workflow name"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>

                                    <FormDescription className="text-xs">
                                        use this name to reference the response in other nodes:
                                        {` {{${form.watch("variableName")}.httpResponse.data}}`}
                                    </FormDescription>

                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />


                        {/* METHOD */}
                        <FormField
                            control={form.control}
                            name="method"
                            render={({ field }) => (
                                <FormItem>
                                    <FormDescription>
                                        The HTTP method to use for this request
                                    </FormDescription>

                                    <FormControl>
                                        <div className="flex gap-2 flex-wrap">
                                            {methods.map((m) => (
                                                <button
                                                    type="button"
                                                    key={m}
                                                    onClick={() => field.onChange(m)}
                                                    className={cn(
                                                        "px-3 py-1.5 cursor-pointer rounded-full border text-sm font-medium transition",
                                                        field.value === m
                                                            ? methodColors[m]
                                                            : "border-muted text-muted-foreground hover:bg-muted"
                                                    )}
                                                >
                                                    {m}
                                                </button>
                                            ))}
                                        </div>
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* ENDPOINT */}
                        <FormField
                            control={form.control}
                            name="endpoint"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Endpoint URL</FormLabel>

                                    <FormControl>
                                        <div className="relative">
                                            <Link2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                className="pl-9"
                                                placeholder="https://api.example.com/users/{{id}}"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>

                                    <FormDescription>
                                        Static URL or use{" "}
                                        <span className="font-mono">
                                            {"{{variables}}"}
                                        </span>{" "}
                                        or{" "}
                                        <span className="font-mono">
                                            {"{{json}}"}
                                        </span>
                                    </FormDescription>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* REQUEST BODY */}
                        {selectedMethod !== "GET" && (
                            <FormField
                                control={form.control}
                                name="body"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Request Body</FormLabel>

                                        <FormControl>
                                            <textarea
                                                rows={7}
                                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                                placeholder={`{
  "userId": "{{httpResponse.data.id}}",
  "name": "{{httpResponse.data.name}}",
  "items": "{{httpResponse.data.items}}"
}`}
                                                {...field}
                                            />
                                        </FormControl>

                                        <FormDescription>
                                            JSON with template variables. Use{" "}
                                            <span className="font-mono">
                                                {"{{variables}}"}
                                            </span>{" "}
                                            for simple values or{" "}
                                            <span className="font-mono">
                                                {"{{json variable}}"}
                                            </span>{" "}
                                            to stringify objects
                                        </FormDescription>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="submit" onClick={() => onOpenChange(false)}>Save Request</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default HttpSetting;
