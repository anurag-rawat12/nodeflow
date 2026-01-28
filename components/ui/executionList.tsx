import Link from "next/link"
import { ChevronLeft, ChevronRight, MoreVerticalIcon, Workflow } from "lucide-react"
import Image from "next/image"

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

function timeAgo(date: string) {
  const diff = Math.floor(
    (Date.now() - new Date(date).getTime()) / 60000
  )

  if (diff < 1) return "just now"
  if (diff < 60) return `${diff} min ago`
  if (diff < 1440) return `${Math.floor(diff / 60)} hr ago`
  return `${Math.floor(diff / 1440)} d ago`
}

function statusStyle(status: string) {
  switch (status) {
    case "SUCCESS":
      return "bg-green-50 text-green-700 border-green-200"
    case "FAILED":
      return "bg-red-50 text-red-700 border-red-200"
    case "RUNNING":
      return "bg-blue-50 text-blue-700 border-blue-200"
    default:
      return "bg-muted text-muted-foreground border-border"
  }
}

type Props = {
  data: any[]
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

const ExecutionList = ({ data, page, totalPages, onPageChange }: Props) => {

  return (
    <div className="flex flex-col w-full">
      {/* List */}
      <div className="mx-auto mt-8 flex flex-col w-[65%] gap-3">
        {data.map((exec) => (
          <Link key={exec.id} href={`/execution/${exec.id}`}>
            <Card className="cursor-pointer border bg-background p-4 shadow-sm transition hover:shadow-md hover:border-primary/30">
              <CardContent className="flex items-center justify-between p-0">
                {/* Left */}
                <div className="flex items-center gap-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
                    <Workflow/>
                  </div>

                  <div className="space-y-0.5">
                    <CardTitle className="text-sm font-medium">
                      {exec.workflow.name || "Untitled Workflow"}
                    </CardTitle>

                    <CardDescription className="text-xs">
                      Started {timeAgo(exec.startedAt)}
                      {exec.finishedAt && (
                        <> · Finished {timeAgo(exec.finishedAt)}</>
                      )}
                    </CardDescription>
                  </div>
                </div>

                {/* Right */}
                <div className="flex items-center gap-3">
                  {/* Status Badge */}
                  <span
                    className={`rounded-full border px-2.5 py-1 text-xs font-medium ${statusStyle(exec.status)}`}
                  >
                    {exec.status}
                  </span>

                  {/* Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVerticalIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Pagination */}
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

        <p className="text-xs text-muted-foreground">
          Page <span className="font-medium">{page}</span> of{" "}
          <span className="font-medium">{totalPages}</span>
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

export default ExecutionList
