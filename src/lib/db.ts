/**
 * Database Layer - Replaces GoHighLevel Integration
 * Handles all applicant data operations using Supabase
 */

import { createServerSupabaseClient } from './supabase-server'
import type {
  Applicant,
  ApplicantInsert,
  ApplicantUpdate,
  ApplicantStatus,
  Document,
  DocumentInsert,
  ActivityLogInsert,
} from '@/types/database'
import { isDemoMode, mockApplicants, mockStats } from './demo-data'

// ============================================
// Configuration
// ============================================

export function isDBConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

// ============================================
// Applicant Operations
// ============================================

/**
 * Create or update an applicant by email
 */
export async function upsertApplicant(
  data: ApplicantInsert
): Promise<{ applicant: Applicant; isNew: boolean }> {
  const supabase = await createServerSupabaseClient()

  // Check if applicant exists
  const existing = await findApplicantByEmail(data.email)

  if (existing) {
    // Update existing applicant
    const updated = await updateApplicant(existing.id, data)
    return { applicant: updated, isNew: false }
  }

  // Create new applicant
  const { data: applicant, error } = await supabase
    .from('applicants')
    .insert(data)
    .select()
    .single()

  if (error) {
    console.error('Create applicant error:', error)
    throw new Error(`Failed to create applicant: ${error.message}`)
  }

  return { applicant, isNew: true }
}

/**
 * Find an applicant by email
 */
export async function findApplicantByEmail(email: string): Promise<Applicant | null> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('applicants')
    .select('*')
    .eq('email', email.toLowerCase())
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('Find applicant error:', error)
    return null
  }

  return data
}

/**
 * Find an applicant by ID
 */
export async function findApplicantById(id: string): Promise<Applicant | null> {
  // Demo mode: return mock applicant
  if (isDemoMode) {
    return mockApplicants.find(a => a.id === id) || null
  }

  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('applicants')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Find applicant by ID error:', error)
    return null
  }

  return data
}

/**
 * Update an existing applicant
 */
export async function updateApplicant(
  id: string,
  data: ApplicantUpdate
): Promise<Applicant> {
  // Demo mode: simulate update
  if (isDemoMode) {
    const existing = mockApplicants.find(a => a.id === id)
    if (!existing) {
      throw new Error('Applicant not found')
    }
    // Return merged data (doesn't actually persist in demo mode)
    return { ...existing, ...data, updated_at: new Date().toISOString() }
  }

  const supabase = await createServerSupabaseClient()

  const { data: applicant, error } = await supabase
    .from('applicants')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Update applicant error:', error)
    throw new Error(`Failed to update applicant: ${error.message}`)
  }

  return applicant
}

/**
 * Update applicant status
 */
export async function updateApplicantStatus(
  id: string,
  status: ApplicantStatus
): Promise<Applicant> {
  return updateApplicant(id, { status })
}

/**
 * List applicants with filtering and pagination
 */
export async function listApplicants(options: {
  page?: number
  limit?: number
  status?: ApplicantStatus
  isPrequalified?: boolean
  search?: string
  sortBy?: 'created_at' | 'updated_at' | 'first_name' | 'last_name'
  sortOrder?: 'asc' | 'desc'
} = {}): Promise<{ applicants: Applicant[]; total: number }> {
  // Demo mode: return filtered mock applicants
  if (isDemoMode) {
    let filtered = [...mockApplicants]
    if (options.status) {
      filtered = filtered.filter(a => a.status === options.status)
    }
    if (options.search) {
      const s = options.search.toLowerCase()
      filtered = filtered.filter(a =>
        a.first_name.toLowerCase().includes(s) ||
        a.last_name.toLowerCase().includes(s) ||
        a.email.toLowerCase().includes(s)
      )
    }
    return { applicants: filtered, total: filtered.length }
  }

  const supabase = await createServerSupabaseClient()

  const {
    page = 1,
    limit = 20,
    status,
    isPrequalified,
    search,
    sortBy = 'created_at',
    sortOrder = 'desc',
  } = options

  const offset = (page - 1) * limit

  let query = supabase
    .from('applicants')
    .select('*', { count: 'exact' })

  if (status) {
    query = query.eq('status', status)
  }

  if (isPrequalified !== undefined) {
    query = query.eq('is_prequalified', isPrequalified)
  }

  if (search) {
    query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`)
  }

  const { data, error, count } = await query
    .order(sortBy, { ascending: sortOrder === 'asc' })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error('List applicants error:', error)
    throw new Error(`Failed to list applicants: ${error.message}`)
  }

  return { applicants: data || [], total: count || 0 }
}

/**
 * Get applicants by status (for pipeline view)
 */
export async function getApplicantsByStatus(): Promise<Record<ApplicantStatus, Applicant[]>> {
  // Demo mode: group mock applicants by status
  if (isDemoMode) {
    const grouped: Record<ApplicantStatus, Applicant[]> = {
      new: [],
      in_progress: [],
      carrier_app: [],
      pending: [],
      complete: [],
      disqualified: [],
    }
    for (const applicant of mockApplicants) {
      const status = applicant.status as ApplicantStatus
      if (grouped[status]) {
        grouped[status].push(applicant)
      }
    }
    return grouped
  }

  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('applicants')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Get applicants by status error:', error)
    throw new Error(`Failed to get applicants: ${error.message}`)
  }

  const grouped: Record<ApplicantStatus, Applicant[]> = {
    new: [],
    in_progress: [],
    carrier_app: [],
    pending: [],
    complete: [],
    disqualified: [],
  }

  for (const applicant of (data || []) as Applicant[]) {
    const status = applicant.status as ApplicantStatus
    if (grouped[status]) {
      grouped[status].push(applicant)
    }
  }

  return grouped
}

/**
 * Get dashboard statistics
 */
export async function getDashboardStats(): Promise<{
  total: number
  new: number
  inProgress: number
  prequalified: number
  complete: number
  recentApplications: Applicant[]
}> {
  // Demo mode: return mock stats
  if (isDemoMode) {
    return {
      total: mockApplicants.length,
      new: mockApplicants.filter(a => a.status === 'new').length,
      inProgress: mockApplicants.filter(a => ['in_progress', 'carrier_app', 'pending'].includes(a.status)).length,
      prequalified: mockApplicants.filter(a => a.is_prequalified).length,
      complete: mockApplicants.filter(a => a.status === 'complete').length,
      recentApplications: mockApplicants.slice(0, 5),
    }
  }

  const supabase = await createServerSupabaseClient()

  // Get counts
  const { count: total } = await supabase
    .from('applicants')
    .select('*', { count: 'exact', head: true })

  const { count: newCount } = await supabase
    .from('applicants')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'new')

  const { count: inProgressCount } = await supabase
    .from('applicants')
    .select('*', { count: 'exact', head: true })
    .in('status', ['in_progress', 'carrier_app', 'pending'])

  const { count: prequalifiedCount } = await supabase
    .from('applicants')
    .select('*', { count: 'exact', head: true })
    .eq('is_prequalified', true)

  const { count: completeCount } = await supabase
    .from('applicants')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'complete')

  // Get recent applications
  const { data: recent } = await supabase
    .from('applicants')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  return {
    total: total || 0,
    new: newCount || 0,
    inProgress: inProgressCount || 0,
    prequalified: prequalifiedCount || 0,
    complete: completeCount || 0,
    recentApplications: recent || [],
  }
}

// ============================================
// Application Submission Functions
// ============================================

interface ApplicationData {
  first_name: string
  last_name: string
  email: string
  phone: string
  sms_opt_in?: boolean
  lead_source?: string
  referral_code?: string
  has_cdl?: boolean
  has_medical_card?: boolean
  experience_months?: number
  location_state?: string
  us_work_eligible?: boolean
  ownership_goal?: string
  truck_preference?: string
  freight_preference?: string
  has_existing_carrier?: boolean
  carrier_name?: string
}

/**
 * Submit partial application (for abandoned form tracking)
 */
export async function submitPartialApplication(
  data: Pick<ApplicationData, 'first_name' | 'last_name' | 'email' | 'phone'>,
  step: number
): Promise<{ applicantId: string }> {
  const { applicant } = await upsertApplicant({
    first_name: data.first_name,
    last_name: data.last_name,
    email: data.email.toLowerCase(),
    phone: data.phone,
    form_step: step,
    is_complete: false,
    status: 'new',
  })

  return { applicantId: applicant.id }
}

/**
 * Submit complete application
 */
export async function submitCompleteApplication(
  data: ApplicationData,
  existingApplicantId?: string
): Promise<{ applicantId: string; isPrequalified: boolean }> {
  const isPrequalified = Boolean(
    data.has_cdl &&
    data.has_medical_card &&
    (data.experience_months || 0) >= 12 &&
    data.us_work_eligible
  )

  const applicantData: ApplicantInsert = {
    first_name: data.first_name,
    last_name: data.last_name,
    email: data.email.toLowerCase(),
    phone: data.phone,
    sms_opt_in: data.sms_opt_in || false,
    lead_source: data.lead_source || null,
    referral_code: data.referral_code || null,
    has_cdl: data.has_cdl || null,
    has_medical_card: data.has_medical_card || null,
    experience_months: data.experience_months || null,
    location_state: data.location_state || null,
    us_work_eligible: data.us_work_eligible || null,
    is_prequalified: isPrequalified,
    disqualification_reason: isPrequalified ? null : getDisqualificationReason(data),
    status: isPrequalified ? 'new' : 'disqualified',
    ownership_goal: data.ownership_goal || null,
    truck_preference: data.truck_preference || null,
    freight_preference: data.freight_preference || null,
    has_existing_carrier: data.has_existing_carrier || null,
    carrier_name: data.carrier_name || null,
    form_step: 4,
    is_complete: true,
  }

  let applicant: Applicant

  if (existingApplicantId) {
    applicant = await updateApplicant(existingApplicantId, applicantData)
  } else {
    const result = await upsertApplicant(applicantData)
    applicant = result.applicant
  }

  return { applicantId: applicant.id, isPrequalified }
}

function getDisqualificationReason(data: ApplicationData): string {
  const reasons: string[] = []
  if (!data.has_cdl) reasons.push('No CDL')
  if (!data.has_medical_card) reasons.push('No medical card')
  if ((data.experience_months || 0) < 12) reasons.push('Less than 12 months experience')
  if (!data.us_work_eligible) reasons.push('Not eligible to work in US')
  return reasons.join(', ')
}

// ============================================
// Document Operations
// ============================================

/**
 * Add a document record
 */
export async function addDocument(data: DocumentInsert): Promise<Document> {
  const supabase = await createServerSupabaseClient()

  const { data: doc, error } = await supabase
    .from('documents')
    .insert(data)
    .select()
    .single()

  if (error) {
    console.error('Add document error:', error)
    throw new Error(`Failed to add document: ${error.message}`)
  }

  return doc
}

/**
 * Get documents for an applicant
 */
export async function getApplicantDocuments(applicantId: string): Promise<Document[]> {
  // Demo mode: return empty (no docs in demo)
  if (isDemoMode) {
    return []
  }

  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('applicant_id', applicantId)
    .order('uploaded_at', { ascending: false })

  if (error) {
    console.error('Get documents error:', error)
    return []
  }

  return data || []
}

// ============================================
// Activity Log Operations
// ============================================

/**
 * Log an admin activity
 */
export async function logActivity(data: ActivityLogInsert): Promise<void> {
  const supabase = await createServerSupabaseClient()

  const { error } = await supabase
    .from('activity_log')
    .insert(data)

  if (error) {
    console.error('Log activity error:', error)
    // Don't throw - activity logging shouldn't break the main flow
  }
}

/**
 * Get activity log for an applicant
 */
export async function getApplicantActivityLog(applicantId: string): Promise<Array<{
  id: string
  action: string
  details: Record<string, unknown> | null
  created_at: string
  admin_name?: string
}>> {
  // Demo mode: return sample activity
  if (isDemoMode) {
    return [
      {
        id: 'act-1',
        action: 'Application submitted',
        details: null,
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        admin_name: undefined,
      },
      {
        id: 'act-2',
        action: 'Status changed to In Progress',
        details: { from: 'new', to: 'in_progress' },
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        admin_name: 'Demo Admin',
      },
    ]
  }

  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('activity_log')
    .select(`
      id,
      action,
      details,
      created_at,
      admin_users (
        name
      )
    `)
    .eq('applicant_id', applicantId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Get activity log error:', error)
    return []
  }

  return (data || []).map(item => ({
    id: item.id,
    action: item.action,
    details: item.details,
    created_at: item.created_at,
    admin_name: (item.admin_users as { name?: string })?.name,
  }))
}

// ============================================
// Referral Operations
// ============================================

/**
 * Create a referral relationship
 */
export async function createReferral(
  referrerId: string,
  referredId: string,
  relationship?: string
): Promise<void> {
  const supabase = await createServerSupabaseClient()

  const { error } = await supabase
    .from('referrals')
    .insert({
      referrer_id: referrerId,
      referred_id: referredId,
      relationship: relationship || null,
      status: 'pending',
    })

  if (error) {
    console.error('Create referral error:', error)
    throw new Error(`Failed to create referral: ${error.message}`)
  }
}

// ============================================
// Storage Operations
// ============================================

/**
 * Upload a file to Supabase Storage
 */
export async function uploadFile(
  bucket: string,
  path: string,
  file: File
): Promise<string> {
  const supabase = await createServerSupabaseClient()

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      upsert: true,
    })

  if (error) {
    console.error('Upload file error:', error)
    throw new Error(`Failed to upload file: ${error.message}`)
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)

  return publicUrl
}

/**
 * Get a signed URL for private file access
 */
export async function getSignedUrl(
  bucket: string,
  path: string,
  expiresIn = 3600
): Promise<string> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn)

  if (error) {
    console.error('Get signed URL error:', error)
    throw new Error(`Failed to get signed URL: ${error.message}`)
  }

  return data.signedUrl
}
