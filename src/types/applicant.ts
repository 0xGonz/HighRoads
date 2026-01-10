export type ApplicantStatus = 'new' | 'in_progress' | 'carrier_app' | 'pending' | 'complete'

export interface Applicant {
  id: string
  created_at: string
  updated_at: string

  // Contact info
  first_name: string
  last_name: string
  email: string
  phone: string
  sms_opt_in: boolean
  lead_source: string | null
  referral_code: string | null

  // Pre-qualification
  has_cdl: boolean | null
  has_medical_card: boolean | null
  experience_months: number | null
  location_state: string | null
  us_work_eligible: boolean | null

  // Qualification status
  is_prequalified: boolean
  disqualification_reason: string | null

  // Pipeline status
  status: ApplicantStatus

  // Full application
  weekly_payment_budget: string | null
  truck_preference: string | null
  freight_preference: string | null
  has_existing_carrier: boolean | null
  carrier_name: string | null

  // Admin
  notes: string | null
  assigned_to: string | null
}

export interface ApplicantFormData {
  // Step 1: Contact
  first_name: string
  last_name: string
  email: string
  phone: string
  sms_opt_in: boolean
  lead_source?: string
  referral_code?: string

  // Step 2: Pre-qualification
  has_cdl: boolean
  has_medical_card: boolean
  experience_months: number
  location_state: string
  us_work_eligible: boolean

  // Step 3: Preferences
  weekly_payment_budget: string
  truck_preference: string
  freight_preference: string
  has_existing_carrier: boolean
  carrier_name?: string
}
