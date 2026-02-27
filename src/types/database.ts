export type ApplicantStatus = 'new' | 'in_progress' | 'carrier_app' | 'pending' | 'complete' | 'disqualified'
export type AdminRole = 'admin' | 'manager' | 'staff'
export type DocumentType = 'cdl_front' | 'cdl_back' | 'medical_card' | 'mvr'
export type ReferralStatus = 'pending' | 'approved' | 'paid'

// CRM Workflow Types
export type CommunicationChannel = 'email' | 'sms'
export type CommunicationDirection = 'inbound' | 'outbound'
export type CommunicationStatus = 'pending' | 'sent' | 'delivered' | 'failed' | 'bounced'
export type EventType = 'call' | 'meeting' | 'follow_up' | 'document_review' | 'other'
export type EventStatus = 'scheduled' | 'completed' | 'cancelled' | 'no_show'
export type NotificationType = 'new_application' | 'document_upload' | 'applicant_response' | 'calendar_reminder' | 'automation_alert' | 'status_change' | 'new_booking'
export type TriggerType = 'status_change' | 'days_in_status' | 'missing_documents' | 'no_response'

// Simplified Database type for Supabase - just use any for now
// In production, use supabase gen types to generate proper types
export type Database = {
  public: {
    Tables: {
      applicants: {
        Row: Applicant
        Insert: ApplicantInsert
        Update: ApplicantUpdate
      }
      admin_users: {
        Row: AdminUser
        Insert: AdminUserInsert
        Update: Partial<AdminUser>
      }
      documents: {
        Row: Document
        Insert: DocumentInsert
        Update: Partial<Document>
      }
      activity_log: {
        Row: ActivityLog
        Insert: ActivityLogInsert
        Update: never
      }
      referrals: {
        Row: Referral
        Insert: ReferralInsert
        Update: Partial<Referral>
      }
    }
  }
}

// Applicant types
export interface Applicant {
  id: string
  created_at: string
  updated_at: string
  first_name: string
  last_name: string
  email: string
  phone: string
  sms_opt_in: boolean
  lead_source: string | null
  referral_code: string | null
  has_cdl: boolean | null
  has_medical_card: boolean | null
  experience_months: number | null
  location_state: string | null
  us_work_eligible: boolean | null
  is_prequalified: boolean
  disqualification_reason: string | null
  status: ApplicantStatus
  ownership_goal: string | null
  truck_preference: string | null
  freight_preference: string | null
  has_existing_carrier: boolean | null
  carrier_name: string | null
  notes: string | null
  assigned_to: string | null
  form_step: number | null
  is_complete: boolean
  // CRM workflow fields
  last_contacted_at: string | null
  last_response_at: string | null
  automation_paused: boolean
  preferred_contact_channel: string
}

export interface ApplicantInsert {
  id?: string
  created_at?: string
  updated_at?: string
  first_name: string
  last_name: string
  email: string
  phone: string
  sms_opt_in?: boolean
  lead_source?: string | null
  referral_code?: string | null
  has_cdl?: boolean | null
  has_medical_card?: boolean | null
  experience_months?: number | null
  location_state?: string | null
  us_work_eligible?: boolean | null
  is_prequalified?: boolean
  disqualification_reason?: string | null
  status?: ApplicantStatus
  ownership_goal?: string | null
  truck_preference?: string | null
  freight_preference?: string | null
  has_existing_carrier?: boolean | null
  carrier_name?: string | null
  notes?: string | null
  assigned_to?: string | null
  form_step?: number | null
  is_complete?: boolean
  // CRM workflow fields
  last_contacted_at?: string | null
  last_response_at?: string | null
  automation_paused?: boolean
  preferred_contact_channel?: string
}

export interface ApplicantUpdate {
  id?: string
  created_at?: string
  updated_at?: string
  first_name?: string
  last_name?: string
  email?: string
  phone?: string
  sms_opt_in?: boolean
  lead_source?: string | null
  referral_code?: string | null
  has_cdl?: boolean | null
  has_medical_card?: boolean | null
  experience_months?: number | null
  location_state?: string | null
  us_work_eligible?: boolean | null
  is_prequalified?: boolean
  disqualification_reason?: string | null
  status?: ApplicantStatus
  ownership_goal?: string | null
  truck_preference?: string | null
  freight_preference?: string | null
  has_existing_carrier?: boolean | null
  carrier_name?: string | null
  notes?: string | null
  assigned_to?: string | null
  form_step?: number | null
  is_complete?: boolean
  // CRM workflow fields
  last_contacted_at?: string | null
  last_response_at?: string | null
  automation_paused?: boolean
  preferred_contact_channel?: string
}

// Admin user types
export interface AdminUser {
  id: string
  email: string
  name: string
  role: AdminRole
  created_at: string
}

export interface AdminUserInsert {
  id: string
  email: string
  name: string
  role?: AdminRole
  created_at?: string
}

// Document types
export interface Document {
  id: string
  applicant_id: string
  type: DocumentType
  file_url: string
  file_name: string
  uploaded_at: string
}

export interface DocumentInsert {
  id?: string
  applicant_id: string
  type: DocumentType
  file_url: string
  file_name: string
  uploaded_at?: string
}

// Activity log types
export interface ActivityLog {
  id: string
  applicant_id: string | null
  admin_user_id: string
  action: string
  details: Record<string, unknown> | null
  created_at: string
}

export interface ActivityLogInsert {
  id?: string
  applicant_id?: string | null
  admin_user_id: string
  action: string
  details?: Record<string, unknown> | null
  created_at?: string
}

// Referral types
export interface Referral {
  id: string
  referrer_id: string
  referred_id: string
  relationship: string | null
  status: ReferralStatus
  created_at: string
}

export interface ReferralInsert {
  id?: string
  referrer_id: string
  referred_id: string
  relationship?: string | null
  status?: ReferralStatus
  created_at?: string
}

// ============================================
// CRM Workflow Types
// ============================================

// Message Template types
export interface MessageTemplate {
  id: string
  name: string
  channel: CommunicationChannel
  category: string
  subject: string | null
  body: string
  variables: string[]
  is_active: boolean
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface MessageTemplateInsert {
  id?: string
  name: string
  channel: CommunicationChannel
  category: string
  subject?: string | null
  body: string
  variables?: string[]
  is_active?: boolean
  created_by?: string | null
  created_at?: string
  updated_at?: string
}

// Communication types
export interface Communication {
  id: string
  applicant_id: string
  admin_user_id: string | null
  channel: CommunicationChannel
  direction: CommunicationDirection
  subject: string | null
  body: string
  status: CommunicationStatus
  template_id: string | null
  is_automated: boolean
  external_id: string | null
  sent_at: string | null
  delivered_at: string | null
  failed_reason: string | null
  created_at: string
}

export interface CommunicationInsert {
  id?: string
  applicant_id: string
  admin_user_id?: string | null
  channel: CommunicationChannel
  direction: CommunicationDirection
  subject?: string | null
  body: string
  status?: CommunicationStatus
  template_id?: string | null
  is_automated?: boolean
  external_id?: string | null
  sent_at?: string | null
  delivered_at?: string | null
  failed_reason?: string | null
  created_at?: string
}

// Automation Rule types
export interface AutomationRule {
  id: string
  name: string
  description: string | null
  trigger_type: TriggerType
  trigger_status: ApplicantStatus | null
  trigger_days: number | null
  action_template_id: string | null
  action_channel: CommunicationChannel
  stop_on_response: boolean
  stop_on_status_change: boolean
  max_sends: number
  delay_minutes: number
  is_active: boolean
  priority: number
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface AutomationRuleInsert {
  id?: string
  name: string
  description?: string | null
  trigger_type: TriggerType
  trigger_status?: ApplicantStatus | null
  trigger_days?: number | null
  action_template_id?: string | null
  action_channel: CommunicationChannel
  stop_on_response?: boolean
  stop_on_status_change?: boolean
  max_sends?: number
  delay_minutes?: number
  is_active?: boolean
  priority?: number
  created_by?: string | null
  created_at?: string
  updated_at?: string
}

// Automation Execution types
export interface AutomationExecution {
  id: string
  automation_id: string
  applicant_id: string
  execution_count: number
  last_executed_at: string | null
  next_scheduled_at: string | null
  is_stopped: boolean
  stop_reason: string | null
  created_at: string
}

export interface AutomationExecutionInsert {
  id?: string
  automation_id: string
  applicant_id: string
  execution_count?: number
  last_executed_at?: string | null
  next_scheduled_at?: string | null
  is_stopped?: boolean
  stop_reason?: string | null
  created_at?: string
}

// Calendar Event types
export interface CalendarEvent {
  id: string
  admin_user_id: string
  applicant_id: string | null
  title: string
  description: string | null
  event_type: EventType
  starts_at: string
  ends_at: string
  status: EventStatus
  reminder_sent: boolean
  meeting_link: string | null
  phone_number: string | null
  notes: string | null
  booking_token: string | null
  created_at: string
  updated_at: string
}

export interface CalendarEventInsert {
  id?: string
  admin_user_id: string
  applicant_id?: string | null
  title: string
  description?: string | null
  event_type: EventType
  starts_at: string
  ends_at: string
  status?: EventStatus
  reminder_sent?: boolean
  meeting_link?: string | null
  phone_number?: string | null
  notes?: string | null
  booking_token?: string | null
  created_at?: string
  updated_at?: string
}

// Admin Availability types
export interface AdminAvailability {
  id: string
  admin_user_id: string
  day_of_week: number
  start_time: string
  end_time: string
  is_active: boolean
  timezone: string
  created_at: string
}

export interface AdminAvailabilityInsert {
  id?: string
  admin_user_id: string
  day_of_week: number
  start_time: string
  end_time: string
  is_active?: boolean
  timezone?: string
  created_at?: string
}

// Admin Blocked Times types
export interface AdminBlockedTime {
  id: string
  admin_user_id: string
  starts_at: string
  ends_at: string
  reason: string | null
  created_at: string
}

export interface AdminBlockedTimeInsert {
  id?: string
  admin_user_id: string
  starts_at: string
  ends_at: string
  reason?: string | null
  created_at?: string
}

// Admin Notification types
export interface AdminNotification {
  id: string
  admin_user_id: string
  type: NotificationType
  title: string
  body: string | null
  applicant_id: string | null
  link: string | null
  is_read: boolean
  created_at: string
}

export interface AdminNotificationInsert {
  id?: string
  admin_user_id: string
  type: NotificationType
  title: string
  body?: string | null
  applicant_id?: string | null
  link?: string | null
  is_read?: boolean
  created_at?: string
}

// Push Subscription types
export interface PushSubscription {
  id: string
  admin_user_id: string
  endpoint: string
  p256dh_key: string
  auth_key: string
  is_active: boolean
  created_at: string
}

export interface PushSubscriptionInsert {
  id?: string
  admin_user_id: string
  endpoint: string
  p256dh_key: string
  auth_key: string
  is_active?: boolean
  created_at?: string
}

// Admin Notification Settings types
export interface AdminNotificationSettings {
  id: string
  admin_user_id: string
  email_new_application: boolean
  email_document_uploaded: boolean
  email_daily_digest: boolean
  email_status_change: boolean
  push_new_application: boolean
  push_document_uploaded: boolean
  push_applicant_response: boolean
  push_calendar_reminder: boolean
  sound_enabled: boolean
  created_at: string
  updated_at: string
}

export interface AdminNotificationSettingsInsert {
  id?: string
  admin_user_id: string
  email_new_application?: boolean
  email_document_uploaded?: boolean
  email_daily_digest?: boolean
  email_status_change?: boolean
  push_new_application?: boolean
  push_document_uploaded?: boolean
  push_applicant_response?: boolean
  push_calendar_reminder?: boolean
  sound_enabled?: boolean
  created_at?: string
  updated_at?: string
}
