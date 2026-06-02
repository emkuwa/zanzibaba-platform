"use client"

import { useState } from "react"
import { MapPin, Star, Trash2, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Supplier {
  id: string
  name: string
  location: string
  rating: number
  reviews: number
  specialties: string[]
  gradient: string
}

const defaultSuppliers: Supplier[] = [
  { id: "S-001", name: "Azam Building Supplies", location: "Dar es Salaam, Tanzania", rating: 4.8, reviews: 124, specialties: ["Cement", "Steel", "Hardware"], gradient: "from-blue-500 to-cyan-500" },
  { id: "S-002", name: "Zanzibar Cement Ltd", location: "Zanzibar City, Tanzania", rating: 4.6, reviews: 98, specialties: ["Cement", "Binders", "Concrete"], gradient: "from-emerald-500 to-teal-500" },
  { id: "S-003", name: "East Africa Materials Co", location: "Mombasa, Kenya", rating: 4.7, reviews: 156, specialties: ["Steel", "Roofing", "Plumbing"], gradient: "from-purple-500 to-pink-500" },
  { id: "S-004", name: "Tanga Steel Traders", location: "Tanga, Tanzania", rating: 4.5, reviews: 87, specialties: ["Steel", "Reinforcement"], gradient: "from-orange-500 to-red-500" },
  { id: "S-005", name: "Dar Es Salaam Hardware", location: "Dar es Salaam, Tanzania", rating: 4.3, reviews: 215, specialties: ["Hardware", "Tools", "Plumbing"], gradient: "from-indigo-500 to-violet-500" },
  { id: "S-006", name: "Coastal Electricals Ltd", location: "Mombasa, Kenya", rating: 4.9, reviews: 73, specialties: ["Electrical", "Cabling", "Wiring"], gradient: "from-amber-500 to-yellow-500" },
]

export default function ShortlistPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(defaultSuppliers)

  function removeSupplier(id: string) {
    setSuppliers((prev) => prev.filter((s) => s.id !== id))
  }

  if (suppliers.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Saved Suppliers</h2>
          <p className="text-sm text-gray-500">Your shortlisted suppliers for quick access</p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <Users className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">No saved suppliers</h3>
            <p className="mt-1 text-sm text-gray-500">Browse the marketplace and save suppliers you want to work with</p>
            <Button className="mt-4">Browse Marketplace</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Saved Suppliers</h2>
        <p className="text-sm text-gray-500">{suppliers.length} supplier{suppliers.length !== 1 ? "s" : ""} in your shortlist</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {suppliers.map((supplier) => (
          <Card key={supplier.id} className="group">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${supplier.gradient} text-white text-lg font-bold`}>
                  {supplier.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                </div>
                <button
                  onClick={() => removeSupplier(supplier.id)}
                  className="rounded-lg p-1.5 text-gray-300 opacity-0 transition-opacity hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                  title="Remove from shortlist"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <h3 className="mt-3 font-semibold text-gray-900">{supplier.name}</h3>

              <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                <MapPin className="h-3.5 w-3.5" />
                <span>{supplier.location}</span>
              </div>

              <div className="mt-2 flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-medium text-gray-900">{supplier.rating}</span>
                <span className="text-xs text-gray-400">({supplier.reviews} reviews)</span>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {supplier.specialties.map((spec) => (
                  <Badge key={spec} variant="secondary" className="text-[10px]">
                    {spec}
                  </Badge>
                ))}
              </div>

              <div className="mt-4 flex gap-2">
                <Button size="sm" className="flex-1">View Profile</Button>
                <Button size="sm" variant="outline" className="flex-1">Contact</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
