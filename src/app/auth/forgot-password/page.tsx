"use client"

import { useState } from "react"
import Link from "next/link"
import { Building2, ArrowLeft, Mail, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSent(true)
  }

  if (sent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-zanzibar-50 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-zanzibar-100">
              <CheckCircle2 className="h-7 w-7 text-zanzibar-600" />
            </div>
            <h1 className="mb-2 text-xl font-semibold text-gray-900">Check your email</h1>
            <p className="mb-6 text-sm text-gray-500">
              We&apos;ve sent a password reset link to <strong className="text-gray-700">{email}</strong>
            </p>
            <Button variant="outline" className="w-full" onClick={() => setSent(false)}>
              Send again
            </Button>
            <Link
              href="/auth/login"
              className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-zanzibar-600 hover:text-zanzibar-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-zanzibar-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex items-center justify-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zanzibar-600">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-zanzibar-600">Zanzibaba</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-900">Forgot password?</h1>
          <p className="text-sm text-gray-500">Enter your email and we&apos;ll send you a reset link</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={!email}>
              Send reset link
            </Button>
          </form>
          <Link
            href="/auth/login"
            className="flex items-center justify-center gap-2 text-sm font-medium text-zanzibar-600 hover:text-zanzibar-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
