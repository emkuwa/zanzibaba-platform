'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { FileText, Download, Calendar, BarChart3, TrendingUp, Users, Package, Building2, DollarSign, Shield, Store, HardHat, FileSpreadsheet } from 'lucide-react'

const reportTypes = [
  { id: 'supplier-acquisition', label: 'Supplier Acquisition Report', icon: Store, desc: 'All suppliers with signup dates, status, verification, and product counts' },
  { id: 'contractor-acquisition', label: 'Contractor Acquisition Report', icon: HardHat, desc: 'All contractors with signup dates, status, and verification' },
  { id: 'product-catalog', label: 'Product Catalog Report', icon: Package, desc: 'All products by supplier with categories, pricing, and status' },
  { id: 'rfq-analysis', label: 'RFQ Analysis Report', icon: FileText, desc: 'All RFQs with category, budget range, quotes received, and status' },
  { id: 'revenue-summary', label: 'Revenue Summary Report', icon: DollarSign, desc: 'Revenue by source (verification, featured, memberships) with date range' },
  { id: 'verification-status', label: 'Verification Status Report', icon: Shield, desc: 'All verification requests with status, documents, and review dates' },
  { id: 'user-growth', label: 'User Growth Report', icon: TrendingUp, desc: 'New user registrations over time by role type' },
  { id: 'marketplace-health', label: 'Marketplace Health Report', icon: BarChart3, desc: 'Comprehensive marketplace metrics in a single report' },
]

const sampleData = {
  'supplier-acquisition': { headers: ['Company Name', 'Email', 'Category', 'Products', 'Verified', 'Joined Date', 'Membership'], rows: [
    ['Zanzibar Cement Ltd', 'info@zanzibarcement.com', 'Building Materials', '85', 'Yes', '2025-03-15', 'Premium'],
    ['Swahili Build Mart', 'sales@swahilibuild.com', 'Building Materials', '320', 'Yes', '2025-03-18', 'Premium'],
    ['Ocean View Interiors', 'hello@oceanview.co.tz', 'Furniture', '156', 'Yes', '2025-03-22', 'Professional'],
    ['Spice Island Hardware', 'orders@spiceisland.com', 'Building Materials', '450', 'Yes', '2025-04-01', 'Professional'],
    ['Modern Interiors Ltd', 'info@moderninteriors.com', 'Furniture', '134', 'Yes', '2025-04-05', 'Professional'],
    ['Green Energy Solutions', 'sales@greenenergy.co.tz', 'Electrical', '45', 'No', '2025-04-10', 'Basic'],
    ['Cool Breeze HVAC', 'info@coolbreeze.com', 'HVAC', '52', 'No', '2025-04-15', 'Basic'],
    ['Premium Paints Tanzania', 'info@premiumpaints.co.tz', 'Finishes', '175', 'Yes', '2025-04-20', 'Professional'],
  ]},
}

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<string | null>(null)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [format, setFormat] = useState('csv')

  function generateCSV(headers: string[], rows: string[][]) {
    const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${selectedReport}-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const report = reportTypes.find(r => r.id === selectedReport)
  const data = selectedReport ? sampleData[selectedReport as keyof typeof sampleData] : null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Reports & Data Export</h1>
        <p className="text-gray-500">Generate downloadable reports for marketplace analysis and operations</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {reportTypes.map((r) => {
          const Icon = r.icon
          return (
            <button
              key={r.id}
              onClick={() => setSelectedReport(r.id)}
              className={`text-left rounded-xl border p-4 transition-all hover:shadow-md ${
                selectedReport === r.id ? 'border-zanzibar-500 ring-2 ring-zanzibar-100 bg-zanzibar-50' : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-zanzibar-100 to-zanzibar-200">
                <Icon className="h-5 w-5 text-zanzibar-600" />
              </div>
              <h3 className="mt-3 font-semibold text-sm text-gray-900">{r.label}</h3>
              <p className="mt-1 text-xs text-gray-500">{r.desc}</p>
            </button>
          )
        })}
      </div>

      {selectedReport && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{report?.label}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <Input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="w-40" />
                <span className="text-gray-400">—</span>
                <Input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="w-40" />
              </div>
              <Select
                id="format"
                value={format}
                onChange={e => setFormat(e.target.value)}
                options={[
                  { value: 'csv', label: 'CSV' },
                  { value: 'excel', label: 'Excel (coming soon)' },
                  { value: 'pdf', label: 'PDF (coming soon)' },
                ]}
                className="w-40"
              />
              <Button onClick={() => data && generateCSV(data.headers, data.rows)}>
                <Download className="mr-2 h-4 w-4" /> Export {format.toUpperCase()}
              </Button>
            </div>

            <Separator />

            {data && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-gray-500">
                      {data.headers.map((h: string) => (
                        <th key={h} className="py-3 px-4 font-medium whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.rows.map((row: string[], i: number) => (
                      <tr key={i} className="border-b last:border-0 hover:bg-gray-50">
                        {row.map((cell: string, j: number) => (
                          <td key={j} className="py-3 px-4">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex items-center gap-4 text-sm text-gray-500 pt-2">
              <FileSpreadsheet className="h-4 w-4" />
              <span>Showing sample data. Connect database for live reports.</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
