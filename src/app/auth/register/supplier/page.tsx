"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { Truck, Eye, EyeOff, ArrowRight, Sparkles, FormInput, Crown, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import SupplierOnboardingAssistant from "@/components/ai/supplier-onboarding-assistant"

export default function SupplierRegisterPage() {
  const router = useRouter()
  const [mode, setMode] = useState<"form" | "ai">("form")
  const [showPassword, setShowPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [companyName, setCompanyName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!acceptTerms) {
      setError("Please accept the terms and privacy policy")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: companyName,
          email,
          phone,
          password,
          companyName,
          role: "SUPPLIER",
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Registration failed")
        return
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Account created but login failed. Please try signing in.")
        return
      }

      router.push("/dashboard/supplier")
      router.refresh()
    } catch {
      setError("Connection error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-start justify-center bg-gradient-to-br from-gray-50 to-zanzibar-50 p-4 pt-12">
      <div className="w-full max-w-4xl">
        <div className="mb-6 flex items-center justify-center gap-2">
          <button
            onClick={() => setMode("form")}
            className={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-all ${
              mode === "form"
                ? "bg-zanzibar-600 text-white shadow-sm"
                : "bg-white text-gray-600 border border-gray-200 hover:border-zanzibar-300"
            }`}
          >
            <FormInput className="h-4 w-4" /> Standard Registration
          </button>
          <button
            onClick={() => setMode("ai")}
            className={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-all ${
              mode === "ai"
                ? "bg-zanzibar-600 text-white shadow-sm"
                : "bg-white text-gray-600 border border-gray-200 hover:border-zanzibar-300"
            }`}
          >
            <Sparkles className="h-4 w-4" /> AI-Powered Onboarding
          </button>
        </div>

        {/* Founding Supplier Banner */}
        <div className="mx-auto max-w-md mb-6">
          <div className="rounded-xl bg-gradient-to-r from-amber-500 to-amber-700 p-4 shadow-lg">
            <div className="flex items-center gap-3">
              <Crown className="h-8 w-8 text-amber-200 shrink-0" />
              <div className="text-white text-sm">
                <p className="font-bold">Limited: Founding Supplier Program</p>
                <p className="text-amber-100 text-xs mt-0.5">
                  Register free now, then upgrade to Founding Supplier for exclusive benefits.
                  <Link href="/become-supplier" className="font-semibold text-white underline ml-1">Learn more</Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        {mode === "form" ? (
          <Card className="mx-auto max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex items-center justify-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zanzibar-600">
                  <Truck className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-zanzibar-600">Zanzibaba</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">List Your Products Free</h1>
              <p className="text-sm text-gray-500">Connect with buyers across Zanzibar. Setup takes less than 2 minutes.</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  id="companyName"
                  label="Company Name"
                  placeholder="Your company name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
                <Input
                  id="email"
                  label="Business Email"
                  type="email"
                  placeholder="contact@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Input
                  id="phone"
                  label="Phone"
                  type="tel"
                  placeholder="+255 7XX XXX XXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <div className="relative">
                  <Input
                    id="password"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-9 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                <p className="text-xs text-gray-400">You can add your business registration, product catalog, and category later.</p>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <label className="flex items-start gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-zanzibar-600 focus:ring-zanzibar-500"
                  />
                  <span>I agree to the <Link href="/terms" className="font-medium text-zanzibar-600 hover:text-zanzibar-700">Terms</Link> and <Link href="/privacy" className="font-medium text-zanzibar-600 hover:text-zanzibar-700">Privacy Policy</Link></span>
                </label>

                <Button type="submit" className="w-full" size="lg" disabled={loading || !acceptTerms}>
                  {loading ? "Creating Account..." : "Create Account"} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <div className="rounded-lg bg-zanzibar-50 p-4 text-sm text-zanzibar-800">
                  <p className="font-medium mb-1">Post-registration you can:</p>
                  <ul className="space-y-1 text-zanzibar-700">
                    <li className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-zanzibar-500 shrink-0" /> Add your product catalog with images</li>
                    <li className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-zanzibar-500 shrink-0" /> Apply for Verified Supplier badge</li>
                    <li className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-zanzibar-500 shrink-0" /> Start receiving RFQ opportunities</li>
                    <li className="flex items-center gap-2 font-medium text-amber-700">
                      <Crown className="h-3.5 w-3.5" />
                      Upgrade to Founding Supplier for premium benefits
                    </li>
                  </ul>
                </div>

                <p className="text-center text-sm text-gray-500">
                  Already have an account? <Link href="/auth/login" className="font-medium text-zanzibar-600 hover:text-zanzibar-700">Sign in</Link>
                </p>
              </form>
            </CardContent>
          </Card>
        ) : (
          <div>
            <div className="mb-4 text-center">
              <h1 className="text-xl font-semibold text-gray-900">AI Supplier Onboarding</h1>
              <p className="text-sm text-gray-500">Answer a few questions and get a ready-to-publish profile with SEO, categories, and keywords.</p>
            </div>
            <SupplierOnboardingAssistant />
          </div>
        )}
      </div>
    </div>
  )
}
