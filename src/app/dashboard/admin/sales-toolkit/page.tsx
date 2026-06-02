'use client'

import { useState } from "react"
import {
  ChevronDown, ChevronRight, Phone, MessageSquare, Mail, FileText,
  BookOpen, ShieldCheck, Star, Target, Zap, CheckCircle2, HelpCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

const coldCallScript = {
  title: "Cold Call Script",
  icon: Phone,
  content: `"Hi [Name], I'm [Your Name] from Zanzibaba. We're building Zanzibar's first online marketplace for building materials and construction services — think Alibaba for Zanzibar.

We already have [X] buyers looking for [their category] and we want you as a launch partner.

Here's what you get FREE:
✅ 6 months professional listing ($900 value)
✅ We set up your profile and products for you
✅ Verified supplier badge
✅ Direct buyer inquiries

All it takes is 10 minutes right now.

Is now a good time?"`,
}

const followUpScript = {
  title: "Follow-up Script",
  icon: MessageSquare,
  content: `"Hi [Name], following up on our chat last [day]. Your Zanzibaba profile is ready for review — all I need is 3 photos of your products and we can go live.

You'll start receiving buyer inquiries immediately.

Can I send you the link to upload photos?"`,
}

const objectionHandlingScript = {
  title: "Objection Handling",
  icon: HelpCircle,
  objections: [
    {
      objection: '"I\'m too busy"',
      response: '"I understand. I\'ve already created a draft profile for you — it takes 2 minutes to review. Shall I walk you through it now?"',
    },
    {
      objection: '"Is this free?"',
      response: '"Yes, completely free for 6 months. No credit card needed. You only pay if you want to upgrade later."',
    },
    {
      objection: '"I already have customers"',
      response: '"Great! Zanzibaba helps you reach new customers — especially hotel developers and international buyers who don\'t know about your shop yet."',
    },
    {
      objection: '"Online doesn\'t work for my business"',
      response: '"60% of construction buyers in Zanzibar search online first. Your competitors are already listing. Don\'t miss out."',
    },
  ],
}

const supplierScripts = [coldCallScript, followUpScript, objectionHandlingScript]

const verificationScript = {
  title: "Verification Pitch",
  icon: ShieldCheck,
  content: `"Your profile has received [X] views this month! 🔍

With a Verified badge, you'll get:
✅ Blue checkmark — builds buyer trust instantly
✅ Priority in search results — appear before unverified suppliers
✅ 3x more RFQ opportunities
✅ Filter: buyers can find you via 'Verified Only'

It's $199 one-time, $49/year renewal. Most suppliers make this back in one order.

Ready to get verified? I can process it right now."`,
}

const verificationFollowUps = [
  { day: 1, message: "Hi [Name]! Just checking if you had a chance to think about the Verified badge. It only takes 2 minutes to set up and you'll start seeing results immediately. Let me know if you have any questions!" },
  { day: 3, message: "Hi [Name]! Quick reminder — your supplier profile has been getting views! With a Verified badge, you'll appear before competitors in search results. Want me to process it for you?" },
  { day: 7, message: "Hi [Name]! Did you know verified suppliers get 3x more RFQ opportunities on Zanzibaba? We have buyers actively searching for [category]. Don't let them go to your competitors. Get verified today!" },
  { day: 14, message: "Hi [Name]! Last chance for the introductory price of $199. After this month, verification goes up to $299. Lock in the lower rate now!" },
  { day: 30, message: "Hi [Name]! We miss you! The Verified badge offer is still available. Your profile has [X] total views — imagine how many more you'd get with priority placement. Let's get you set up!" },
]

const whatsappTemplates = [
  {
    title: "Supplier Welcome",
    icon: MessageSquare,
    message: `Hi [Name]! 🎉 Welcome to Zanzibaba!

Your supplier profile is now live at [profile link]. Here's what to do next:
1️⃣ Add 3-5 product photos
2️⃣ Set your pricing
3️⃣ Enable notifications for new RFQs

We have [X] active buyers looking for [category]. Don't miss your first opportunity!

Need help? Reply to this message or call [Staff Name] at [Staff Phone].`,
  },
  {
    title: "Verification Offer",
    icon: ShieldCheck,
    message: `Hi [Name]! 👋 Quick question — would you like to add a Verified badge to your profile? It's just $199 one-time and gives you:
• Blue checkmark ✅
• Priority in search results
• 3x more RFQ opportunities
• "Verified Only" buyer filter

50% of buyers filter by verified suppliers only. Want in? 🚀`,
  },
  {
    title: "RFQ Alert",
    icon: FileText,
    message: `Hi [Name]! 📄 New RFQ opportunity for [category]!

A buyer is looking for:
• Quantity: [Qty]
• Budget: [Budget]
• Location: [Area]

This is a perfect match for your business. Reply "INTERESTED" and I'll connect you! ⚡`,
  },
  {
    title: "Membership Upgrade",
    icon: Star,
    message: `Hi [Name]! ⭐ You've received [X] RFQs this month using your free listing. Imagine how many more you'd get with a Premium membership!

Premium benefits:
• Unlimited RFQ responses
• Featured supplier placement
• Detailed analytics
• Priority support

Upgrade now at [link] or ask me about our current promotion!`,
  },
]

const emailTemplates = [
  {
    subject: "List your products FREE on Zanzibaba — Zanzibar's #1 marketplace",
    body: `Hi [Name],

I hope this message finds you well.

I'm reaching out because we're building Zanzibar's first online marketplace for building materials and construction services — and we want you as a launch partner.

Zanzibaba connects suppliers like you with buyers across Zanzibar — from hotel developers to homeowners.

Here's what you get FREE for 6 months:
• Professional listing ($900 value)
• We set up your profile and products
• Verified supplier badge
• Direct buyer inquiries

All it takes is 10 minutes to get started.

Ready to join? Reply to this email or book a quick call here: [calendar link]

Best regards,
[Your Name]
Zanzibaba Sales Team
[Phone] | [Email]`,
  },
  {
    subject: "Your Zanzibaba profile is ready — 2 minutes to go live",
    body: `Hi [Name],

Great news! We've created a draft profile for your business on Zanzibaba.

All you need to do is:
1. Click here to review: [profile link]
2. Add 3 photos of your products
3. Set your pricing

That's it! You'll start receiving buyer inquiries immediately.

Having trouble? Reply to this email or WhatsApp me at [Staff Phone] and I'll help you through it.

Best regards,
[Your Name]
Zanzibaba Sales Team`,
  },
  {
    subject: "Get 3x more inquiries with a Verified badge",
    body: `Hi [Name],

Did you know that verified suppliers on Zanzibaba get 3x more RFQ opportunities?

Your profile at [company name] is already live and receiving views. Take it to the next level with a Verified badge.

Benefits of verification:
✅ Blue checkmark — builds buyer trust
✅ Priority in search results
✅ 3x more RFQ opportunities
✅ Exclusive "Verified Only" buyer filter

One-time fee: $199 | Renewal: $49/year

Most suppliers make this back in one order. Ready to get verified? Reply to this email and I'll process it for you.

Best regards,
[Your Name]
Zanzibaba Sales Team`,
  },
  {
    subject: "New project opportunity in your area",
    body: `Hi [Name],

We have a new project opportunity that matches your business:

Project Type: [Project type]
Location: [Area]
Requirements: [Requirements]
Budget Range: [Budget]
Timeline: [Timeline]

This project is actively looking for suppliers. Would you like me to connect you?

Let me know and I'll send over the details.

Best regards,
[Your Name]
Zanzibaba Sales Team`,
  },
]

const objectionHandlingTable = [
  {
    objection: '"Not interested"',
    response: '"I understand. Can I share what other suppliers in [area] are experiencing?"',
    followUp: '"I\'ll check back in 2 weeks with new data"',
  },
  {
    objection: '"Too expensive"',
    response: '"The first 6 months are free. You only pay for optional upgrades."',
    followUp: '"Send case study of a similar business that benefited"',
  },
  {
    objection: '"Need to think about it"',
    response: '"Of course! What specific questions can I answer to help you decide?"',
    followUp: '"Following up in 3 days"',
  },
  {
    objection: '"Already have a platform"',
    response: '"That\'s great! Zanzibaba complements what you\'re already doing — we specifically focus on Zanzibar buyers and hotel development projects."',
    followUp: '"Share data on Zanzibar market growth"',
  },
  {
    objection: '"Not the decision maker"',
    response: '"I understand. Who would be the best person to speak with? Can you introduce me?"',
    followUp: '"Follow up with the referred contact"',
  },
  {
    objection: '"My products are too niche"',
    response: '"Perfect! Niche products are exactly what buyers are searching for. Less competition, higher conversion."',
    followUp: '"Show example of niche supplier succeeding"',
  },
  {
    objection: '"Call me later"',
    response: '"Absolutely! When would be a good time? I\'ll send a calendar invite right now."',
    followUp: '"Send calendar link and confirm in 2 hours"',
  },
  {
    objection: '"I need to check with my partner"',
    response: '"Sure! I can send you our brochure and pricing to discuss together. What\'s your WhatsApp so I can share it?"',
    followUp: '"Follow up in 2 days"',
  },
]

const sections = [
  { id: "supplier-scripts", label: "Supplier Sales Scripts", icon: Phone },
  { id: "verification-scripts", label: "Verification Sales Scripts", icon: ShieldCheck },
  { id: "whatsapp", label: "WhatsApp Templates", icon: MessageSquare },
  { id: "email", label: "Email Templates", icon: Mail },
  { id: "objections", label: "Objection Handling Guide", icon: Target },
]

export default function SalesToolkitPage() {
  const [activeSection, setActiveSection] = useState("supplier-scripts")
  const [expandedCard, setExpandedCard] = useState<string | null>("cold-call")
  const [expandedEmail, setExpandedEmail] = useState<number | null>(0)
  const [expandedWhatsApp, setExpandedWhatsApp] = useState<string | null>("welcome")

  const ActiveIcon = sections.find((s) => s.id === activeSection)?.icon || Phone

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Sales Toolkit</h1>
        <p className="text-sm text-gray-500">Sales scripts, templates, and reference materials for the Zanzibaba sales team</p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-px">
        {sections.map((section) => {
          const Icon = section.icon
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={cn(
                "flex items-center gap-2 rounded-t-lg px-4 py-2.5 text-sm font-medium transition-colors",
                activeSection === section.id
                  ? "bg-zanzibar-50 text-zanzibar-700 border border-b-0 border-gray-200"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50",
              )}
            >
              <Icon className="h-4 w-4" />
              {section.label}
            </button>
          )
        })}
      </div>

      <div>
        {activeSection === "supplier-scripts" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Phone className="h-5 w-5 text-zanzibar-600" />
              <h2 className="text-lg font-semibold">Supplier Sales Scripts</h2>
            </div>

            <ExpandableCard
              id="cold-call"
              title="Cold Call Script"
              subtitle="For in-person visits to suppliers"
              icon={Phone}
              expanded={expandedCard === "cold-call"}
              onToggle={() => setExpandedCard(expandedCard === "cold-call" ? null : "cold-call")}
            >
              <div className="rounded-lg bg-zanzibar-50 p-4 text-sm leading-relaxed text-gray-700 whitespace-pre-line font-mono">
                {coldCallScript.content}
              </div>
              <div className="mt-3 flex gap-2">
                <Badge variant="default">Cold Call</Badge>
                <Badge variant="secondary">In-Person</Badge>
                <Badge variant="outline">10 min</Badge>
              </div>
            </ExpandableCard>

            <ExpandableCard
              id="follow-up"
              title="Follow-up Script"
              subtitle="After first visit to suppliers"
              icon={MessageSquare}
              expanded={expandedCard === "follow-up"}
              onToggle={() => setExpandedCard(expandedCard === "follow-up" ? null : "follow-up")}
            >
              <div className="rounded-lg bg-zanzibar-50 p-4 text-sm leading-relaxed text-gray-700 whitespace-pre-line font-mono">
                {followUpScript.content}
              </div>
              <div className="mt-3 flex gap-2">
                <Badge variant="default">Follow-up</Badge>
                <Badge variant="secondary">Warm Lead</Badge>
              </div>
            </ExpandableCard>

            <ExpandableCard
              id="objections"
              title="Objection Handling"
              subtitle="Common objections and responses"
              icon={HelpCircle}
              expanded={expandedCard === "objections"}
              onToggle={() => setExpandedCard(expandedCard === "objections" ? null : "objections")}
            >
              <div className="space-y-3">
                {objectionHandlingScript.objections.map((item, i) => (
                  <div key={i} className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                    <p className="text-sm font-semibold text-gray-900 mb-1">{item.objection}</p>
                    <p className="text-sm text-gray-600 whitespace-pre-line">{item.response}</p>
                  </div>
                ))}
              </div>
            </ExpandableCard>
          </div>
        )}

        {activeSection === "verification-scripts" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="h-5 w-5 text-zanzibar-600" />
              <h2 className="text-lg font-semibold">Verification Sales Scripts</h2>
            </div>

            <ExpandableCard
              id="verification-pitch"
              title="Verification Pitch"
              subtitle="Script for converting free suppliers to verified"
              icon={ShieldCheck}
              expanded={true}
              onToggle={() => {}}
            >
              <div className="rounded-lg bg-zanzibar-50 p-4 text-sm leading-relaxed text-gray-700 whitespace-pre-line font-mono">
                {verificationScript.content}
              </div>
              <div className="mt-3 flex gap-2">
                <Badge variant="success">$199 One-time</Badge>
                <Badge variant="default">$49/yr renewal</Badge>
                <Badge variant="warning">High Value</Badge>
              </div>
            </ExpandableCard>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Zap className="h-4 w-4 text-amber-500" />
                  Follow-up Sequence
                </CardTitle>
                <CardDescription>Automated follow-up cadence for verification upsell</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {verificationFollowUps.map((item, i) => (
                    <div key={i} className="flex gap-3 rounded-lg border border-gray-100 p-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-700">
                        D{item.day}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-amber-700 mb-1">Day {item.day}</p>
                        <p className="text-sm text-gray-600 whitespace-pre-line">{item.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeSection === "whatsapp" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="h-5 w-5 text-green-600" />
              <h2 className="text-lg font-semibold">WhatsApp Outreach Templates</h2>
            </div>

            {whatsappTemplates.map((template, i) => {
              const id = ["welcome", "verification", "rfq", "upgrade"][i]
              return (
                <ExpandableCard
                  key={id}
                  id={id}
                  title={template.title}
                  subtitle="Click to view template"
                  icon={template.icon}
                  expanded={expandedWhatsApp === id}
                  onToggle={() => setExpandedWhatsApp(expandedWhatsApp === id ? null : id)}
                >
                  <div className="rounded-lg border border-green-100 bg-green-50 p-4 text-sm leading-relaxed text-gray-700 whitespace-pre-line">
                    {template.message}
                  </div>
                  <div className="mt-2 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigator.clipboard.writeText(template.message)}
                    >
                      Copy to Clipboard
                    </Button>
                  </div>
                </ExpandableCard>
              )
            })}
          </div>
        )}

        {activeSection === "email" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Mail className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold">Email Outreach Templates</h2>
            </div>

            {emailTemplates.map((template, i) => (
              <ExpandableCard
                key={i}
                id={`email-${i}`}
                title={template.subject}
                subtitle="Click to view full email"
                icon={Mail}
                expanded={expandedEmail === i}
                onToggle={() => setExpandedEmail(expandedEmail === i ? null : i)}
              >
                <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      Subject: {template.subject}
                    </Badge>
                  </div>
                  <div className="text-sm leading-relaxed text-gray-700 whitespace-pre-line">
                    {template.body}
                  </div>
                </div>
                <div className="mt-2 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const full = `Subject: ${template.subject}\n\n${template.body}`
                      navigator.clipboard.writeText(full)
                    }}
                  >
                    Copy to Clipboard
                  </Button>
                </div>
              </ExpandableCard>
            ))}
          </div>
        )}

        {activeSection === "objections" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-5 w-5 text-red-600" />
              <h2 className="text-lg font-semibold">Objection Handling Guide</h2>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="px-5 py-3.5 text-left font-semibold text-gray-700 w-1/4">Objection</th>
                        <th className="px-5 py-3.5 text-left font-semibold text-gray-700 w-2/4">Response</th>
                        <th className="px-5 py-3.5 text-left font-semibold text-gray-700 w-1/4">Follow-up</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {objectionHandlingTable.map((row, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-5 py-4 font-medium text-gray-900">{row.objection}</td>
                          <td className="px-5 py-4 text-gray-600">{row.response}</td>
                          <td className="px-5 py-4 text-gray-500 italic">{row.followUp}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

function ExpandableCard({
  id,
  title,
  subtitle,
  icon: Icon,
  expanded,
  onToggle,
  children,
}: {
  id: string
  title: string
  subtitle: string
  icon: React.ElementType
  expanded: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <Card>
      <button
        className="flex w-full items-center gap-3 p-4 text-left"
        onClick={onToggle}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zanzibar-100">
          <Icon className="h-5 w-5 text-zanzibar-700" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
        {expanded ? (
          <ChevronDown className="h-5 w-5 text-gray-400 shrink-0" />
        ) : (
          <ChevronRight className="h-5 w-5 text-gray-400 shrink-0" />
        )}
      </button>
      {expanded && (
        <>
          <Separator />
          <div className="p-4">{children}</div>
        </>
      )}
    </Card>
  )
}
