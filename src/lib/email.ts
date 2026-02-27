/**
 * Email Service - Resend Integration
 * Handles all outbound email communications
 */

import { Resend } from 'resend'
import { createServerSupabaseClient } from './supabase-server'
import type {
  Applicant,
  MessageTemplate,
  CommunicationInsert
} from '@/types/database'

// Lazy initialization of Resend client
let resend: Resend | null = null

function getResendClient(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    return null
  }
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY)
  }
  return resend
}

// Configuration
const FROM_EMAIL = process.env.EMAIL_FROM || 'High Road Capital <noreply@highroadcapital.com>'
const REPLY_TO = process.env.EMAIL_REPLY_TO || 'support@highroadcapital.com'

export interface SendEmailOptions {
  to: string
  subject: string
  body: string
  applicantId: string
  adminUserId?: string
  templateId?: string
  isAutomated?: boolean
}

export interface SimpleEmailOptions {
  to: string
  subject: string
  html: string
}

export interface SendEmailResult {
  success: boolean
  messageId?: string
  error?: string
}

/**
 * Check if email service is configured
 */
export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY)
}

/**
 * Send a simple email (no logging to communications table)
 * Use for booking confirmations, admin notifications, etc.
 */
export async function sendSimpleEmail(options: SimpleEmailOptions): Promise<SendEmailResult> {
  const { to, subject, html } = options

  const resendClient = getResendClient()
  if (!resendClient) {
    console.warn('Email service not configured - RESEND_API_KEY is missing')
    return { success: false, error: 'Email service not configured' }
  }

  try {
    const { data, error } = await resendClient.emails.send({
      from: FROM_EMAIL,
      to: [to],
      replyTo: REPLY_TO,
      subject,
      html,
    })

    if (error) {
      console.error('Resend error:', error)
      return { success: false, error: error.message }
    }

    return { success: true, messageId: data?.id }
  } catch (error) {
    console.error('Email send error:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

/**
 * Send an email using Resend
 */
export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  const { to, subject, body, applicantId, adminUserId, templateId, isAutomated = false } = options

  const resendClient = getResendClient()
  if (!resendClient) {
    console.warn('Email service not configured - RESEND_API_KEY is missing')
    return { success: false, error: 'Email service not configured' }
  }

  try {
    // Send email via Resend
    const { data, error } = await resendClient.emails.send({
      from: FROM_EMAIL,
      to: [to],
      replyTo: REPLY_TO,
      subject,
      html: formatEmailBody(body),
    })

    if (error) {
      console.error('Resend error:', error)

      // Log failed communication
      await logCommunication({
        applicant_id: applicantId,
        admin_user_id: adminUserId || null,
        channel: 'email',
        direction: 'outbound',
        subject,
        body,
        status: 'failed',
        template_id: templateId || null,
        is_automated: isAutomated,
        failed_reason: error.message,
      })

      return { success: false, error: error.message }
    }

    // Log successful communication
    await logCommunication({
      applicant_id: applicantId,
      admin_user_id: adminUserId || null,
      channel: 'email',
      direction: 'outbound',
      subject,
      body,
      status: 'sent',
      template_id: templateId || null,
      is_automated: isAutomated,
      external_id: data?.id || null,
      sent_at: new Date().toISOString(),
    })

    // Update applicant's last_contacted_at
    await updateApplicantContactTime(applicantId)

    return { success: true, messageId: data?.id }
  } catch (error) {
    console.error('Email send error:', error)

    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    // Log failed communication
    await logCommunication({
      applicant_id: applicantId,
      admin_user_id: adminUserId || null,
      channel: 'email',
      direction: 'outbound',
      subject,
      body,
      status: 'failed',
      template_id: templateId || null,
      is_automated: isAutomated,
      failed_reason: errorMessage,
    })

    return { success: false, error: errorMessage }
  }
}

/**
 * Send email using a template
 */
export async function sendTemplateEmail(
  templateId: string,
  applicant: Applicant,
  adminUserId?: string,
  additionalVariables?: Record<string, string>
): Promise<SendEmailResult> {
  const supabase = await createServerSupabaseClient()

  // Get template
  const { data: template, error } = await supabase
    .from('message_templates')
    .select('*')
    .eq('id', templateId)
    .eq('channel', 'email')
    .single()

  if (error || !template) {
    return { success: false, error: 'Template not found' }
  }

  // Get admin name if available
  let adminName = 'High Road Capital Team'
  if (adminUserId) {
    const { data: admin } = await supabase
      .from('admin_users')
      .select('name')
      .eq('id', adminUserId)
      .single()
    if (admin) {
      adminName = admin.name
    }
  }

  // Substitute variables
  const variables: Record<string, string> = {
    first_name: applicant.first_name,
    last_name: applicant.last_name,
    full_name: `${applicant.first_name} ${applicant.last_name}`,
    email: applicant.email,
    phone: applicant.phone,
    admin_name: adminName,
    ...additionalVariables,
  }

  const subject = substituteVariables(template.subject || '', variables)
  const body = substituteVariables(template.body, variables)

  return sendEmail({
    to: applicant.email,
    subject,
    body,
    applicantId: applicant.id,
    adminUserId,
    templateId,
    isAutomated: false,
  })
}

/**
 * Get all email templates
 */
export async function getEmailTemplates(): Promise<MessageTemplate[]> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('message_templates')
    .select('*')
    .eq('channel', 'email')
    .eq('is_active', true)
    .order('category', { ascending: true })
    .order('name', { ascending: true })

  if (error) {
    console.error('Get email templates error:', error)
    return []
  }

  return data || []
}

/**
 * Substitute template variables
 */
export function substituteVariables(
  text: string,
  variables: Record<string, string>
): string {
  let result = text
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'gi')
    result = result.replace(regex, value || '')
  }
  return result
}

/**
 * Format email body as HTML
 */
function formatEmailBody(body: string): string {
  // Convert line breaks to HTML
  const htmlBody = body
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>High Road Capital</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        p {
          margin: 0 0 16px;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          font-size: 12px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <p>${htmlBody}</p>
      <div class="footer">
        <p>High Road Capital<br>
        Your Partner in Truck Ownership</p>
      </div>
    </body>
    </html>
  `
}

/**
 * Log communication to database
 */
async function logCommunication(data: CommunicationInsert): Promise<void> {
  const supabase = await createServerSupabaseClient()

  const { error } = await supabase
    .from('communications')
    .insert(data)

  if (error) {
    console.error('Log communication error:', error)
  }
}

/**
 * Update applicant's last_contacted_at timestamp
 */
async function updateApplicantContactTime(applicantId: string): Promise<void> {
  const supabase = await createServerSupabaseClient()

  const { error } = await supabase
    .from('applicants')
    .update({ last_contacted_at: new Date().toISOString() })
    .eq('id', applicantId)

  if (error) {
    console.error('Update contact time error:', error)
  }
}

/**
 * Send welcome email to new applicant
 */
export async function sendWelcomeEmail(applicant: Applicant): Promise<SendEmailResult> {
  const supabase = await createServerSupabaseClient()

  // Find welcome email template
  const { data: template } = await supabase
    .from('message_templates')
    .select('id')
    .eq('category', 'welcome')
    .eq('channel', 'email')
    .eq('is_active', true)
    .single()

  if (template) {
    return sendTemplateEmail(template.id, applicant, undefined)
  }

  // Fallback: send default welcome email
  return sendEmail({
    to: applicant.email,
    subject: 'Welcome to High Road Capital!',
    body: `Hi ${applicant.first_name},

Thank you for applying to our lease-to-own program! We're excited to help you start your journey to truck ownership.

Your application has been received and our team will review it shortly.

Best regards,
The High Road Capital Team`,
    applicantId: applicant.id,
    isAutomated: true,
  })
}

/**
 * Preview an email template with sample data
 */
export function previewTemplate(
  template: MessageTemplate,
  sampleData?: Partial<Applicant>
): { subject: string; body: string } {
  const variables: Record<string, string> = {
    first_name: sampleData?.first_name || 'John',
    last_name: sampleData?.last_name || 'Doe',
    full_name: `${sampleData?.first_name || 'John'} ${sampleData?.last_name || 'Doe'}`,
    email: sampleData?.email || 'john.doe@example.com',
    phone: sampleData?.phone || '(555) 123-4567',
    admin_name: 'High Road Capital Team',
  }

  return {
    subject: substituteVariables(template.subject || '', variables),
    body: substituteVariables(template.body, variables),
  }
}
