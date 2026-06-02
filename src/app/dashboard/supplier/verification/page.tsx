'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Upload, CheckCircle2, Clock, AlertCircle, XCircle, FileText, Building2, ScrollText, Phone, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const statusConfig: Record<string, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  pending: { label: 'Pending', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  'under-review': { label: 'Under Review', icon: AlertCircle, color: 'text-blue-600', bg: 'bg-blue-100' },
  approved: { label: 'Approved', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100' },
  rejected: { label: 'Rejected', icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' },
}

const steps = [
  { key: 'pending', label: 'Submitted' },
  { key: 'under-review', label: 'Under Review' },
  { key: 'approved', label: 'Approved' },
]

const documentFields = [
  { key: 'businessLicense' as const, label: 'Business License', icon: Building2, description: 'Valid business registration certificate' },
  { key: 'tin' as const, label: 'TIN Certificate', icon: ScrollText, description: 'Tax Identification Number certificate' },
  { key: 'companyProfile' as const, label: 'Company Profile', icon: FileText, description: 'Company overview and portfolio' },
  { key: 'contactInfo' as const, label: 'Contact Information', icon: Phone, description: 'Official contact details' },
]

const statusHistory = [
  { status: 'pending', date: '2025-05-28', label: 'Verification submitted' },
  { status: 'under-review', date: '2025-05-30', label: 'Documents under review' },
  { status: 'approved', date: '2025-05-31', label: 'Verification approved' },
]

const mockCurrentStatus: 'pending' | 'under-review' | 'approved' | 'rejected' = 'pending'
const mockRejectionNotes = 'Business license is expired. Please upload a current valid license.'

function ProgressStep({ active, completed, label, isLast }: { active: boolean; completed: boolean; label: string; isLast: boolean }) {
  return (
    <div className="flex items-center">
      <div className="flex flex-col items-center">
        <div
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors',
            completed
              ? 'border-green-500 bg-green-500 text-white'
              : active
                ? 'border-zanzibar-500 bg-zanzibar-500 text-white'
                : 'border-gray-300 bg-white text-gray-400'
          )}
        >
          {completed ? <CheckCircle2 className="h-5 w-5" /> : active ? <div className="h-2.5 w-2.5 rounded-full bg-white" /> : <div className="h-2.5 w-2.5 rounded-full bg-gray-300" />}
        </div>
        <span className={cn('mt-2 text-xs font-medium', active || completed ? 'text-gray-900' : 'text-gray-400')}>{label}</span>
      </div>
      {!isLast && (
        <div
          className={cn(
            'h-0.5 w-16 sm:w-24 md:w-32',
            completed ? 'bg-green-500' : 'bg-gray-200'
          )}
        />
      )}
    </div>
  )
}

export default function SupplierVerificationPage() {
  const [currentStatus, setCurrentStatus] = useState(mockCurrentStatus)
  const [documents, setDocuments] = useState<Record<string, string>>({
    businessLicense: 'license_tz_builders.pdf',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const uploadedCount = Object.keys(documents).length
  const canSubmit = uploadedCount >= 2
  const currentStepIndex = steps.findIndex((s) => s.key === currentStatus)
  const effectiveStepIndex = currentStatus === 'rejected' ? 0 : Math.max(0, currentStepIndex)

  const handleFileUpload = useCallback((key: string) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.pdf,.jpg,.jpeg,.png,.doc,.docx'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        setDocuments((prev) => ({ ...prev, [key]: file.name }))
      }
    }
    input.click()
  }, [])

  const handleSubmit = useCallback(() => {
    if (!canSubmit) return
    setIsSubmitting(true)
    setTimeout(() => {
      setCurrentStatus('under-review')
      setIsSubmitting(false)
    }, 1500)
  }, [canSubmit])

  const currentStatusInfo = statusConfig[currentStatus]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Business Verification</h1>
        <p className="text-gray-500">Verify your business to build trust with customers</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Verification Status</CardTitle>
          <CardDescription>Track the progress of your verification request</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-3 rounded-lg border p-4">
            <div className={cn('flex h-12 w-12 items-center justify-center rounded-full', currentStatusInfo.bg)}>
              <currentStatusInfo.icon className={cn('h-6 w-6', currentStatusInfo.color)} />
            </div>
            <div>
              <p className="font-semibold text-gray-900">{currentStatusInfo.label}</p>
              <p className="text-sm text-gray-500">
                {currentStatus === 'pending' && 'Your verification is queued for review'}
                {currentStatus === 'under-review' && 'An admin is reviewing your documents'}
                {currentStatus === 'approved' && 'Your business is verified. You can now access all features'}
                {currentStatus === 'rejected' && 'Your verification was not approved. See details below'}
              </p>
            </div>
          </div>

          {currentStatus !== 'rejected' && (
            <div className="flex items-center justify-center gap-0 py-4">
              {steps.map((step, idx) => (
                <ProgressStep
                  key={step.key}
                  label={step.label}
                  active={effectiveStepIndex === idx}
                  completed={idx < effectiveStepIndex}
                  isLast={idx === steps.length - 1}
                />
              ))}
            </div>
          )}

          {currentStatus === 'rejected' && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <div className="flex items-start gap-3">
                <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                <div>
                  <p className="font-semibold text-red-800">Rejection Reason</p>
                  <p className="mt-1 text-sm text-red-700">{mockRejectionNotes}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Required Documents</CardTitle>
          <CardDescription>
            Upload {uploadedCount}/4 documents
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {documentFields.map((field) => {
            const uploaded = documents[field.key]
            return (
              <div
                key={field.key}
                className={cn(
                  'flex items-center justify-between rounded-lg border p-4 transition-colors',
                  uploaded ? 'border-green-200 bg-green-50' : 'border-dashed border-gray-300'
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', uploaded ? 'bg-green-100' : 'bg-gray-100')}>
                    {uploaded ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <field.icon className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{field.label}</p>
                    <p className="text-xs text-gray-500">
                      {uploaded ? (
                        <span className="text-green-700">{uploaded}</span>
                      ) : (
                        field.description
                      )}
                    </p>
                  </div>
                </div>
                <Button
                  variant={uploaded ? 'outline' : 'secondary'}
                  size="sm"
                  onClick={() => handleFileUpload(field.key)}
                >
                  {uploaded ? (
                    <>Replace</>
                  ) : (
                    <><Upload className="mr-1.5 h-3.5 w-3.5" /> Upload</>
                  )}
                </Button>
              </div>
            )
          })}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between rounded-lg border bg-gray-50 p-4">
        <div>
          <p className="text-sm font-medium text-gray-900">
            {canSubmit
              ? 'All minimum documents uploaded. Submit for review.'
              : `Upload at least ${2 - uploadedCount} more document(s) to submit.`}
          </p>
          <p className="text-xs text-gray-500">Minimum 2 documents required</p>
        </div>
        <Button onClick={handleSubmit} disabled={!canSubmit || isSubmitting}>
          {isSubmitting ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</>
          ) : (
            'Submit for Review'
          )}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Status History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-0">
            {statusHistory.map((item, idx) => {
              const info = statusConfig[item.status]
              const Icon = info.icon
              return (
                <div key={idx} className="relative flex gap-4 pb-6 last:pb-0">
                  {idx < statusHistory.length - 1 && (
                    <div className="absolute left-[17px] top-8 h-full w-0.5 bg-gray-200" />
                  )}
                  <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-full', info.bg)}>
                    <Icon className={cn('h-4 w-4', info.color)} />
                  </div>
                  <div className="pt-1">
                    <p className="text-sm font-medium text-gray-900">{item.label}</p>
                    <p className="text-xs text-gray-500">{item.date}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
