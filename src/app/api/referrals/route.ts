import { NextRequest, NextResponse } from 'next/server'
import { upsertApplicant, createReferral, isDBConfigured } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    if (!isDBConfigured()) {
      return NextResponse.json(
        { error: 'SERVICE_NOT_CONFIGURED', message: 'Referral system is temporarily unavailable' },
        { status: 503 }
      )
    }

    const body = await request.json()
    const {
      referrer_name,
      referrer_email,
      referrer_phone,
      driver_name,
      driver_phone,
      driver_email,
      relationship,
    } = body

    // Validate required fields
    if (!referrer_name || !referrer_email || !referrer_phone || !driver_name || !driver_phone || !relationship) {
      return NextResponse.json(
        { error: 'VALIDATION_ERROR', message: 'Please fill out all required fields' },
        { status: 400 }
      )
    }

    // Parse names
    const referrerNameParts = referrer_name.trim().split(' ')
    const referrerFirstName = referrerNameParts[0]
    const referrerLastName = referrerNameParts.slice(1).join(' ') || ''

    const driverNameParts = driver_name.trim().split(' ')
    const driverFirstName = driverNameParts[0]
    const driverLastName = driverNameParts.slice(1).join(' ') || ''

    // Create or update referrer applicant
    const { applicant: referrer } = await upsertApplicant({
      first_name: referrerFirstName,
      last_name: referrerLastName,
      email: referrer_email.toLowerCase(),
      phone: referrer_phone,
      lead_source: 'referral_program',
    })

    // Create referred driver applicant
    const { applicant: driver } = await upsertApplicant({
      first_name: driverFirstName,
      last_name: driverLastName,
      email: driver_email?.toLowerCase() || `${driver_phone.replace(/\D/g, '')}@pending.highroadcapital.com`,
      phone: driver_phone,
      lead_source: 'referral',
      referral_code: referrer.id,
    })

    // Create referral relationship
    await createReferral(referrer.id, driver.id, relationship)

    return NextResponse.json({
      success: true,
      message: 'Referral submitted successfully',
      data: {
        referrer_id: referrer.id,
        driver_id: driver.id,
      },
    })
  } catch (error) {
    console.error('Referral submission error:', error)
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: 'An error occurred while submitting your referral' },
      { status: 500 }
    )
  }
}
