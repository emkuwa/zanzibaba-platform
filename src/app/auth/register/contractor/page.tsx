"use client"

import { useState } from "react"
import Link from "next/link"
import { HardHat, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

const specialties = [
  "Residential Construction",
  "Commercial Construction",
  "Industrial Construction",
  "Renovation & Remodeling",
  "Road & Infrastructure",
  "Plumbing & Electrical",
  "Painting & Finishing",
  "Landscaping",
]

export default function ContractorRegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([])
  const [acceptTerms, setAcceptTerms] = useState(false)

  function toggleSpecialty(s: string) {
    setSelectedSpecialties((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-zanzibar-50 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex items-center justify-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zanzibar-600">
              <HardHat className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-zanzibar-600">Zanzibaba</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-900">Join as Contractor</h1>
          <p className="text-sm text-gray-500">Showcase your portfolio and bid on construction projects</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input id="companyName" label="Company Name" placeholder="Your company name" />
          <Input id="email" label="Business Email" type="email" placeholder="contact@company.com" />
          <Input id="phone" label="Phone" type="tel" placeholder="+255 7XX XXX XXX" />
          <div className="relative">
            <Input
              id="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <Input id="confirmPassword" label="Confirm Password" type="password" placeholder="Repeat your password" />
          <Input id="licenseNumber" label="Contractor License Number" placeholder="e.g. CRL-2024-001" />

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Specialties</label>
            <div className="flex flex-wrap gap-2">
              {specialties.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSpecialty(s)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    selectedSpecialties.includes(s)
                      ? "bg-zanzibar-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-start gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-zanzibar-600 focus:ring-zanzibar-500"
            />
            <span>
              I agree to the{" "}
              <Link href="/terms" className="font-medium text-zanzibar-600 hover:text-zanzibar-700">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="font-medium text-zanzibar-600 hover:text-zanzibar-700">
                Privacy Policy
              </Link>
            </span>
          </label>

          <Button className="w-full" size="lg" disabled={!acceptTerms}>
            Create Contractor Account
          </Button>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-medium text-zanzibar-600 hover:text-zanzibar-700">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
