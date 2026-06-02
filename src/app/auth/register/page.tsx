"use client"

import Link from "next/link"
import { Building2, Truck, HardHat, Users, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const roles = [
  {
    icon: Building2,
    title: "Buyer",
    description: "Source materials, post projects, and receive competitive quotes from verified suppliers.",
    href: "/auth/register/buyer",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Truck,
    title: "Supplier",
    description: "List your products, connect with buyers, and grow your construction supply business.",
    href: "/auth/register/supplier",
    color: "bg-zanzibar-50 text-zanzibar-600",
  },
  {
    icon: HardHat,
    title: "Contractor",
    description: "Showcase your portfolio, bid on projects, and build your reputation in Zanzibar.",
    href: "/auth/register/contractor",
    color: "bg-gold-50 text-gold-600",
  },
  {
    icon: Users,
    title: "Professional",
    description: "Connect with projects needing architectural, engineering, or surveying expertise.",
    href: "/auth/register/professional",
    color: "bg-ocean-50 text-ocean-600",
  },
]

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-zanzibar-50 p-4">
      <div className="w-full max-w-4xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex items-center justify-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zanzibar-600">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-zanzibar-600">Zanzibaba</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="mt-1 text-gray-500">Choose your role to get started</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {roles.map((role) => (
            <Link key={role.title} href={role.href}>
              <Card className="group h-full cursor-pointer transition-all hover:border-zanzibar-300 hover:shadow-md">
                <CardContent className="flex h-full flex-col items-center p-6 text-center">
                  <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl ${role.color}`}>
                    <role.icon className="h-7 w-7" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">{role.title}</h3>
                  <p className="mb-4 flex-1 text-sm leading-relaxed text-gray-500">{role.description}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-zanzibar-600 opacity-0 transition-opacity group-hover:opacity-100">
                    Get started <ArrowRight className="h-4 w-4" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/auth/login" className="font-medium text-zanzibar-600 hover:text-zanzibar-700">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
