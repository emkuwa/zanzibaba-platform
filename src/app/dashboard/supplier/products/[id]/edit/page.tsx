'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function EditProductPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/supplier/products">
          <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
        </Link>
        <h1 className="text-2xl font-bold">Edit Product</h1>
      </div>
      <Card>
        <CardHeader><CardTitle>Portland Cement Grade 42.5N</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Product Name" defaultValue="Portland Cement Grade 42.5N" />
            <Input label="Category" defaultValue="Building Materials > Cement" />
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea className="w-full mt-1 rounded-lg border p-3 text-sm min-h-[120px]" defaultValue="Premium Portland Cement Grade 42.5N, ideal for structural concrete, plastering, and general construction in Zanzibar." />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input label="Price (USD)" defaultValue="12.50" type="number" />
            <Input label="MOQ" defaultValue="100" type="number" />
            <Input label="Unit" defaultValue="Bags (50kg)" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Currency" defaultValue="USD" />
            <Input label="Lead Time (days)" defaultValue="3" type="number" />
          </div>
          <div>
            <label className="text-sm font-medium">Product Images</label>
            <div className="mt-2 grid grid-cols-4 gap-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="aspect-square rounded-lg bg-gradient-to-br from-zanzibar-100 to-zanzibar-200 flex items-center justify-center text-sm text-zanzibar-600 border-2 border-dashed border-zanzibar-300 cursor-pointer hover:border-zanzibar-500">
                  Click to upload
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <Button size="lg">Save Changes</Button>
            <Button variant="outline" size="lg">Save as Draft</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
