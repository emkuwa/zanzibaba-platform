import { emailTemplateMeta } from "./templates"
import * as templates from "./templates"

export interface EmailPayload {
  to: string
  subject: string
  html: string
  from?: string
}

export async function sendEmail(payload: EmailPayload): Promise<{ success: boolean; messageId?: string }> {
  const messageId = `email_stub_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`

  console.log(`[Email Stub] Sending email to: ${payload.to}`)
  console.log(`[Email Stub] Subject: ${payload.subject}`)
  console.log(`[Email Stub] From: ${payload.from || "noreply@zanzibaba.co.tz"}`)
  console.log(`[Email Stub] Message ID: ${messageId}`)
  console.log(`[Email Stub] HTML length: ${payload.html.length} chars`)

  return { success: true, messageId }
}

export async function sendTemplatedEmail(
  template: string,
  to: string,
  params: Record<string, any>
): Promise<{ success: boolean }> {
  const meta = emailTemplateMeta[template]
  if (!meta) {
    console.error(`[Email Stub] Template "${template}" not found`)
    return { success: false }
  }

  const templateFn = (templates as unknown as Record<string, Function>)[template]
  if (!templateFn) {
    console.error(`[Email Stub] Template function "${template}" not found`)
    return { success: false }
  }

  const html = templateFn(params)
  const subject = meta.name

  const result = await sendEmail({ to, subject, html })
  return { success: result.success }
}
