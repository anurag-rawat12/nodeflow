'use client'
import { Button } from '@/components/ui/button'
import Loader from '@/components/ui/Loader';
import WorkflowList from '@/components/ui/workflowlist';
import { useWorkflow } from '@/lib/workflowRouter'
import { Plus, Workflow } from 'lucide-react';
import { faker } from '@faker-js/faker';
import { useState } from 'react';

const workflow = () => {

  const { createWorkflow, getAllWorkflows } = useWorkflow();
  const { data, isLoading, error, refetch } = getAllWorkflows;
  const PAGE_SIZE = 6
  const [page, setPage] = useState(1)

  const workflows = data ?? []

  const totalPages = Math.max(
    1,
    Math.ceil(workflows.length / PAGE_SIZE)
  )

  const paginatedData = workflows.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  )

  return (
    <div className="flex flex-col">
      <div className="flex w-[45vw] items-center mx-auto justify-between">
        <div className="space-y-1">
          <p className="font-semibold">Workflows</p>
          <p className="text-sm text-muted-foreground">
            Create and manage your workflows.
          </p>
        </div>

        <Button onClick={async () => {
          const res = await createWorkflow.mutateAsync(faker.internet.username());
          // redirect(`/workflow/${res.id}`)

        }}>
          <Plus /> Create Workflow
        </Button>
      </div>

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
            <Workflow className="h-10 w-10 text-muted-foreground" />

            <p className="text-md font-medium text-muted-foreground">
              No workflows found
            </p>

            <p className="text-sm text-muted-foreground">
              Create your first workflow to get started.
            </p>
          </div>
        )}
        {data && data.length > 0 && <WorkflowList
          data={paginatedData}
          page={page}
          totalPages={totalPages}
          onPageChange={(newPage) => setPage(newPage)}
        />}
      </div>
    </div>
  )
}

export default workflow