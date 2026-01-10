import { NextRequest, NextResponse } from 'next/server'
import { upsertContact, addTags, isGHLConfigured } from '@/lib/ghl'

export async function POST(request: NextRequest) {
  try {
    if (!isGHLConfigured()) {
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

    // Create or update referrer contact
    const { contact: referrerContact } = await upsertContact({
      firstName: referrerFirstName,
      lastName: referrerLastName,
      email: referrer_email,
      phone: referrer_phone,
      tags: ['referrer', 'source_website'],
      customFields: {
        is_referrer: true,
      },
    })

    // Create referred driver contact
    const { contact: driverContact } = await upsertContact({
      firstName: driverFirstName,
      lastName: driverLastName,
      email: driver_email || '',
      phone: driver_phone,
      tags: ['referred_driver', 'source_referral', `referred_by_${referrerContact.id}`],
      customFields: {
        referred_by_name: referrer_name,
        referred_by_email: referrer_email,
        referred_by_contact_id: referrerContact.id,
        referral_relationship: relationship,
        referral_status: 'pending',
      },
    })

    // Update referrer with referral count tag
    await addTags(referrerContact.id, [`has_referral_${driverContact.id}`])

    return NextResponse.json({
      success: true,
      message: 'Referral submitted successfully',
      data: {
        referrer_id: referrerContact.id,
        driver_id: driverContact.id,
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
