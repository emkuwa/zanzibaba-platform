"use client"

import { useState } from "react"
import Link from "next/link"
import { Users, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

const professionalTypes = [
  { value: "architect", label: "Architect" },
  { value: "engineer", label: "Engineer" },
  { value: "surveyor", label: "Surveyor" },
  { value: "interior-designer", label: "Interior Designer" },
  { value: "project-manager", label: "Project Manager" },
  { value: "environmental", label: "Environmental Consultant" },
]

export default function ProfessionalRegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-zanzibar-50 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex items-center justify-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zanzibar-600">
              <Users className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-zanzibar-600">Zanzibaba</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-900">Join as Professional</h1>
          <p className="text-sm text-gray-500">Offer your expertise to construction projects in Zanzibar</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input id="fullName" label="Full Name" placeholder="Dr. John Doe" />
          <Input id="professionalTitle" label="Professional Title" placeholder="e.g. Senior Architect" />
          <Select
            id="professionalType"
            label="Professional Type"
            options={professionalTypes}
            placeholder="Select your field"
          />
          <Input id="email" label="Email" type="email" placeholder="john@example.com" />
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
          <Input id="licenseNumber" label="Professional License Number" placeholder="e.g. AERB-2024-001" />

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
            Create Professional Account
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
