import { NextRequest, NextResponse } from 'next/server'
import { submitCompleteApplication, submitPartialApplication, isGHLConfigured } from '@/lib/ghl'
import { applicationSchema, checkPrequalification } from '@/lib/validations'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

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
        { error: 'Validation failed', details: validationResult.error.errors },
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

    // Check if GHL is configured
    if (!isGHLConfigured()) {
      console.warn('GHL not configured - application will not be saved to CRM')
      // Still return success for testing purposes
      return NextResponse.json(
        {
          success: true,
          message: 'Application received (GHL not configured)',
          is_prequalified: prequalResult.qualified,
          warning: 'GoHighLevel is not configured. Application was not saved to CRM.',
        },
        { status: 201 }
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
      weekly_payment_budget: data.weekly_payment_budget,
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
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

/**
 * Handle partial form submissions for abandoned form tracking
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
    if (!isGHLConfigured()) {
      return NextResponse.json(
        {
          success: true,
          message: 'Partial submission received (GHL not configured)',
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
        message: 'Partial submission tracked',
        contact_id: contactId,
        step: body.step,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error tracking partial submission:', error)
    // Don't fail the user experience for partial tracking errors
    return NextResponse.json(
      {
        success: true,
        message: 'Partial submission received (tracking error)',
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
