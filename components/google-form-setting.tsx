'use client'

import { useParams } from 'next/navigation'
import { toast } from 'sonner'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { generateGoogleFormScript } from '@/lib/google-form-script'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const GoogleFormSetting = ({ open, onOpenChange }: Props) => {
  const params = useParams()
  const workflowId = params?.workflowId as string

  const baseUrl =
    process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'

  const webhookUrl = `${baseUrl}/api/webhooks/google-form?workflowId=${workflowId}`

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(webhookUrl)
      toast.success('Copied to clipboard')
    } catch (err) {
      toast.error('Failed to copy to clipboard')
    }
  }

  const copyScript = async () => {
    const script = generateGoogleFormScript(webhookUrl)
    try {
      await navigator.clipboard.writeText(script)
      toast.success('Copied script to clipboard')
    } catch (err) {
      toast.error('Failed to copy script to clipboard')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Google Form Integration</DialogTitle>
          <DialogDescription>
            Connect your Google Form to this workflow using the webhook
            and Apps Script below.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-2 rounded-xl border bg-muted/40 p-4">
          <div className="text-sm font-semibold">
            Webhook URL
          </div>

          <p className="text-sm text-muted-foreground">
            Add this URL as the action endpoint in your Google Form
            integration or Apps Script.
          </p>

          <Input
            readOnly
            value={webhookUrl}
            className="font-mono text-xs"
          />

          <Button
            onClick={copyToClipboard}
            variant="secondary"
            className="w-full"
          >
            Copy Webhook URL
          </Button>
        </div>

        <div className="mt-4 rounded-xl border bg-muted/40 p-4">
          <div className="text-sm font-semibold">
            Google Apps Script
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            Paste this script into{" "}
            <span className="font-medium text-foreground">
              Extensions → Apps Script
            </span>{" "}
            inside your Google Form. It will send every form submission
            directly to your webhook.
          </p>

          <Button
            onClick={copyScript}
            variant="secondary"
            className="w-full"
          >
            Copy Webhook Script
          </Button>
        </div>

        <div className="mt-4 rounded-xl border bg-muted/40 p-4">
          <div className="text-sm font-semibold">
            use the following Variables
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            {"{{googleForm.responseEmail}}"} - The email address of the respondent <br />
            {"{{googleForm.responses['Question Name']}}"} - Specific answer <br />
            {"{json googleForm.responses}"} - All responses as JSON.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default GoogleFormSetting