import { whatsappTemplates, type WhatsAppTemplateKey } from "./templates"

export function getWhatsAppLink(phoneNumber: string, message?: string): string {
  const formatted = formatPhoneForWA(phoneNumber)
  const base = `https://wa.me/${formatted}`
  if (message) {
    return `${base}?text=${encodeURIComponent(message)}`
  }
  return base
}

export function formatPhoneForWA(phone: string): string {
  let cleaned = phone.replace(/[+\s\-()]/g, "")
  if (cleaned.startsWith("0")) {
    cleaned = "255" + cleaned.slice(1)
  } else if (cleaned.startsWith("255")) {
    cleaned = "255" + cleaned.slice(3)
  } else if (!cleaned.startsWith("255")) {
    cleaned = "255" + cleaned
  }
  return cleaned
}

export async function sendWhatsAppTemplate(
  templateKey: string,
  to: string,
  params: Record<string, string>
): Promise<{ success: boolean; messageId?: string }> {
  const templateFn = (whatsappTemplates as Record<string, Function>)[templateKey]
  if (!templateFn) {
    console.error(`[WhatsApp Stub] Template "${templateKey}" not found`)
    return { success: false }
  }

  const resolved = templateFn(...Object.values(params))
  const messageId = `wa_stub_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`

  console.log(`[WhatsApp Stub] Sending template "${templateKey}" (${resolved.category}) to ${to}`)
  console.log(`[WhatsApp Stub] Message: ${resolved.message}`)
  console.log(`[WhatsApp Stub] Message ID: ${messageId}`)

  return { success: true, messageId }
}
