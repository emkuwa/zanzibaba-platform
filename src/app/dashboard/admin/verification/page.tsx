'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Dialog } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/utils'
import {
  getVerificationRequests,
  getVerificationStats,
  updateVerificationStatus,
  type VerificationRequest,
  type VerificationStatus,
} from '@/lib/verification/store'
import {
  Search,
  ShieldCheck,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Eye,
  Download,
  Building2,
  FileText,
  ExternalLink,
} from 'lucide-react'

const statusConfig: Record<string, { label: string; icon: React.ElementType; variant: 'warning' | 'default' | 'success' | 'danger' }> = {
  pending: { label: 'Pending', icon: Clock, variant: 'warning' },
  'under-review': { label: 'Under Review', icon: AlertCircle, variant: 'default' },
  approved: { label: 'Approved', icon: CheckCircle2, variant: 'success' },
  rejected: { label: 'Rejected', icon: XCircle, variant: 'danger' },
}

const tabs = ['all', 'pending', 'under-review', 'approved', 'rejected'] as const

const documentLabels: Record<string, string> = {
  businessLicense: 'Business License',
  tin: 'TIN Certificate',
  companyProfile: 'Company Profile',
  contactInfo: 'Contact Info',
}

export default function AdminVerificationPage() {
  const [activeTab, setActiveTab] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [reviewRequest, setReviewRequest] = useState<VerificationRequest | null>(null)
  const [reviewStatus, setReviewStatus] = useState<VerificationStatus>('pending')
  const [reviewNotes, setReviewNotes] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)

  const allRequests = getVerificationRequests()
  const stats = getVerificationStats()

  const filtered = useMemo(() => {
    let list = activeTab === 'all' ? allRequests : allRequests.filter((r) => r.status === activeTab)
    if (search) {
      const q = search.toLowerCase()
      list = list.filter((r) => r.companyName.toLowerCase().includes(q))
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [activeTab, search, allRequests])

  const openReview = (req: VerificationRequest) => {
    setReviewRequest(req)
    setReviewStatus(req.status)
    setReviewNotes(req.notes || '')
  }

  const handleUpdateStatus = () => {
    if (!reviewRequest) return
    setIsUpdating(true)
    setTimeout(() => {
      updateVerificationStatus(reviewRequest.id, reviewStatus, 'Admin Jane', reviewNotes)
      setReviewRequest(null)
      setIsUpdating(false)
    }, 800)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Verification Requests</h1>
        <p className="text-gray-500">Review and manage business verification requests</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <ShieldCheck className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-sm text-gray-500">Total</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.pending}</p>
              <p className="text-sm text-gray-500">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zanzibar-100">
              <AlertCircle className="h-6 w-6 text-zanzibar-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.underReview}</p>
              <p className="text-sm text-gray-500">Under Review</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.approved}</p>
              <p className="text-sm text-gray-500">Approved</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.rejected}</p>
              <p className="text-sm text-gray-500">Rejected</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by company name..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-1 rounded-lg border border-gray-200 p-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                activeTab === tab
                  ? 'bg-zanzibar-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              {tab === 'all' ? 'All' : tab.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            </button>
          ))}
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b text-sm text-gray-500">
                <th className="text-left py-4 px-6 font-medium">Company</th>
                <th className="text-left py-4 px-6 font-medium">Type</th>
                <th className="text-left py-4 px-6 font-medium">Status</th>
                <th className="text-center py-4 px-6 font-medium">Documents</th>
                <th className="text-left py-4 px-6 font-medium">Submitted</th>
                <th className="text-right py-4 px-6 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-sm text-gray-500">
                    No verification requests found
                  </td>
                </tr>
              )}
              {filtered.map((req) => {
                const info = statusConfig[req.status]
                const Icon = info.icon
                const docCount = Object.keys(req.documents).length
                return (
                  <tr key={req.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zanzibar-100">
                          <Building2 className="h-4 w-4 text-zanzibar-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{req.companyName}</p>
                          <p className="text-xs text-gray-500">{req.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant="outline" className="capitalize">
                        {req.profileType}
                      </Badge>
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant={info.variant} className="gap-1 capitalize">
                        <Icon className="h-3 w-3" />
                        {info.label}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={cn('text-sm font-medium', docCount === 4 ? 'text-green-600' : 'text-gray-600')}>
                        {docCount}/4
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500">
                      {formatDate(req.createdAt)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Button variant="outline" size="sm" onClick={() => openReview(req)}>
                        <Eye className="mr-1.5 h-3.5 w-3.5" /> Review
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Dialog open={!!reviewRequest} onClose={() => setReviewRequest(null)} title="Review Verification Request">
        {reviewRequest && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-zanzibar-100">
                <Building2 className="h-6 w-6 text-zanzibar-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{reviewRequest.companyName}</h3>
                <p className="text-sm text-gray-500">{reviewRequest.id} &middot; {reviewRequest.userId}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Badge variant="outline" className="capitalize">{reviewRequest.profileType}</Badge>
              <Badge variant={statusConfig[reviewRequest.status].variant} className="gap-1 capitalize">
                {statusConfig[reviewRequest.status].label}
              </Badge>
            </div>

            <Separator />

            <div>
              <h4 className="mb-3 text-sm font-medium text-gray-900">Documents</h4>
              <div className="space-y-2">
                {Object.entries(reviewRequest.documents).length === 0 && (
                  <p className="text-sm text-gray-500">No documents uploaded</p>
                )}
                {Object.entries(reviewRequest.documents).map(([key, filename]) => (
                  <div key={key} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{documentLabels[key] || key}</p>
                        <p className="text-xs text-gray-500">{filename}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="mb-3 text-sm font-medium text-gray-900">Update Status</h4>
              <div className="space-y-3">
                <Select
                  label="Status"
                  value={reviewStatus}
                  onChange={(e) => setReviewStatus(e.target.value as VerificationStatus)}
                  options={[
                    { value: 'pending', label: 'Pending' },
                    { value: 'under-review', label: 'Under Review' },
                    { value: 'approved', label: 'Approved' },
                    { value: 'rejected', label: 'Rejected' },
                  ]}
                />
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Admin Notes</label>
                  <textarea
                    className="min-h-[100px] w-full rounded-lg border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-zanzibar-500 focus:border-zanzibar-500"
                    placeholder="Add notes about this verification..."
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                  />
                </div>
                <Button className="w-full" onClick={handleUpdateStatus} disabled={isUpdating}>
                  {isUpdating ? 'Updating...' : 'Update Status'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  )
}
