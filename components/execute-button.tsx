import React from 'react'
import { Button } from './ui/button'
import { FlaskConicalIcon } from 'lucide-react'
import { execute } from '@/lib/workflow-execution'
import { toast } from 'sonner'

const ExecuteButton = ({
    workflowId
}: {
    workflowId: string
}) => {

    const handleExecute = async () => {
        const res = await execute({ workflowId })
        if (res) {
            return toast.success(`Workflow ${res.name} executed`)
        }
        return toast.error("Failed to start workflow execution")
    }

    return (
        <Button
            size="lg"
            onClick={handleExecute}
            disabled={false}
        >
            <FlaskConicalIcon />
            Execute Workflow
        </Button>
    )
}

export default ExecuteButton