import type { DiscoveredLeadInput } from "@/lib/agents/core"
import { generateJSON, isAIEnabled } from "@/lib/ai/provider"
import type { ReviewedLead } from "./review-queue"

const OUTREACH_SYSTEM = `You are a business outreach specialist for Zanzibaba marketplace. Write warm, professional invitation messages to construction suppliers. Return ONLY valid JSON.`

interface OutreachMessages {
  email: string
  whatsapp: string
  subject: string
}

function generateFallbackOutreach(lead: DiscoveredLeadInput, name: string): OutreachMessages {
  const company = lead.companyName || "your company"
  const city = lead.city || "Zanzibar"

  return {
    subject: `Partner with Zanzibaba — Showcase ${company} to ${city} projects`,
    email: `Dear ${name},

I hope this message finds you well. I came across ${company} while researching building material suppliers in ${city}.

Zanzibaba is a project-driven marketplace connecting verified suppliers with construction projects across Zanzibar and Tanzania. We help suppliers showcase their products, receive qualified project inquiries, and grow their business.

I'd love to invite ${company} to join our platform and list your products. It's free to get started, and we have project leads looking for ${(lead.categoryLabels || ["building materials"]).join(", ")} right now.

Would you be interested in learning more? I'm happy to walk you through the process.

Best regards,
The Zanzibaba Team`,
    whatsapp: `Hi ${name}! 👋

I'm reaching out from Zanzibaba, a marketplace connecting building material suppliers with construction projects in ${city} and across Tanzania.

We noticed ${company} and think your products would be a great fit for projects on our platform.

Would you be interested in listing your products? It's free to join and you'll get access to qualified project leads.

Let me know if you'd like to learn more! 🏗️

Best,
The Zanzibaba Team`,
  }
}

export async function generateOutreach(
  leads: ReviewedLead[]
): Promise<{ messagesGenerated: number; messages: { leadName: string; companyName?: string; email?: string; phone?: string; messages: OutreachMessages }[] }> {
  const approvedLeads = leads.filter((l) => l.reviewStatus === "APPROVED")
  const messages: { leadName: string; companyName?: string; email?: string; phone?: string; messages: OutreachMessages }[] = []

  for (const lead of approvedLeads) {
    if (!lead.email && !lead.phone) continue

    const name = lead.contactName || "Team"
    let outreach: OutreachMessages

    if (isAIEnabled()) {
      try {
        const prompt = `Write outreach messages inviting a supplier to Zanzibaba marketplace.

Supplier: ${lead.companyName || "Unknown"}
Contact Name: ${lead.contactName || "Team"}
Location: ${lead.city || lead.location || "Zanzibar"}
Categories: ${(lead.categoryLabels || []).join(", ")}

Zanzibaba connects verified suppliers with construction projects in Tanzania and East Africa.

Return JSON:
- email: full email body (3-4 paragraphs, professional)
- whatsapp: shorter WhatsApp message (2-3 paragraphs, casual with emojis)
- subject: email subject line (max 80 chars)`
        outreach = (await generateJSON<OutreachMessages>(OUTREACH_SYSTEM, prompt)) || generateFallbackOutreach(lead, name)
      } catch {
        outreach = generateFallbackOutreach(lead, name)
      }
    } else {
      outreach = generateFallbackOutreach(lead, name)
    }

    messages.push({
      leadName: name,
      companyName: lead.companyName,
      email: lead.email,
      phone: lead.phone,
      messages: outreach,
    })
  }

  return { messagesGenerated: messages.length, messages }
}
