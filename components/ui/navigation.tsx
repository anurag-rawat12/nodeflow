import Link from "next/link"

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "./button"
import { MoreVerticalIcon, Pencil, TrashIcon } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { Input } from "./input"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useState } from "react"

const NavigationHeader = ({ root, data, onSave }: { root: string, data: any, onSave: (v: string) => void }) => {
    const [value, setValue] = useState(data)
    const [open, setOpen] = useState(false)



    return (
        <div className="ml-2 mr-2 flex items-center justify-between">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link
                                className="text-[15px]"
                                href={`/${root}`}>{root}</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage
                            className="text-[15px]"
                        >{data}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="default"
                        size="sm"
                        onClick={(e) => e.stopPropagation()}
                        className="gap-2"
                    >
                        <Pencil className="h-4 w-4" />
                        Edit
                    </Button>
                </PopoverTrigger>

                <PopoverContent
                    align="end"
                    sideOffset={8}
                    onClick={(e) => e.stopPropagation()}
                    className="w-72 rounded-lg border bg-background p-4 shadow-md"
                >
                    <div className="flex flex-col gap-3">
                        <p className="text-sm font-medium">Edit workflow name</p>

                        <Input
                            value={value}
                            onChange={(e) => {
                                setValue(e.target.value)
                            }}
                            placeholder="Workflow name"
                        />


                        <div className="flex justify-end gap-2">
                            {/* CANCEL */}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setValue(data)
                                    setOpen(false)
                                }}
                            >
                                Cancel
                            </Button>

                            {/* SAVE */}
                            <Button
                                size="sm"
                                onClick={() => {
                                    onSave(value)
                                    setOpen(false)
                                }}
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )

}

export default NavigationHeader
