/**
 * Automation Engine
 * Processes automation rules and sends messages automatically
 */

import { createServerSupabaseClient } from '../supabase-server'
import { sendEmail, sendTemplateEmail } from '../email'
import { sendSms, sendTemplateSms } from '../sms'
import type {
  Applicant,
  AutomationRule,
  AutomationExecution,
  MessageTemplate,
} from '@/types/database'

export interface ProcessResult {
  processed: number
  sent: number
  errors: string[]
}

/**
 * Process all active automation rules
 * This should be called by a cron job every 5 minutes
 */
export async function processAutomations(): Promise<ProcessResult> {
  const result: ProcessResult = {
    processed: 0,
    sent: 0,
    errors: [],
  }

  const supabase = await createServerSupabaseClient()

  // Get all active automation rules
  const { data: rules, error: rulesError } = await supabase
    .from('automation_rules')
    .select(`
      *,
      message_templates (*)
    `)
    .eq('is_active', true)
    .order('priority', { ascending: false })

  if (rulesError) {
    result.errors.push(`Failed to fetch rules: ${rulesError.message}`)
    return result
  }

  if (!rules || rules.length === 0) {
    return result
  }

  // Process each rule
  for (const rule of rules) {
    try {
      const ruleResult = await processRule(rule as AutomationRule & { message_templates: MessageTemplate | null })
      result.processed += ruleResult.processed
      result.sent += ruleResult.sent
      result.errors.push(...ruleResult.errors)
    } catch (error) {
      result.errors.push(`Rule ${rule.id}: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  return result
}

/**
 * Process a single automation rule
 */
async function processRule(
  rule: AutomationRule & { message_templates: MessageTemplate | null }
): Promise<ProcessResult> {
  const result: ProcessResult = {
    processed: 0,
    sent: 0,
    errors: [],
  }

  const supabase = await createServerSupabaseClient()

  // Find matching applicants based on trigger type
  let applicants: Applicant[] = []

  switch (rule.trigger_type) {
    case 'status_change':
      // Status change triggers are handled immediately when status changes
      // This is processed separately in the status update flow
      return result

    case 'days_in_status':
      applicants = await findApplicantsInStatusForDays(
        rule.trigger_status!,
        rule.trigger_days!
      )
      break

    case 'missing_documents':
      applicants = await findApplicantsWithMissingDocs(rule.trigger_days!)
      break

    case 'no_response':
      applicants = await findApplicantsWithNoResponse(rule.trigger_days!)
      break

    default:
      return result
  }

  // Process each matching applicant
  for (const applicant of applicants) {
    result.processed++

    // Skip if automation is paused for this applicant
    if (applicant.automation_paused) {
      continue
    }

    // Check if we should skip based on execution history
    const shouldProcess = await shouldProcessAutomation(rule, applicant)
    if (!shouldProcess) {
      continue
    }

    // Send the message
    try {
      const sent = await executeAutomation(rule, applicant)
      if (sent) {
        result.sent++
        await recordExecution(rule.id, applicant.id)
      }
    } catch (error) {
      result.errors.push(
        `Failed to send to ${applicant.id}: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  return result
}

/**
 * Find applicants who have been in a specific status for X days
 */
async function findApplicantsInStatusForDays(
  status: string,
  days: number
): Promise<Applicant[]> {
  const supabase = await createServerSupabaseClient()

  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - days)

  const { data, error } = await supabase
    .from('applicants')
    .select('*')
    .eq('status', status)
    .eq('automation_paused', false)
    .lte('updated_at', cutoffDate.toISOString())

  if (error) {
    console.error('Find applicants in status error:', error)
    return []
  }

  return data || []
}

/**
 * Find applicants with missing documents for X days
 */
async function findApplicantsWithMissingDocs(days: number): Promise<Applicant[]> {
  const supabase = await createServerSupabaseClient()

  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - days)

  // Get applicants in active statuses without all required documents
  const { data: applicants, error } = await supabase
    .from('applicants')
    .select('*')
    .in('status', ['new', 'in_progress'])
    .eq('automation_paused', false)
    .lte('created_at', cutoffDate.toISOString())

  if (error || !applicants) {
    return []
  }

  // Filter to those without complete documents
  const applicantsWithMissingDocs: Applicant[] = []

  for (const applicant of applicants) {
    const { data: docs } = await supabase
      .from('documents')
      .select('type')
      .eq('applicant_id', applicant.id)

    const docTypes = docs?.map(d => d.type) || []
    const requiredDocs = ['cdl_front', 'cdl_back', 'medical_card']
    const hasMissing = requiredDocs.some(d => !docTypes.includes(d))

    if (hasMissing) {
      applicantsWithMissingDocs.push(applicant)
    }
  }

  return applicantsWithMissingDocs
}

/**
 * Find applicants with no response for X days
 */
async function findApplicantsWithNoResponse(days: number): Promise<Applicant[]> {
  const supabase = await createServerSupabaseClient()

  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - days)

  // Find applicants we've contacted but haven't heard back from
  const { data, error } = await supabase
    .from('applicants')
    .select('*')
    .in('status', ['new', 'in_progress'])
    .eq('automation_paused', false)
    .not('last_contacted_at', 'is', null)
    .lte('last_contacted_at', cutoffDate.toISOString())
    .or('last_response_at.is.null,last_response_at.lt.last_contacted_at')

  if (error) {
    console.error('Find no response applicants error:', error)
    return []
  }

  return data || []
}

/**
 * Check if we should process an automation for an applicant
 */
async function shouldProcessAutomation(
  rule: AutomationRule,
  applicant: Applicant
): Promise<boolean> {
  const supabase = await createServerSupabaseClient()

  // Check execution history
  const { data: execution } = await supabase
    .from('automation_executions')
    .select('*')
    .eq('automation_id', rule.id)
    .eq('applicant_id', applicant.id)
    .single()

  if (!execution) {
    // No previous execution - OK to process
    return true
  }

  // Check if stopped
  if (execution.is_stopped) {
    return false
  }

  // Check max sends
  if (execution.execution_count >= rule.max_sends) {
    // Mark as stopped
    await supabase
      .from('automation_executions')
      .update({
        is_stopped: true,
        stop_reason: 'max_reached',
      })
      .eq('id', execution.id)
    return false
  }

  // Check stop conditions
  if (rule.stop_on_response && applicant.last_response_at) {
    const lastExec = execution.last_executed_at
    if (lastExec && new Date(applicant.last_response_at) > new Date(lastExec)) {
      await supabase
        .from('automation_executions')
        .update({
          is_stopped: true,
          stop_reason: 'response',
        })
        .eq('id', execution.id)
      return false
    }
  }

  // Check delay since last execution
  if (execution.last_executed_at) {
    const lastExecDate = new Date(execution.last_executed_at)
    const minNextExec = new Date(lastExecDate.getTime() + 24 * 60 * 60 * 1000) // Minimum 24 hours between executions
    if (new Date() < minNextExec) {
      return false
    }
  }

  return true
}

/**
 * Execute an automation - send the message
 */
async function executeAutomation(
  rule: AutomationRule & { message_templates: MessageTemplate | null },
  applicant: Applicant
): Promise<boolean> {
  // Check channel-specific requirements
  if (rule.action_channel === 'sms' && !applicant.sms_opt_in) {
    return false
  }

  // Send using template if available
  if (rule.action_template_id && rule.message_templates) {
    if (rule.action_channel === 'email') {
      const result = await sendTemplateEmail(
        rule.action_template_id,
        applicant,
        undefined // No admin user for automated messages
      )
      return result.success
    } else {
      const result = await sendTemplateSms(
        rule.action_template_id,
        applicant,
        undefined
      )
      return result.success
    }
  }

  // Fallback: send generic message
  if (rule.action_channel === 'email') {
    const result = await sendEmail({
      to: applicant.email,
      subject: 'Update from High Road Capital',
      body: `Hi ${applicant.first_name},\n\nWe wanted to check in on your application. Please let us know if you have any questions.\n\nBest regards,\nHigh Road Capital`,
      applicantId: applicant.id,
      isAutomated: true,
    })
    return result.success
  } else {
    const result = await sendSms({
      to: applicant.phone,
      body: `Hi ${applicant.first_name}, checking in on your application. Any questions? Reply or call us! - High Road Capital`,
      applicantId: applicant.id,
      isAutomated: true,
    })
    return result.success
  }
}

/**
 * Record an automation execution
 */
async function recordExecution(
  automationId: string,
  applicantId: string
): Promise<void> {
  const supabase = await createServerSupabaseClient()

  // Try to update existing record
  const { data: existing } = await supabase
    .from('automation_executions')
    .select('id, execution_count')
    .eq('automation_id', automationId)
    .eq('applicant_id', applicantId)
    .single()

  if (existing) {
    await supabase
      .from('automation_executions')
      .update({
        execution_count: existing.execution_count + 1,
        last_executed_at: new Date().toISOString(),
      })
      .eq('id', existing.id)
  } else {
    await supabase
      .from('automation_executions')
      .insert({
        automation_id: automationId,
        applicant_id: applicantId,
        execution_count: 1,
        last_executed_at: new Date().toISOString(),
      })
  }
}

/**
 * Process status change automations
 * Called immediately when an applicant's status changes
 */
export async function processStatusChange(
  applicant: Applicant,
  newStatus: string
): Promise<void> {
  if (applicant.automation_paused) {
    return
  }

  const supabase = await createServerSupabaseClient()

  // Find status change automations for this status
  const { data: rules } = await supabase
    .from('automation_rules')
    .select(`
      *,
      message_templates (*)
    `)
    .eq('is_active', true)
    .eq('trigger_type', 'status_change')
    .eq('trigger_status', newStatus)

  if (!rules || rules.length === 0) {
    return
  }

  // Execute each matching rule
  for (const rule of rules) {
    try {
      // Apply delay if specified
      if (rule.delay_minutes > 0) {
        // For delayed executions, we would need a job queue
        // For now, we'll skip delay and send immediately
        console.log(`Rule ${rule.id} has ${rule.delay_minutes}min delay (not yet implemented)`)
      }

      const sent = await executeAutomation(
        rule as AutomationRule & { message_templates: MessageTemplate | null },
        applicant
      )

      if (sent) {
        await recordExecution(rule.id, applicant.id)
      }
    } catch (error) {
      console.error(`Status change automation error for rule ${rule.id}:`, error)
    }
  }
}

/**
 * Stop all automations for an applicant
 */
export async function stopAutomationsForApplicant(
  applicantId: string,
  reason: string = 'manual'
): Promise<void> {
  const supabase = await createServerSupabaseClient()

  await supabase
    .from('automation_executions')
    .update({
      is_stopped: true,
      stop_reason: reason,
    })
    .eq('applicant_id', applicantId)
    .eq('is_stopped', false)
}
