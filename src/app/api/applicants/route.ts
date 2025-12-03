import { NextRequest, NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { sendApplicantConfirmationEmail, sendAdminNotificationEmail } from '@/lib/email'
import { sendApplicantConfirmationSms, sendAdminNotificationSms, formatPhoneForTwilio } from '@/lib/sms'
import { applicationSchema, checkPrequalification } from '@/lib/validations'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate the request body
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

    // Format phone for SMS
    const formattedPhone = formatPhoneForTwilio(data.phone)

    // Insert into database
    const supabase = getServiceSupabase()
    const { data: applicant, error: dbError } = await supabase
      .from('applicants')
      .insert({
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
        disqualification_reason: prequalResult.qualified ? null : prequalResult.reasons.join('; '),
        status: 'new',
        weekly_payment_budget: data.weekly_payment_budget,
        truck_preference: data.truck_preference,
        freight_preference: data.freight_preference,
        has_existing_carrier: data.has_existing_carrier,
        carrier_name: data.carrier_name || null,
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { error: 'Failed to save application' },
        { status: 500 }
      )
    }

    // Send notifications (don't fail the request if these fail)
    const emailData = {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      phone: data.phone,
    }

    // Send notifications in parallel
    await Promise.allSettled([
      sendApplicantConfirmationEmail(emailData),
      sendAdminNotificationEmail(emailData),
      sendApplicantConfirmationSms({ first_name: data.first_name, phone: formattedPhone }),
      sendAdminNotificationSms({ first_name: data.first_name, last_name: data.last_name, phone: data.phone }),
    ])

    return NextResponse.json(
      {
        success: true,
        message: 'Application submitted successfully',
        applicant_id: applicant.id,
        is_prequalified: prequalResult.qualified,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error processing application:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const supabase = getServiceSupabase()
    let query = supabase
      .from('applicants')
      .select('*')
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    const { data: applicants, error } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch applicants' },
        { status: 500 }
      )
    }

    return NextResponse.json({ applicants })
  } catch (error) {
    console.error('Error fetching applicants:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
