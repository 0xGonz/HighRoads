/**
 * GoHighLevel Integration Library
 * Handles contact creation, updates, tags, and pipeline management
 */

const GHL_API_BASE = 'https://services.leadconnectorhq.com'

interface GHLConfig {
  apiKey: string
  locationId: string
  pipelineId?: string
  pipelineStageNew?: string
}

function getConfig(): GHLConfig {
  const apiKey = process.env.GHL_API_KEY
  const locationId = process.env.GHL_LOCATION_ID

  if (!apiKey || !locationId) {
    throw new Error('GHL_API_KEY and GHL_LOCATION_ID must be configured in environment variables')
  }

  return {
    apiKey,
    locationId,
    pipelineId: process.env.GHL_PIPELINE_ID,
    pipelineStageNew: process.env.GHL_PIPELINE_STAGE_NEW,
  }
}

interface GHLContactData {
  firstName: string
  lastName: string
  email: string
  phone: string
  tags?: string[]
  customFields?: Record<string, unknown>
}

interface GHLContact {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  tags: string[]
  customFields: Record<string, unknown>
}

/**
 * Create or update a contact in GHL
 */
export async function upsertContact(data: GHLContactData): Promise<{ contact: GHLContact; isNew: boolean }> {
  const config = getConfig()

  // First, try to find existing contact by email
  const existingContact = await findContactByEmail(data.email)

  if (existingContact) {
    // Update existing contact
    const updated = await updateContact(existingContact.id, data)
    return { contact: updated, isNew: false }
  }

  // Create new contact
  const response = await fetch(`${GHL_API_BASE}/contacts/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
      'Version': '2021-07-28',
    },
    body: JSON.stringify({
      locationId: config.locationId,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      tags: data.tags || [],
      customFields: data.customFields ? formatCustomFields(data.customFields) : [],
      source: 'Website Application',
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    console.error('GHL create contact error:', error)
    throw new Error(`Failed to create contact in GHL: ${error}`)
  }

  const result = await response.json()
  return { contact: result.contact, isNew: true }
}

/**
 * Find a contact by email
 */
export async function findContactByEmail(email: string): Promise<GHLContact | null> {
  const config = getConfig()

  const response = await fetch(
    `${GHL_API_BASE}/contacts/search/duplicate?locationId=${config.locationId}&email=${encodeURIComponent(email)}`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Version': '2021-07-28',
      },
    }
  )

  if (!response.ok) {
    return null
  }

  const result = await response.json()
  return result.contact || null
}

/**
 * Update an existing contact
 */
export async function updateContact(contactId: string, data: Partial<GHLContactData>): Promise<GHLContact> {
  const config = getConfig()

  const updateBody: Record<string, unknown> = {}

  if (data.firstName) updateBody.firstName = data.firstName
  if (data.lastName) updateBody.lastName = data.lastName
  if (data.email) updateBody.email = data.email
  if (data.phone) updateBody.phone = data.phone
  if (data.customFields) updateBody.customFields = formatCustomFields(data.customFields)

  const response = await fetch(`${GHL_API_BASE}/contacts/${contactId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
      'Version': '2021-07-28',
    },
    body: JSON.stringify(updateBody),
  })

  if (!response.ok) {
    const error = await response.text()
    console.error('GHL update contact error:', error)
    throw new Error(`Failed to update contact in GHL: ${error}`)
  }

  const result = await response.json()
  return result.contact
}

/**
 * Add tags to a contact
 */
export async function addTags(contactId: string, tags: string[]): Promise<void> {
  const config = getConfig()

  const response = await fetch(`${GHL_API_BASE}/contacts/${contactId}/tags`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
      'Version': '2021-07-28',
    },
    body: JSON.stringify({ tags }),
  })

  if (!response.ok) {
    const error = await response.text()
    console.error('GHL add tags error:', error)
    throw new Error(`Failed to add tags in GHL: ${error}`)
  }
}

/**
 * Remove tags from a contact
 */
export async function removeTags(contactId: string, tags: string[]): Promise<void> {
  const config = getConfig()

  const response = await fetch(`${GHL_API_BASE}/contacts/${contactId}/tags`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
      'Version': '2021-07-28',
    },
    body: JSON.stringify({ tags }),
  })

  if (!response.ok) {
    const error = await response.text()
    console.error('GHL remove tags error:', error)
    // Don't throw - tag removal failure shouldn't break the flow
  }
}

/**
 * Create an opportunity (pipeline entry) for a contact
 */
export async function createOpportunity(
  contactId: string,
  name: string,
  status: 'open' | 'won' | 'lost' | 'abandoned' = 'open'
): Promise<void> {
  const config = getConfig()

  if (!config.pipelineId || !config.pipelineStageNew) {
    console.warn('Pipeline not configured - skipping opportunity creation')
    return
  }

  const response = await fetch(`${GHL_API_BASE}/opportunities/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
      'Version': '2021-07-28',
    },
    body: JSON.stringify({
      locationId: config.locationId,
      contactId,
      pipelineId: config.pipelineId,
      pipelineStageId: config.pipelineStageNew,
      name,
      status,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    console.error('GHL create opportunity error:', error)
    // Don't throw - opportunity creation failure shouldn't break the flow
  }
}

/**
 * Format custom fields for GHL API
 * GHL expects: [{ key: "field_key", value: "field_value" }]
 */
function formatCustomFields(fields: Record<string, unknown>): Array<{ key: string; field_value: unknown }> {
  return Object.entries(fields).map(([key, value]) => ({
    key,
    field_value: value,
  }))
}

/**
 * Push form data to GHL webhook (alternative to API)
 */
export async function pushToWebhook(data: Record<string, unknown>): Promise<void> {
  const webhookUrl = process.env.GHL_WEBHOOK_URL

  if (!webhookUrl) {
    console.warn('GHL_WEBHOOK_URL not configured - skipping webhook push')
    return
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.text()
    console.error('GHL webhook error:', error)
    throw new Error(`Failed to push to GHL webhook: ${error}`)
  }
}

// ============================================
// High-level functions for application flow
// ============================================

interface ApplicationData {
  first_name: string
  last_name: string
  email: string
  phone: string
  has_cdl?: boolean
  has_medical_card?: boolean
  experience_months?: number
  location_state?: string
  us_work_eligible?: boolean
  is_prequalified?: boolean
  weekly_payment_budget?: string
  truck_preference?: string
  freight_preference?: string
  has_existing_carrier?: boolean
  carrier_name?: string
}

/**
 * Submit partial form data (for abandoned form tracking)
 */
export async function submitPartialApplication(
  data: Pick<ApplicationData, 'first_name' | 'last_name' | 'email' | 'phone'>,
  step: number
): Promise<{ contactId: string }> {
  const { contact } = await upsertContact({
    firstName: data.first_name,
    lastName: data.last_name,
    email: data.email,
    phone: data.phone,
    tags: ['incomplete_form', 'source_website', `form_step_${step}`],
    customFields: {
      form_step: step,
    },
  })

  return { contactId: contact.id }
}

/**
 * Submit complete application
 */
export async function submitCompleteApplication(
  data: ApplicationData,
  contactId?: string
): Promise<{ contactId: string; isPrequalified: boolean }> {
  const isPrequalified = Boolean(
    data.has_cdl &&
    data.has_medical_card &&
    (data.experience_months || 0) >= 12 &&
    data.us_work_eligible
  )

  const tags = [
    'new_application',
    'source_website',
    isPrequalified ? 'prequalified' : 'disqualified',
  ]

  const customFields: Record<string, unknown> = {
    has_cdl: data.has_cdl,
    has_medical_card: data.has_medical_card,
    experience_months: data.experience_months,
    location_state: data.location_state,
    us_work_eligible: data.us_work_eligible,
    is_prequalified: isPrequalified,
    weekly_payment_budget: data.weekly_payment_budget,
    truck_preference: data.truck_preference,
    freight_preference: data.freight_preference,
    has_existing_carrier: data.has_existing_carrier,
    carrier_name: data.carrier_name,
    form_step: 4, // Complete
  }

  const { contact, isNew } = await upsertContact({
    firstName: data.first_name,
    lastName: data.last_name,
    email: data.email,
    phone: data.phone,
    tags,
    customFields,
  })

  // If contact existed (was partial), remove incomplete tag and add completion tags
  if (!isNew && contactId) {
    await removeTags(contact.id, ['incomplete_form', 'form_step_1', 'form_step_2', 'form_step_3'])
    await addTags(contact.id, tags)
  }

  // Create pipeline opportunity
  await createOpportunity(
    contact.id,
    `${data.first_name} ${data.last_name} - Application`,
    'open'
  )

  return { contactId: contact.id, isPrequalified }
}

/**
 * Check if GHL is configured
 */
export function isGHLConfigured(): boolean {
  return Boolean(process.env.GHL_API_KEY && process.env.GHL_LOCATION_ID)
}