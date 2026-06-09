export type ActivationState = "NONE" | "UNCLAIMED" | "CLAIMED" | "VERIFIED" | "FEATURED"

export interface ActivationStats {
  totalDiscovered: number
  claimReady: number
  invited: number
  visited: number
  claimed: number
  verified: number
  featured: number
  whatsappSent: number
  whatsappDelivered: number
  whatsappOpened: number
  foundingInvited: number
  foundingClaimed: number
}

export interface ClaimProfileResult {
  success: boolean
  lead?: {
    id: string
    companyName: string | null
    activationStatus: string
    claimToken: string | null
  }
  error?: string
}

export interface WhatsAppSendResult {
  messageId: string
  leadId: string
  status: string
  claimLink: string
}

export interface FoundingCampaignStats {
  totalInvited: number
  totalClaimed: number
  totalVerified: number
  totalFeatured: number
  byCampaign: Record<string, {
    invited: number
    claimed: number
    verified: number
    featured: number
  }>
}
