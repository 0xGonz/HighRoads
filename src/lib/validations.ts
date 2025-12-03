import { z } from 'zod'

// Phone number regex - accepts various formats
const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/

// Step 1: Contact Information
export const contactSchema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(phoneRegex, 'Please enter a valid phone number'),
})

// Step 2: Pre-Qualification
export const qualificationSchema = z.object({
  has_cdl: z.boolean(),
  has_medical_card: z.boolean(),
  experience_months: z.number().min(0, 'Experience must be 0 or more'),
  location_state: z.string().min(2, 'Please select your state'),
  us_work_eligible: z.boolean(),
})

// Step 3: Preferences
export const preferencesSchema = z.object({
  weekly_payment_budget: z.string().min(1, 'Please select a payment range'),
  truck_preference: z.string().min(1, 'Please select a truck preference'),
  freight_preference: z.string().min(1, 'Please select a freight preference'),
  has_existing_carrier: z.boolean(),
  carrier_name: z.string().optional(),
})

// Full application schema
export const applicationSchema = contactSchema
  .merge(qualificationSchema)
  .merge(preferencesSchema)

export type ContactFormData = z.infer<typeof contactSchema>
export type QualificationFormData = z.infer<typeof qualificationSchema>
export type PreferencesFormData = z.infer<typeof preferencesSchema>
export type ApplicationFormData = z.infer<typeof applicationSchema>

// Pre-qualification check
export function checkPrequalification(data: QualificationFormData): {
  qualified: boolean
  reasons: string[]
} {
  const reasons: string[] = []

  if (!data.has_cdl) {
    reasons.push('A valid CDL is required')
  }
  if (!data.has_medical_card) {
    reasons.push('A current DOT medical card is required')
  }
  if (data.experience_months < 12) {
    reasons.push('At least 12 months of driving experience is required')
  }
  if (!data.us_work_eligible) {
    reasons.push('Must be eligible to work in the United States')
  }

  return {
    qualified: reasons.length === 0,
    reasons,
  }
}

// US States list
export const US_STATES = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
]

export const PAYMENT_RANGES = [
  { value: '400-500', label: '$400 - $500 per week' },
  { value: '500-600', label: '$500 - $600 per week' },
  { value: '600-700', label: '$600 - $700 per week' },
  { value: '700-800', label: '$700 - $800 per week' },
  { value: '800+', label: '$800+ per week' },
]

export const TRUCK_PREFERENCES = [
  { value: 'sleeper', label: 'Sleeper Cab' },
  { value: 'day-cab', label: 'Day Cab' },
  { value: 'no-preference', label: 'No Preference' },
]

export const FREIGHT_PREFERENCES = [
  { value: 'dry-van', label: 'Dry Van' },
  { value: 'flatbed', label: 'Flatbed' },
  { value: 'reefer', label: 'Refrigerated' },
  { value: 'tanker', label: 'Tanker' },
  { value: 'no-preference', label: 'No Preference' },
]
