'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { File, Loader, LoaderIcon, Pencil, Save } from 'lucide-react'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Input } from '@/components/ui/input'
import { Button } from './button'

interface NavigationHeaderProps {
  root: string
  data: string
  onSave: (value: string) => void
  onWorkflowSave?: () => void
  loading: boolean
}

const NavigationHeader = ({
  root,
  data,
  onSave,
  onWorkflowSave,
  loading
}: NavigationHeaderProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(data)

  // Keep local state in sync if parent updates name
  useEffect(() => {
    setValue(data)
  }, [data])

  return (
    <header className="mx-2 flex justify-between h-12 items-center">
      <Breadcrumb>
        <BreadcrumbList>
          {/* Root */}
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link
                href={`/${root}`}
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                {root}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          {/* Editable Workflow Name */}
          <BreadcrumbItem>
            <HoverCard openDelay={150} closeDelay={100}>
              <HoverCardTrigger asChild>
                <div
                  className="group flex items-center gap-1"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsEditing(true)
                  }}
                >
                  {!isEditing ? (
                    <>
                      <BreadcrumbPage className="text-sm font-medium">
                        {data}
                      </BreadcrumbPage>

                      <Pencil className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                    </>
                  ) : (
                    <Input
                      value={value}
                      autoFocus
                      className="h-7 w-[200px]"
                      onChange={(e) => setValue(e.target.value)}
                      onBlur={() => {
                        setValue(data)
                        setIsEditing(false)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          if (value.trim()) {
                            onSave(value.trim())
                          }
                          setIsEditing(false)
                        }

                        if (e.key === 'Escape') {
                          setValue(data)
                          setIsEditing(false)
                        }
                      }}
                    />
                  )}
                </div>
              </HoverCardTrigger>

              {!isEditing && (
                <HoverCardContent
                  align="start"
                  side="bottom"
                  className="w-auto px-2 py-1 text-xs text-muted-foreground"
                >
                  Click to rename workflow
                </HoverCardContent>
              )}
            </HoverCard>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Button
        variant="default"
        size="sm"
        onClick={onWorkflowSave}
        disabled={loading}
        className='flex justify-between items-center mr-4 gap-2'
      >
        <Save />
        {
          loading ? <LoaderIcon className="h-5 w-5 animate-spin text-white animation-duration-[2.5s]" /> : 'Save'
        }
      </Button>

    </header >
  )
}

export default NavigationHeader
