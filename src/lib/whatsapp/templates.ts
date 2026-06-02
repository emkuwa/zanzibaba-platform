export const whatsappTemplates = {
  supplierWelcome: (name: string) => ({
    message: `Hi ${name}! 🎉 Welcome to Zanzibaba — Zanzibar's #1 building marketplace. Complete your profile to start receiving RFQs. Need help? Reply to this message.`,
    category: 'supplier_registration'
  }),
  verificationApproved: (name: string) => ({
    message: `Congratulations ${name}! ✅ Your Zanzibaba account has been Verified. You now get priority in search results and buyer RFQs. Share your verified profile link with customers!`,
    category: 'verification'
  }),
  newRFQ: (name: string, category: string, budget: string) => ({
    message: `Hi ${name}! 📄 New RFQ in ${category} — Budget: ${budget}. Log in to your Zanzibaba dashboard to review and submit a quote. First response wins!`,
    category: 'rfq_notification'
  }),
  newLead: (name: string, buyerName: string) => ({
    message: `Hi ${name}! 👤 New lead from ${buyerName} interested in your products. Contact them now on Zanzibaba to close the deal.`,
    category: 'lead_alert'
  }),
  membershipUpgrade: (name: string, plan: string) => ({
    message: `Hi ${name}! ⭐ You've been upgraded to ${plan} on Zanzibaba. Enjoy unlimited listings, priority matching, and advanced analytics.`,
    category: 'membership'
  }),
}

export type WhatsAppTemplateKey = keyof typeof whatsappTemplates
