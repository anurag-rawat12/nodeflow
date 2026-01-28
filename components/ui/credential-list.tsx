import Link from "next/link"
import { ChevronLeft, ChevronRight, MoreVerticalIcon, TrashIcon, Workflow } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardTitle,
} from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useWorkflow } from "@/lib/workflowRouter"
import Image from "next/image"
import { credential } from "@/app/(dashboard)/credential/page"
import { useCredential } from "@/lib/credentialRouter"

function timeAgo(date: string) {
    const diff = Math.floor(
        (Date.now() - new Date(date).getTime()) / 60000
    )

    if (diff < 60) return `${diff} minutes ago`
    if (diff < 1440) return `${Math.floor(diff / 60)} hours ago`
    return `${Math.floor(diff / 1440)} days ago`
}

type Props = {
    data: any[]
    page: number
    totalPages: number
    onPageChange: (page: number) => void
}

const CredentialList = ({ data, page, totalPages, onPageChange }: Props) => {

    const {removeCredential} = useCredential();

    return (
        <div className="flex flex-col w-full">

            <div className="mx-auto mt-8 flex flex-col w-[65%] gap-4">
                {data.map((cred) => (
                    <Link
                        key={cred.id}
                        href={`/credential/${cred.id}`}
                    >
                        <Card className="cursor-pointer bg-background p-4 border border-gray-200 shadow-none transition hover:shadow">
                            <CardContent className="flex items-center justify-between p-0">

                                <div className="flex items-center gap-3">
                                    <Image src={
                                        credential.find(c => c.type === cred.type)?.icon
                                    }
                                     alt={cred.key} width={25} height={25} />

                                    <div>
                                        <CardTitle className="text-base font-medium">
                                            {cred.key}
                                        </CardTitle>

                                        <CardDescription className="text-xs">
                                            <span>
                                                Updated {timeAgo(cred.updatedAt)}
                                            </span>
                                            <span> · Created {timeAgo(cred.createdAt)}</span>
                                        </CardDescription>
                                    </div>
                                </div>


                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="link"
                                            size="icon"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <MoreVerticalIcon className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent
                                        align="end"
                                        onClick={(e) => e.stopPropagation()}
                                        className="border border-muted p-1"
                                    >
                                        <DropdownMenuItem className="flex gap-2 cursor-pointer text-destructive focus:bg-destructive/10"
                                        onClick={() => {
                                            removeCredential.mutate({credentialId: cred.id});
                                        }}
                                        >
                                            <TrashIcon className="h-4 w-4" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            <div className="mx-auto mt-6 flex w-[65%] items-center justify-between">
                <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => onPageChange(page - 1)}
                >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Prev
                </Button>

                <p className="text-sm text-muted-foreground">
                    Page <span className="font-medium text-muted-foreground">{page}</span> of{" "}
                    <span className="font-medium text-muted-foreground">{totalPages}</span>
                </p>

                <Button
                    variant="outline"
                    size="sm"
                    disabled={page === totalPages}
                    onClick={() => onPageChange(page + 1)}
                >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
            </div>
        </div>
    )
}

export default CredentialList