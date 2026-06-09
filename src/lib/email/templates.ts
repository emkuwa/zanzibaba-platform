const baseStyle = `
  body { margin: 0; padding: 0; font-family: 'Inter', system-ui, sans-serif; background: #f9fafb; }
  .wrapper { max-width: 600px; margin: 0 auto; padding: 32px 24px; }
  .header { text-align: center; padding: 32px 0; }
  .logo { font-size: 28px; font-weight: 800; color: #16a34a; letter-spacing: -0.5px; }
  .logo span { color: #14532d; }
  .content { background: #ffffff; border-radius: 16px; padding: 40px 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
  .content h1 { font-size: 24px; font-weight: 700; color: #111827; margin: 0 0 16px; }
  .content p { font-size: 16px; line-height: 1.6; color: #4b5563; margin: 0 0 16px; }
  .content ul { list-style: none; padding: 0; margin: 0 0 24px; }
  .content ul li { padding: 12px 16px; margin-bottom: 8px; background: #f0fdf4; border-radius: 8px; font-size: 14px; color: #374151; border-left: 3px solid #16a34a; }
  .content ul li strong { color: #111827; }
  .cta { display: inline-block; padding: 14px 32px; background: #16a34a; color: #ffffff !important; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 16px; margin: 8px 0 24px; }
  .cta:hover { background: #15803d; }
  .divider { height: 1px; background: #e5e7eb; margin: 24px 0; }
  .footer { text-align: center; padding: 24px; font-size: 13px; color: #9ca3af; }
  .footer a { color: #16a34a; text-decoration: none; }
`

function wrapHtml(body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>${baseStyle}</style></head>
<body><div class="wrapper">
<div class="header"><div class="logo">Zanzibaba<span>.</span></div></div>
<div class="content">${body}</div>
<div class="footer">
<p>&copy; ${new Date().getFullYear()} Zanzibaba. All rights reserved.</p>
<p>Zanzibar's #1 Building Materials Marketplace</p>
<p><a href="#">Unsubscribe</a> &middot; <a href="#">Privacy Policy</a> &middot; <a href="#">Terms of Service</a></p>
</div></div></body></html>`
}

export function supplierWelcome(params: { name: string; email: string; dashboardLink: string }): string {
  return wrapHtml(`
    <h1>Welcome to Zanzibaba, ${params.name}! 🎉</h1>
    <p>Thank you for joining Zanzibar's #1 building materials marketplace. We're excited to have you on board.</p>
    <div class="divider"></div>
    <h2 style="font-size:18px;font-weight:600;color:#111827;margin:0 0 16px;">Getting Started</h2>
    <ul>
      <li><strong>📋 Complete Your Profile</strong> — Add your company logo, description, and contact details to build trust with buyers.</li>
      <li><strong>📦 Upload Products</strong> — List your building materials with prices, images, and categories so buyers can find you.</li>
      <li><strong>📄 Set Up RFQ Preferences</strong> — Tell us what categories you supply so we can match you with the right opportunities.</li>
      <li><strong>✅ Get Verified</strong> — Complete verification to earn the trusted badge and priority in search results.</li>
    </ul>
    <div style="text-align:center;">
      <a href="${params.dashboardLink}" class="cta">Go to Dashboard</a>
    </div>
    <p style="font-size:14px;color:#6b7280;">Your account email: ${params.email}. If you have any questions, just reply to this email or contact our support team.</p>
  `)
}

export function supplierProfileReminder(params: { name: string; daysSinceSignup: number; profileLink: string }): string {
  const messages = [
    "Don't let your profile go unnoticed! Buyers are searching for suppliers like you.",
    "A complete profile gets 3x more views. Take 5 minutes to finish yours.",
    "Your profile is looking good! Add a few more details to stand out from competitors."
  ]
  const message = messages[Math.min(params.daysSinceSignup, messages.length) - 1] || messages[0]
  return wrapHtml(`
    <h1>Complete Your Profile, ${params.name}</h1>
    <p>It's been <strong>${params.daysSinceSignup} day${params.daysSinceSignup > 1 ? 's' : ''}</strong> since you joined Zanzibaba. ${message}</p>
    <div class="divider"></div>
    <h2 style="font-size:18px;font-weight:600;color:#111827;margin:0 0 16px;">Your Profile Progress</h2>
    <ul>
      <li><strong>📸 Company Logo</strong> — Add your brand logo for recognition</li>
      <li><strong>📝 Business Description</strong> — Tell buyers about your expertise</li>
      <li><strong>🏷️ Product Categories</strong> — Select the categories you supply</li>
      <li><strong>📍 Service Areas</strong> — Let buyers know where you deliver</li>
    </ul>
    <div style="text-align:center;">
      <a href="${params.profileLink}" class="cta">Complete My Profile</a>
    </div>
  `)
}

export function supplierVerificationInvite(params: { name: string; verificationLink: string }): string {
  return wrapHtml(`
    <h1>Get Verified on Zanzibaba ✅</h1>
    <p>Hi ${params.name}, stand out from competitors with a <strong>Verified Supplier</strong> badge. Verified suppliers receive priority matching in buyer RFQs and search results.</p>
    <div class="divider"></div>
    <h2 style="font-size:18px;font-weight:600;color:#111827;margin:0 0 16px;">Benefits of Verification</h2>
    <ul>
      <li><strong>🏆 Priority Search Ranking</strong> — Appear above non-verified suppliers</li>
      <li><strong>📈 More RFQ Matches</strong> — Get notified about relevant opportunities first</li>
      <li><strong>🔒 Trust Badge</strong> — Build buyer confidence with the verified shield</li>
      <li><strong>📊 Enhanced Analytics</strong> — Access detailed insights on profile performance</li>
    </ul>
    <div style="text-align:center;">
      <a href="${params.verificationLink}" class="cta">Apply for Verification</a>
    </div>
  `)
}

export function supplierMembershipUpgrade(params: { name: string; currentPlan: string; upgradeLink: string }): string {
  return wrapHtml(`
    <h1>Upgrade Your Plan, ${params.name} ⭐</h1>
    <p>You're currently on the <strong>${params.currentPlan}</strong> plan. Suppliers on higher-tier plans receive priority RFQ matching, unlimited product listings, and advanced analytics.</p>
    <div class="divider"></div>
    <h2 style="font-size:18px;font-weight:600;color:#111827;margin:0 0 16px;">What You're Missing</h2>
    <ul>
      <li><strong>📦 Unlimited Product Listings</strong> — Showcase your full catalog</li>
      <li><strong>🎯 Priority RFQ Matching</strong> — Get first access to new opportunities</li>
      <li><strong>📊 Advanced Analytics</strong> — Track views, inquiries, and conversions</li>
      <li><strong>🏆 Featured Supplier Badge</strong> — Stand out in search and category pages</li>
    </ul>
    <div style="text-align:center;">
      <a href="${params.upgradeLink}" class="cta">View Plans</a>
    </div>
  `)
}

export function buyerRFQConfirmation(params: { name: string; rfqTitle: string; rfqId: string }): string {
  return wrapHtml(`
    <h1>Your RFQ Has Been Submitted 📄</h1>
    <p>Hi ${params.name}, your request for quote <strong>"${params.rfqTitle}"</strong> has been submitted successfully.</p>
    <div class="divider"></div>
    <h2 style="font-size:18px;font-weight:600;color:#111827;margin:0 0 16px;">What Happens Next</h2>
    <ul>
      <li><strong>🔍 Supplier Matching</strong> — We'll match your RFQ with qualified suppliers in the relevant categories</li>
      <li><strong>📬 Receive Quotes</strong> — Suppliers will submit their quotes within 24-48 hours</li>
      <li><strong>📊 Compare & Choose</strong> — Review quotes, compare pricing, and select the best supplier</li>
      <li><strong>🤝 Connect Directly</strong> — Message suppliers and negotiate terms through the platform</li>
    </ul>
    <p style="font-size:14px;color:#6b7280;">RFQ Reference: <strong>${params.rfqId}</strong></p>
    <div style="text-align:center;">
      <a href="/dashboard/buyer/rfqs/${params.rfqId}" class="cta">Track My RFQ</a>
    </div>
  `)
}

export function buyerQuoteReceived(params: { name: string; rfqTitle: string; quoteCount: number; dashboardLink: string }): string {
  return wrapHtml(`
    <h1>You've Received Quotes! 📬</h1>
    <p>Hi ${params.name}, you have received <strong>${params.quoteCount} quote${params.quoteCount > 1 ? 's' : ''}</strong> for your RFQ <strong>"${params.rfqTitle}"</strong>.</p>
    <div class="divider"></div>
    <p>Log in to your dashboard to view, compare, and respond to quotes from suppliers. You can message suppliers directly to negotiate pricing and terms.</p>
    <div style="text-align:center;">
      <a href="${params.dashboardLink}" class="cta">View Quotes</a>
    </div>
  `)
}

export function buyerSupplierRecommendation(params: { name: string; category: string; supplierCount: number; supplierLink: string }): string {
  return wrapHtml(`
    <h1>Top Suppliers in ${params.category} 🏆</h1>
    <p>Hi ${params.name}, we've identified <strong>${params.supplierCount} top-rated supplier${params.supplierCount > 1 ? 's' : ''}</strong> in <strong>${params.category}</strong> for your upcoming project.</p>
    <div class="divider"></div>
    <p>These suppliers are verified, highly rated, and actively looking for new business. Browse their profiles, check their product catalogs, and send them a message directly.</p>
    <div style="text-align:center;">
      <a href="${params.supplierLink}" class="cta">Browse Suppliers</a>
    </div>
  `)
}

export function contractorWelcome(params: { name: string; dashboardLink: string }): string {
  return wrapHtml(`
    <h1>Welcome to Zanzibaba, ${params.name}! 🎉</h1>
    <p>Thank you for joining as a contractor on Zanzibar's #1 building marketplace. We're excited to help you grow your business.</p>
    <div class="divider"></div>
    <h2 style="font-size:18px;font-weight:600;color:#111827;margin:0 0 16px;">Getting Started</h2>
    <ul>
      <li><strong>📋 Set Up Your Portfolio</strong> — Showcase your past projects, certifications, and expertise</li>
      <li><strong>📄 Browse Project Leads</strong> — Get matched with projects that fit your skills</li>
      <li><strong>✅ Get Verified</strong> — Complete verification to earn the trusted badge and win more bids</li>
    </ul>
    <div style="text-align:center;">
      <a href="${params.dashboardLink}" class="cta">Go to Dashboard</a>
    </div>
  `)
}

export function contractorVerificationInvite(params: { name: string; verificationLink: string }): string {
  return wrapHtml(`
    <h1>Get Verified as a Contractor ✅</h1>
    <p>Hi ${params.name}, verified contractors win <strong>3x more projects</strong> on Zanzibaba. Complete your verification to build trust with clients and unlock premium project leads.</p>
    <div class="divider"></div>
    <h2 style="font-size:18px;font-weight:600;color:#111827;margin:0 0 16px;">Verification Benefits</h2>
    <ul>
      <li><strong>🏆 Priority in Search</strong> — Appear above unverified contractors</li>
      <li><strong>📈 Premium Project Access</strong> — Get invited to exclusive RFQs</li>
      <li><strong>🔒 Trust Badge</strong> — Build client confidence with the verified shield</li>
    </ul>
    <div style="text-align:center;">
      <a href="${params.verificationLink}" class="cta">Apply for Verification</a>
    </div>
  `)
}

export function contractorLeadNotification(params: { name: string; projectTitle: string; budget: string; leadLink: string }): string {
  return wrapHtml(`
    <h1>New Project Lead Available 📋</h1>
    <p>Hi ${params.name}, a new project that matches your expertise is now available on Zanzibaba.</p>
    <div class="divider"></div>
    <ul>
      <li><strong>📌 Project:</strong> ${params.projectTitle}</li>
      <li><strong>💰 Budget:</strong> ${params.budget}</li>
    </ul>
    <p>Submit your proposal early to increase your chances of winning the bid. First qualified response gets priority consideration.</p>
    <div style="text-align:center;">
      <a href="${params.leadLink}" class="cta">View Project Lead</a>
    </div>
  `)
}

export const emailTemplateMeta: Record<string, { name: string; description: string; category: string; params: string[] }> = {
  supplierWelcome: {
    name: "Supplier Welcome",
    description: "Sent when a supplier completes registration",
    category: "Supplier",
    params: ["name", "email", "dashboardLink"],
  },
  supplierProfileReminder: {
    name: "Supplier Profile Reminder",
    description: "Reminder to complete supplier profile after signup",
    category: "Supplier",
    params: ["name", "daysSinceSignup", "profileLink"],
  },
  supplierVerificationInvite: {
    name: "Supplier Verification Invite",
    description: "Invitation to get verified as a supplier",
    category: "Supplier",
    params: ["name", "verificationLink"],
  },
  supplierMembershipUpgrade: {
    name: "Supplier Membership Upgrade",
    description: "Promotion to upgrade membership plan",
    category: "Supplier",
    params: ["name", "currentPlan", "upgradeLink"],
  },
  buyerRFQConfirmation: {
    name: "Buyer RFQ Confirmation",
    description: "Confirmation when a buyer submits an RFQ",
    category: "Buyer",
    params: ["name", "rfqTitle", "rfqId"],
  },
  buyerQuoteReceived: {
    name: "Buyer Quote Received",
    description: "Notification when quotes are received for an RFQ",
    category: "Buyer",
    params: ["name", "rfqTitle", "quoteCount", "dashboardLink"],
  },
  buyerSupplierRecommendation: {
    name: "Buyer Supplier Recommendation",
    description: "Recommended suppliers for a buyer's category",
    category: "Buyer",
    params: ["name", "category", "supplierCount", "supplierLink"],
  },
  contractorWelcome: {
    name: "Contractor Welcome",
    description: "Sent when a contractor completes registration",
    category: "Contractor",
    params: ["name", "dashboardLink"],
  },
  contractorVerificationInvite: {
    name: "Contractor Verification Invite",
    description: "Invitation to get verified as a contractor",
    category: "Contractor",
    params: ["name", "verificationLink"],
  },
  contractorLeadNotification: {
    name: "Contractor Lead Notification",
    description: "Notification of a new project lead for contractors",
    category: "Contractor",
    params: ["name", "projectTitle", "budget", "leadLink"],
  },
  paymentApproved: {
    name: "Payment Approved",
    description: "Sent when a manual payment is approved",
    category: "Payment",
    params: ["name", "plan", "expiryDate", "dashboardLink"],
  },
}

export function paymentApproved(params: { name: string; plan: string; expiryDate: string; dashboardLink: string }): string {
  return wrapHtml(`
    <h1>Welcome to ${params.plan}! 🎉</h1>
    <p>Hi ${params.name}, your payment has been approved and your ${params.plan} subscription is now active.</p>
    <div class="divider"></div>
    <ul>
      <li><strong>📋 Plan:</strong> ${params.plan}</li>
      <li><strong>📅 Valid Until:</strong> ${params.expiryDate}</li>
    </ul>
    <p>You now have access to all ${params.plan} features including priority RFQ matching, unlimited listings, and advanced analytics.</p>
    <div style="text-align:center;">
      <a href="${params.dashboardLink}" class="cta">Go to Dashboard</a>
    </div>
  `)
}
