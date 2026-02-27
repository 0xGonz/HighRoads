import { NextRequest, NextResponse } from 'next/server'
import { submitCompleteApplication, submitPartialApplication, isDBConfigured, listApplicants } from '@/lib/db'
import { applicationSchema, checkPrequalification } from '@/lib/validations'
import { isDemoMode } from '@/lib/demo-data'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Error codes for frontend to handle
const ErrorCodes = {
  SERVICE_NOT_CONFIGURED: 'SERVICE_NOT_CONFIGURED',
  DATABASE_ERROR: 'DATABASE_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const

/**
 * POST /api/applicants
 * Submit a complete or partial application
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

    // Demo mode: simulate successful submission
    if (isDemoMode) {
      const demoApplicantId = `demo-${Date.now()}`
      console.log('Demo mode: Simulating application submission for', data.email)
      return NextResponse.json(
        {
          success: true,
          message: 'Application submitted successfully (Demo Mode)',
          applicant_id: demoApplicantId,
          is_prequalified: prequalResult.qualified,
          demo_mode: true,
        },
        { status: 201 }
      )
    }

    // Check if database is configured - CRITICAL: Do not allow submission without backend
    if (!isDBConfigured()) {
      console.error('CRITICAL: Database not configured - rejecting application submission')
      return NextResponse.json(
        {
          success: false,
          error: ErrorCodes.SERVICE_NOT_CONFIGURED,
          message: 'We are experiencing technical difficulties. Please try again later or contact us directly.',
        },
        { status: 503 }
      )
    }

    // Submit to database
    const { applicantId, isPrequalified } = await submitCompleteApplication({
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      phone: data.phone,
      sms_opt_in: data.sms_opt_in,
      lead_source: data.lead_source,
      referral_code: data.referral_code,
      has_cdl: data.has_cdl,
      has_medical_card: data.has_medical_card,
      experience_months: data.experience_months,
      location_state: data.location_state,
      us_work_eligible: data.us_work_eligible,
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
        applicant_id: applicantId,
        is_prequalified: isPrequalified,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error processing application:', error)

    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    return NextResponse.json(
      {
        success: false,
        error: ErrorCodes.DATABASE_ERROR,
        message: 'Unable to process your application right now. Please try again in a few minutes.',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      },
      { status: 500 }
    )
  }
}

/**
 * Handle partial form submissions for abandoned form tracking
 * Note: Partial tracking failures should NOT block user experience
 */
async function handlePartialSubmission(body: {
  step: number
  first_name: string
  last_name: string
  email: string
  phone: string
  applicantId?: string
}) {
  try {
    // Partial tracking is optional - don't block user if not configured
    if (!isDBConfigured()) {
      return NextResponse.json(
        {
          success: false,
          tracked: false,
          warning: 'Tracking unavailable - database not configured',
          step: body.step,
        },
        { status: 200 }
      )
    }

    const { applicantId } = await submitPartialApplication(
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
        applicant_id: applicantId,
        step: body.step,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error tracking partial submission:', error)
    // Don't fail the user experience for partial tracking errors
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
 * List applicants with filtering and pagination (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status') as 'new' | 'in_progress' | 'carrier_app' | 'pending' | 'complete' | 'disqualified' | null
    const search = searchParams.get('search') || undefined
    const isPrequalified = searchParams.get('prequalified') === 'true' ? true :
                          searchParams.get('prequalified') === 'false' ? false : undefined

    const { applicants, total } = await listApplicants({
      page,
      limit,
      status: status || undefined,
      search,
      isPrequalified,
    })

    return NextResponse.json({
      success: true,
      data: applicants,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error listing applicants:', error)
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: 'Failed to list applicants' },
      { status: 500 }
    )
  }
}
