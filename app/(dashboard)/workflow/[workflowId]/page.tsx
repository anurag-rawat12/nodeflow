import WorkflowDetails from '@/components/ui/workflowdetails';
import { requireAuth } from '@/lib/auth-utils'



const WorkflowEditor = async ({ params }: { params: Promise<{ workflowId: string }> }) => {

  await requireAuth();
  const { workflowId } = await params;

  return (
    <div>
      <WorkflowDetails workflowId={workflowId} />
    </div>
  )
}

export default WorkflowEditor