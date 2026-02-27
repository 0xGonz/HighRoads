/**
 * SMS Service - Twilio Integration
 * Handles all SMS communications
 */

import twilio from 'twilio'
import { createServerSupabaseClient } from './supabase-server'
import type {
  Applicant,
  MessageTemplate,
  CommunicationInsert
} from '@/types/database'
import { substituteVariables } from './email'

// Initialize Twilio client
const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null

// Configuration
const FROM_PHONE = process.env.TWILIO_PHONE_NUMBER || ''

export interface SendSmsOptions {
  to: string
  body: string
  applicantId: string
  adminUserId?: string
  templateId?: string
  isAutomated?: boolean
}

export interface SendSmsResult {
  success: boolean
  messageId?: string
  error?: string
}

/**
 * Check if SMS service is configured
 */
export function isSmsConfigured(): boolean {
  return Boolean(
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_PHONE_NUMBER
  )
}

/**
 * Format phone number for Twilio (E.164 format)
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '')

  // Handle US numbers
  if (cleaned.length === 10) {
    return `+1${cleaned}`
  }
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+${cleaned}`
  }

  // Return as-is if already has country code
  return cleaned.startsWith('+') ? cleaned : `+${cleaned}`
}

/**
 * Send an SMS using Twilio
 */
export async function sendSms(options: SendSmsOptions): Promise<SendSmsResult> {
  const { to, body, applicantId, adminUserId, templateId, isAutomated = false } = options

  if (!isSmsConfigured() || !twilioClient) {
    console.warn('SMS service not configured - Twilio credentials missing')
    return { success: false, error: 'SMS service not configured' }
  }

  const formattedPhone = formatPhoneNumber(to)

  try {
    // Send SMS via Twilio
    const message = await twilioClient.messages.create({
      from: FROM_PHONE,
      to: formattedPhone,
      body,
    })

    // Log successful communication
    await logCommunication({
      applicant_id: applicantId,
      admin_user_id: adminUserId || null,
      channel: 'sms',
      direction: 'outbound',
      subject: null,
      body,
      status: 'sent',
      template_id: templateId || null,
      is_automated: isAutomated,
      external_id: message.sid,
      sent_at: new Date().toISOString(),
    })

    // Update applicant's last_contacted_at
    await updateApplicantContactTime(applicantId)

    return { success: true, messageId: message.sid }
  } catch (error) {
    console.error('SMS send error:', error)

    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    // Log failed communication
    await logCommunication({
      applicant_id: applicantId,
      admin_user_id: adminUserId || null,
      channel: 'sms',
      direction: 'outbound',
      subject: null,
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
 * Send SMS using a template
 */
export async function sendTemplateSms(
  templateId: string,
  applicant: Applicant,
  adminUserId?: string,
  additionalVariables?: Record<string, string>
): Promise<SendSmsResult> {
  const supabase = await createServerSupabaseClient()

  // Get template
  const { data: template, error } = await supabase
    .from('message_templates')
    .select('*')
    .eq('id', templateId)
    .eq('channel', 'sms')
    .single()

  if (error || !template) {
    return { success: false, error: 'Template not found' }
  }

  // Get admin name if available
  let adminName = 'High Road Capital'
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
    admin_name: adminName,
    ...additionalVariables,
  }

  const body = substituteVariables(template.body, variables)

  // Check SMS opt-in
  if (!applicant.sms_opt_in) {
    console.warn(`Applicant ${applicant.id} has not opted in for SMS`)
    return { success: false, error: 'Applicant has not opted in for SMS' }
  }

  return sendSms({
    to: applicant.phone,
    body,
    applicantId: applicant.id,
    adminUserId,
    templateId,
    isAutomated: false,
  })
}

/**
 * Get all SMS templates
 */
export async function getSmsTemplates(): Promise<MessageTemplate[]> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('message_templates')
    .select('*')
    .eq('channel', 'sms')
    .eq('is_active', true)
    .order('category', { ascending: true })
    .order('name', { ascending: true })

  if (error) {
    console.error('Get SMS templates error:', error)
    return []
  }

  return data || []
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
 * Send welcome SMS to new applicant (if opted in)
 */
export async function sendWelcomeSms(applicant: Applicant): Promise<SendSmsResult> {
  // Check SMS opt-in
  if (!applicant.sms_opt_in) {
    return { success: false, error: 'Applicant has not opted in for SMS' }
  }

  const supabase = await createServerSupabaseClient()

  // Find welcome SMS template
  const { data: template } = await supabase
    .from('message_templates')
    .select('id')
    .eq('category', 'welcome')
    .eq('channel', 'sms')
    .eq('is_active', true)
    .single()

  if (template) {
    return sendTemplateSms(template.id, applicant, undefined)
  }

  // Fallback: send default welcome SMS
  return sendSms({
    to: applicant.phone,
    body: `Hi ${applicant.first_name}! Thanks for applying to High Road Capital. We received your application and will be in touch soon. Reply STOP to opt out.`,
    applicantId: applicant.id,
    isAutomated: true,
  })
}

/**
 * Handle inbound SMS webhook from Twilio
 */
export async function handleInboundSms(
  from: string,
  body: string
): Promise<{ applicantId?: string; isOptOut: boolean }> {
  const supabase = await createServerSupabaseClient()

  // Check for opt-out keywords
  const optOutKeywords = ['STOP', 'UNSUBSCRIBE', 'CANCEL', 'END', 'QUIT']
  const isOptOut = optOutKeywords.some(keyword =>
    body.trim().toUpperCase() === keyword
  )

  // Find applicant by phone number
  const cleanPhone = from.replace(/\D/g, '')
  const { data: applicant } = await supabase
    .from('applicants')
    .select('id')
    .or(`phone.ilike.%${cleanPhone.slice(-10)}%`)
    .single()

  if (!applicant) {
    console.log('Inbound SMS from unknown number:', from)
    return { isOptOut: false }
  }

  // Handle opt-out
  if (isOptOut) {
    await supabase
      .from('applicants')
      .update({ sms_opt_in: false })
      .eq('id', applicant.id)

    console.log(`Applicant ${applicant.id} opted out of SMS`)
    return { applicantId: applicant.id, isOptOut: true }
  }

  // Log inbound communication
  await logCommunication({
    applicant_id: applicant.id,
    admin_user_id: null,
    channel: 'sms',
    direction: 'inbound',
    subject: null,
    body,
    status: 'delivered',
    is_automated: false,
    delivered_at: new Date().toISOString(),
  })

  // Update applicant's last_response_at
  await supabase
    .from('applicants')
    .update({ last_response_at: new Date().toISOString() })
    .eq('id', applicant.id)

  return { applicantId: applicant.id, isOptOut: false }
}

/**
 * Preview an SMS template with sample data
 */
export function previewSmsTemplate(
  template: MessageTemplate,
  sampleData?: Partial<Applicant>
): string {
  const variables: Record<string, string> = {
    first_name: sampleData?.first_name || 'John',
    last_name: sampleData?.last_name || 'Doe',
    full_name: `${sampleData?.first_name || 'John'} ${sampleData?.last_name || 'Doe'}`,
    admin_name: 'High Road Capital',
  }

  return substituteVariables(template.body, variables)
}
