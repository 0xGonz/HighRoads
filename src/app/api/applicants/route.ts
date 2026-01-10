import { NextRequest, NextResponse } from 'next/server'
import { submitCompleteApplication, submitPartialApplication, isGHLConfigured } from '@/lib/ghl'
import { applicationSchema, checkPrequalification } from '@/lib/validations'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Error codes for frontend to handle
const ErrorCodes = {
  SERVICE_NOT_CONFIGURED: 'SERVICE_NOT_CONFIGURED',
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const

/**
 * POST /api/applicants
 * Submit a complete or partial application to GoHighLevel
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Check if this is a partial submission (step tracking)
    if (body.partial && body.step) {
      return handlePartialSubmission(body)
    }

    // Full submission - validate the request body
    const validationResult = applicationSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: ErrorCodes.VALIDATION_ERROR,
          message: 'Please check your information and try again.',
          details: validationResult.error.errors,
        },
        { status: 400 }
      )
    }

    const data = validationResult.data

    // Check pre-qualification
    const prequalResult = checkPrequalification({
      has_cdl: data.has_cdl,
      has_medical_card: data.has_medical_card,
      experience_months: data.experience_months,
      location_state: data.location_state,
      us_work_eligible: data.us_work_eligible,
    })

    // Check if GHL is configured - CRITICAL: Do not allow submission without backend
    if (!isGHLConfigured()) {
      console.error('CRITICAL: GHL not configured - rejecting application submission')
      return NextResponse.json(
        {
          success: false,
          error: ErrorCodes.SERVICE_NOT_CONFIGURED,
          message: 'We are experiencing technical difficulties. Please try again later or contact us directly.',
        },
        { status: 503 }
      )
    }

    // Submit to GoHighLevel
    const { contactId, isPrequalified } = await submitCompleteApplication({
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      phone: data.phone,
      has_cdl: data.has_cdl,
      has_medical_card: data.has_medical_card,
      experience_months: data.experience_months,
      location_state: data.location_state,
      us_work_eligible: data.us_work_eligible,
      is_prequalified: prequalResult.qualified,
      ownership_goal: data.ownership_goal,
      truck_preference: data.truck_preference,
      freight_preference: data.freight_preference,
      has_existing_carrier: data.has_existing_carrier,
      carrier_name: data.carrier_name,
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Application submitted successfully',
        contact_id: contactId,
        is_prequalified: isPrequalified,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error processing application:', error)

    // Check if this is a GHL API error
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const isGHLError = errorMessage.includes('GHL') || errorMessage.includes('GoHighLevel')

    if (isGHLError) {
      return NextResponse.json(
        {
          success: false,
          error: ErrorCodes.EXTERNAL_SERVICE_ERROR,
          message: 'Unable to process your application right now. Please try again in a few minutes.',
        },
        { status: 502 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: ErrorCodes.INTERNAL_ERROR,
        message: 'Something went wrong. Please try again.',
      },
      { status: 500 }
    )
  }
}

/**
 * Handle partial form submissions for abandoned form tracking
 * Note: Partial tracking failures should NOT block user experience
 * but we should clearly indicate when tracking is unavailable
 */
async function handlePartialSubmission(body: {
  step: number
  first_name: string
  last_name: string
  email: string
  phone: string
  contactId?: string
}) {
  try {
    // Partial tracking is optional - don't block user if not configured
    if (!isGHLConfigured()) {
      return NextResponse.json(
        {
          success: false,
          tracked: false,
          warning: 'Tracking unavailable - CRM not configured',
          step: body.step,
        },
        { status: 200 }
      )
    }

    const { contactId } = await submitPartialApplication(
      {
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email,
        phone: body.phone,
      },
      body.step
    )

    return NextResponse.json(
      {
        success: true,
        tracked: true,
        contact_id: contactId,
        step: body.step,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error tracking partial submission:', error)
    // Don't fail the user experience for partial tracking errors
    // but indicate that tracking failed
    return NextResponse.json(
      {
        success: false,
        tracked: false,
        warning: 'Tracking failed - will retry on final submission',
        step: body.step,
      },
      { status: 200 }
    )
  }
}

/**
 * GET /api/applicants
 * Note: With GHL integration, applicant data is managed in GHL dashboard
 * This endpoint is kept for backwards compatibility but returns a redirect message
 */
export async function GET() {
  return NextResponse.json({
    message: 'Applicant management has moved to GoHighLevel',
    redirect: 'Please use the GHL dashboard to view and manage applicants',
    ghl_dashboard: 'https://app.gohighlevel.com',
  })
}
