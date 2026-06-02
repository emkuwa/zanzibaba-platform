"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import {
  Plus,
  CheckCircle2,
  Loader2,
  Building2,
  HardHat,
  Briefcase,
} from "lucide-react"

const categoryOptions = [
  { value: "cement", label: "Cement & Concrete" },
  { value: "tiles", label: "Tiles & Flooring" },
  { value: "plumbing", label: "Plumbing & Pipes" },
  { value: "electrical", label: "Electrical & Lighting" },
  { value: "roofing", label: "Roofing & Ceilings" },
  { value: "paint", label: "Paints & Finishes" },
  { value: "doors", label: "Doors & Windows" },
  { value: "timber", label: "Timber & Wood" },
  { value: "steel", label: "Steel & Reinforcement" },
  { value: "sand", label: "Sand & Aggregates" },
]

const specialtiesList = [
  "General Construction",
  "Electrical",
  "Plumbing",
  "Carpentry",
  "Masonry",
  "Roofing",
  "Painting",
  "Landscaping",
  "Interior Design",
  "Steel Fabrication",
]

const professionalTypes = [
  { value: "ARCHITECT", label: "Architect" },
  { value: "ENGINEER", label: "Engineer" },
  { value: "SURVEYOR", label: "Surveyor" },
]

interface SessionCounts {
  suppliers: number
  contractors: number
  professionals: number
}

export default function SeedPage() {
  const [counts, setCounts] = useState<SessionCounts>({
    suppliers: 0,
    contractors: 0,
    professionals: 0,
  })

  const [loading, setLoading] = useState<string | null>(null)
  const [toast, setToast] = useState<{
    message: string
    type: "success" | "error"
  } | null>(null)

  function showToast(message: string, type: "success" | "error") {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  // --- Supplier form ---
  const [supplierForm, setSupplierForm] = useState({
    companyName: "",
    email: "",
    phone: "",
    location: "",
    category: "",
  })

  function resetSupplierForm() {
    setSupplierForm({
      companyName: "",
      email: "",
      phone: "",
      location: "",
      category: "",
    })
  }

  async function createSupplier() {
    setLoading("supplier")
    try {
      const res = await fetch("/api/admin/seed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "supplier",
          data: {
            companyName: supplierForm.companyName || undefined,
            email: supplierForm.email || undefined,
            phone: supplierForm.phone || undefined,
            location: supplierForm.location || undefined,
          },
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Failed to create supplier")
      }

      const result = await res.json()
      setCounts((prev) => ({ ...prev, suppliers: prev.suppliers + 1 }))
      showToast(
        `Supplier "${result.companyName}" created (${result.email})`,
        "success"
      )
      resetSupplierForm()
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Creation failed",
        "error"
      )
    } finally {
      setLoading(null)
    }
  }

  // --- Contractor form ---
  const [contractorForm, setContractorForm] = useState({
    companyName: "",
    email: "",
    phone: "",
    location: "",
    specialties: [] as string[],
  })

  function toggleSpecialty(s: string) {
    setContractorForm((prev) => ({
      ...prev,
      specialties: prev.specialties.includes(s)
        ? prev.specialties.filter((x) => x !== s)
        : [...prev.specialties, s],
    }))
  }

  function resetContractorForm() {
    setContractorForm({
      companyName: "",
      email: "",
      phone: "",
      location: "",
      specialties: [],
    })
  }

  async function createContractor() {
    setLoading("contractor")
    try {
      const res = await fetch("/api/admin/seed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "contractor",
          data: {
            companyName: contractorForm.companyName || undefined,
            email: contractorForm.email || undefined,
            phone: contractorForm.phone || undefined,
            location: contractorForm.location || undefined,
            specialties: contractorForm.specialties,
          },
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Failed to create contractor")
      }

      const result = await res.json()
      setCounts((prev) => ({ ...prev, contractors: prev.contractors + 1 }))
      showToast(
        `Contractor "${result.companyName}" created (${result.email})`,
        "success"
      )
      resetContractorForm()
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Creation failed",
        "error"
      )
    } finally {
      setLoading(null)
    }
  }

  // --- Professional form ---
  const [professionalForm, setProfessionalForm] = useState({
    fullName: "",
    professionalType: "ARCHITECT",
    email: "",
    phone: "",
    location: "",
  })

  function resetProfessionalForm() {
    setProfessionalForm({
      fullName: "",
      professionalType: "ARCHITECT",
      email: "",
      phone: "",
      location: "",
    })
  }

  async function createProfessional() {
    setLoading("professional")
    try {
      const res = await fetch("/api/admin/seed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "professional",
          data: {
            fullName: professionalForm.fullName || undefined,
            professionalType: professionalForm.professionalType,
            email: professionalForm.email || undefined,
            phone: professionalForm.phone || undefined,
            location: professionalForm.location || undefined,
          },
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Failed to create professional")
      }

      const result = await res.json()
      setCounts((prev) => ({ ...prev, professionals: prev.professionals + 1 }))
      showToast(
        `Professional "${result.fullName}" created (${result.email})`,
        "success"
      )
      resetProfessionalForm()
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Creation failed",
        "error"
      )
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Seed Data</h1>
          <p className="text-gray-500">
            Quickly create test suppliers, contractors, and professionals
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <Building2 className="h-4 w-4" />
            <span>{counts.suppliers}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <HardHat className="h-4 w-4" />
            <span>{counts.contractors}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <Briefcase className="h-4 w-4" />
            <span>{counts.professionals}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Supplier */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zanzibar-100">
                <Building2 className="h-4 w-4 text-zanzibar-700" />
              </div>
              <div>
                <CardTitle>Quick Create Supplier</CardTitle>
                <CardDescription>
                  {counts.suppliers} created this session
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              label="Company Name"
              placeholder="e.g. Sunset Materials Ltd"
              value={supplierForm.companyName}
              onChange={(e) =>
                setSupplierForm((f) => ({ ...f, companyName: e.target.value }))
              }
            />
            <Input
              label="Email *"
              placeholder="Auto-generated if blank"
              value={supplierForm.email}
              onChange={(e) =>
                setSupplierForm((f) => ({ ...f, email: e.target.value }))
              }
            />
            <Input
              label="Phone *"
              placeholder="Auto-generated if blank"
              value={supplierForm.phone}
              onChange={(e) =>
                setSupplierForm((f) => ({ ...f, phone: e.target.value }))
              }
            />
            <Input
              label="Location"
              placeholder="e.g. Stone Town"
              value={supplierForm.location}
              onChange={(e) =>
                setSupplierForm((f) => ({ ...f, location: e.target.value }))
              }
            />
            <Select
              label="Category"
              placeholder="Select category"
              options={categoryOptions}
              value={supplierForm.category}
              onChange={(e) =>
                setSupplierForm((f) => ({ ...f, category: e.target.value }))
              }
            />
            <Button
              className="w-full"
              onClick={createSupplier}
              disabled={loading === "supplier"}
            >
              {loading === "supplier" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              Create &amp; Add Another
            </Button>
          </CardContent>
        </Card>

        {/* Contractor */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-100">
                <HardHat className="h-4 w-4 text-gold-700" />
              </div>
              <div>
                <CardTitle>Quick Create Contractor</CardTitle>
                <CardDescription>
                  {counts.contractors} created this session
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              label="Company Name"
              placeholder="e.g. Ocean View Builders"
              value={contractorForm.companyName}
              onChange={(e) =>
                setContractorForm((f) => ({
                  ...f,
                  companyName: e.target.value,
                }))
              }
            />
            <Input
              label="Email *"
              placeholder="Auto-generated if blank"
              value={contractorForm.email}
              onChange={(e) =>
                setContractorForm((f) => ({ ...f, email: e.target.value }))
              }
            />
            <Input
              label="Phone *"
              placeholder="Auto-generated if blank"
              value={contractorForm.phone}
              onChange={(e) =>
                setContractorForm((f) => ({ ...f, phone: e.target.value }))
              }
            />
            <Input
              label="Location"
              placeholder="e.g. Nungwi"
              value={contractorForm.location}
              onChange={(e) =>
                setContractorForm((f) => ({ ...f, location: e.target.value }))
              }
            />
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Specialties
              </label>
              <div className="flex flex-wrap gap-1.5">
                {specialtiesList.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleSpecialty(s)}
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                      contractorForm.specialties.includes(s)
                        ? "bg-zanzibar-100 text-zanzibar-800"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <Button
              className="w-full"
              onClick={createContractor}
              disabled={loading === "contractor"}
            >
              {loading === "contractor" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              Create &amp; Add Another
            </Button>
          </CardContent>
        </Card>

        {/* Professional */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ocean-50">
                <Briefcase className="h-4 w-4 text-ocean-600" />
              </div>
              <div>
                <CardTitle>Quick Create Professional</CardTitle>
                <CardDescription>
                  {counts.professionals} created this session
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              label="Full Name"
              placeholder="e.g. James Mwangi"
              value={professionalForm.fullName}
              onChange={(e) =>
                setProfessionalForm((f) => ({
                  ...f,
                  fullName: e.target.value,
                }))
              }
            />
            <Select
              label="Professional Type"
              options={professionalTypes}
              value={professionalForm.professionalType}
              onChange={(e) =>
                setProfessionalForm((f) => ({
                  ...f,
                  professionalType: e.target.value,
                }))
              }
            />
            <Input
              label="Email *"
              placeholder="Auto-generated if blank"
              value={professionalForm.email}
              onChange={(e) =>
                setProfessionalForm((f) => ({ ...f, email: e.target.value }))
              }
            />
            <Input
              label="Phone *"
              placeholder="Auto-generated if blank"
              value={professionalForm.phone}
              onChange={(e) =>
                setProfessionalForm((f) => ({ ...f, phone: e.target.value }))
              }
            />
            <Input
              label="Location"
              placeholder="e.g. Mkunazini"
              value={professionalForm.location}
              onChange={(e) =>
                setProfessionalForm((f) => ({ ...f, location: e.target.value }))
              }
            />
            <Button
              className="w-full"
              onClick={createProfessional}
              disabled={loading === "professional"}
            >
              {loading === "professional" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              Create &amp; Add Another
            </Button>
          </CardContent>
        </Card>
      </div>

      {toast && (
        <div
          className={cn(
            "fixed bottom-6 right-6 flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium shadow-lg transition-all",
            toast.type === "success"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          )}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <Loader2 className="h-4 w-4" />
          )}
          {toast.message}
        </div>
      )}
    </div>
  )
}
