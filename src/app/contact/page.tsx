import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ContactForm } from "./contact-form"
import { Phone, Mail, MapPin, Clock } from "lucide-react"

export const metadata: Metadata = {
  title: "Contact Us - Zanzibaba",
  description: "Get in touch with the Zanzibaba team. We're here to help with any questions about our marketplace.",
}

const contactMethods = [
  { icon: Phone, title: "Phone", detail: "+255 716 002 790", sub: "Mon-Fri 8am-5pm EAT" },
  { icon: Mail, title: "Email", detail: "info@zanzibaba.com", sub: "We reply within 24 hours" },
  { icon: MapPin, title: "Office", detail: "Stone Town, Zanzibar, Tanzania", sub: "Visit us by appointment" },
  { icon: Clock, title: "Hours", detail: "Monday - Friday", sub: "8:00 AM - 5:00 PM EAT" },
]

export default function ContactPage() {
  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-br from-gray-950 via-zanzibar-950 to-gray-950 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">Get in Touch</h1>
            <p className="mt-4 text-lg text-gray-300">
              Have a question, feedback, or want to partner with us? We'd love to hear from you.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2">
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900">Send Us a Message</h2>
                <p className="mt-1 text-gray-600">Fill out the form and we'll get back to you shortly.</p>
                <ContactForm />
              </CardContent>
            </Card>

            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                {contactMethods.map((method) => {
                  const Icon = method.icon
                  return (
                    <div key={method.title} className="rounded-xl border border-gray-200 bg-white p-6 transition-all hover:shadow-md">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zanzibar-50 text-zanzibar-600">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="mt-3 font-semibold text-gray-900">{method.title}</h3>
                      <p className="mt-1 text-sm text-gray-900">{method.detail}</p>
                      <p className="text-xs text-gray-500">{method.sub}</p>
                    </div>
                  )
                })}
              </div>

              <div className="flex h-64 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200">
                <div className="text-center">
                  <MapPin className="mx-auto h-10 w-10 text-zanzibar-600" />
                  <p className="mt-2 text-sm font-medium text-gray-600">Stone Town, Zanzibar</p>
                  <p className="text-xs text-gray-400">Map integration coming soon</p>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="font-semibold text-gray-900">Follow Us</h3>
                <div className="mt-4 flex gap-4">
                  {["Facebook", "Instagram", "Twitter", "LinkedIn"].map((s) => (
                    <div key={s} className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-gray-100 text-xs font-medium text-gray-600 transition-colors hover:bg-zanzibar-600 hover:text-white">
                      {s[0]}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
