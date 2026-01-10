import { NextRequest, NextResponse } from 'next/server'
import { findContactByEmail, isGHLConfigured } from '@/lib/ghl'

// Status mapping from GHL tags to user-friendly status
const STATUS_MAP: Record<string, { status: string; description: string; step: number }> = {
  new_application: {
    status: 'Application Received',
    description: 'We have received your application and it is in our queue for review.',
    step: 1,
  },
  in_review: {
    status: 'Under Review',
    description: 'Our team is currently reviewing your application and qualifications.',
    step: 2,
  },
  documents_needed: {
    status: 'Documents Needed',
    description: 'We need additional documents to process your application. Check your email for details.',
    step: 2,
  },
  documents_received: {
    status: 'Documents Received',
    description: 'We have received your documents and are processing them.',
    step: 3,
  },
  approved: {
    status: 'Approved',
    description: 'Congratulations! Your application has been approved. We will contact you shortly.',
    step: 4,
  },
  carrier_matching: {
    status: 'Carrier Matching',
    description: 'We are matching you with the best carrier partners for your preferences.',
    step: 4,
  },
  carrier_matched: {
    status: 'Carrier Matched',
    description: 'You have been matched with a carrier. Check your email for next steps.',
    step: 5,
  },
  active: {
    status: 'Active Driver',
    description: 'You are an active driver in our program. Welcome to the High Road family!',
    step: 5,
  },
  disqualified: {
    status: 'Not Qualified',
    description: 'Unfortunately, you do not currently meet our requirements. Please contact us for more information.',
    step: 0,
  },
}

function getStatusFromTags(tags: string[]): { status: string; description: string; step: number } {
  // Check tags in priority order (most specific first)
  const priorityOrder = [
    'active',
    'carrier_matched',
    'carrier_matching',
    'approved',
    'documents_received',
    'documents_needed',
    'in_review',
    'disqualified',
    'new_application',
  ]

  for (const tag of priorityOrder) {
    if (tags.includes(tag)) {
      return STATUS_MAP[tag]
    }
  }

  // Default status if no matching tags
  return {
    status: 'Pending',
    description: 'Your application is being processed.',
    step: 1,
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isGHLConfigured()) {
      return NextResponse.json(
        { error: 'SERVICE_NOT_CONFIGURED', message: 'Status lookup is temporarily unavailable' },
        { status: 503 }
      )
    }

    const body = await request.json()
    const { email, phone_last4 } = body

    if (!email || !phone_last4) {
      return NextResponse.json(
        { error: 'VALIDATION_ERROR', message: 'Email and phone verification required' },
        { status: 400 }
      )
    }

    // Find contact by email
    const contact = await findContactByEmail(email)

    if (!contact) {
      return NextResponse.json(
        { error: 'NOT_FOUND', message: 'No application found with this email address' },
        { status: 404 }
      )
    }

    // Verify phone number (last 4 digits)
    const contactPhoneDigits = contact.phone?.replace(/\D/g, '').slice(-4)
    if (contactPhoneDigits !== phone_last4) {
      return NextResponse.json(
        { error: 'VERIFICATION_FAILED', message: 'Phone verification failed. Please check your information.' },
        { status: 401 }
      )
    }

    // Get status from tags
    const statusInfo = getStatusFromTags(contact.tags || [])

    // Get additional info from custom fields
    const customFields = contact.customFields || {}
    const isPrequalified = customFields.is_prequalified as boolean | undefined

    return NextResponse.json({
      success: true,
      data: {
        firstName: contact.firstName,
        ...statusInfo,
        isPrequalified,
        appliedAt: customFields.created_at || null,
      },
    })
  } catch (error) {
    console.error('Status lookup error:', error)
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: 'An error occurred while looking up your status' },
      { status: 500 }
    )
  }
}
