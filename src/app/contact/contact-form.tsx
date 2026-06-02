"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"

export function ContactForm() {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="mt-6 space-y-4"
    >
      <div className="grid grid-cols-2 gap-4">
        <Input label="First Name" id="firstName" placeholder="Your first name" />
        <Input label="Last Name" id="lastName" placeholder="Your last name" />
      </div>
      <Input label="Email" id="email" type="email" placeholder="your@email.com" />
      <Input label="Phone" id="phone" type="tel" placeholder="+255 XXX XXX XXX" />
      <Input label="Subject" id="subject" placeholder="What is this about?" />
      <div className="space-y-1">
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
        <textarea
          id="message"
          rows={5}
          className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-zanzibar-500"
          placeholder="Tell us more about your inquiry..."
        />
      </div>
      <Button size="lg" className="w-full gap-2">
        <Send className="h-4 w-4" /> Send Message
      </Button>
    </form>
  )
}
