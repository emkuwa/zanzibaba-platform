'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Filter } from 'lucide-react'

export default function ReviewModerationPage() {
  const items = Array.from({ length: 6 }, (_, i) => ({
    id: `USR-${String(1000 + i).slice(1)}`,
    title: `${['Premium Project', 'Hotel Renovation', 'Villa Construction', 'Kitchen Supply', 'Bathroom Fixtures', 'Concrete Supply'][i]}`,
    status: ['Active', 'Pending', 'Completed', 'Active', 'Pending', 'Active'][i],
    date: `${['2025-06-01', '2025-05-28', '2025-05-25', '2025-05-20', '2025-05-18', '2025-05-15'][i]}`,
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Review Moderation</h1>
          <p className="text-gray-500">Moderate user reviews</p>
        </div>
        <Button><Plus className="mr-2 h-4 w-4" /> Add New</Button>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input className="w-full pl-10 pr-4 py-2 rounded-lg border text-sm" placeholder="Search..." />
        </div>
        <Button variant="outline"><Filter className="mr-2 h-4 w-4" /> Filter</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b text-sm text-gray-500">
                <th className="text-left py-4 px-6 font-medium">ID</th>
                <th className="text-left py-4 px-6 font-medium">Title</th>
                <th className="text-left py-4 px-6 font-medium">Status</th>
                <th className="text-left py-4 px-6 font-medium">Date</th>
                <th className="text-right py-4 px-6 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="py-4 px-6 text-sm font-mono">{item.id}</td>
                  <td className="py-4 px-6 font-medium">{item.title}</td>
                  <td className="py-4 px-6">
                    <Badge variant={item.status === 'Active' ? 'success' : item.status === 'Completed' ? 'default' : 'warning'}>{item.status}</Badge>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-500">{item.date}</td>
                  <td className="py-4 px-6 text-right">
                    <Button variant="ghost" size="sm">View</Button>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
