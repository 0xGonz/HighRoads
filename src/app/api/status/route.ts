import { NextRequest, NextResponse } from 'next/server'
import { findApplicantByEmail, isDBConfigured } from '@/lib/db'
import type { ApplicantStatus } from '@/types/database'

// Status mapping from database status to user-friendly status
const STATUS_MAP: Record<ApplicantStatus, { status: string; description: string; step: number }> = {
  new: {
    status: 'Application Received',
    description: 'We have received your application and it is in our queue for review.',
    step: 1,
  },
  in_progress: {
    status: 'Under Review',
    description: 'Our team is currently reviewing your application and qualifications.',
    step: 2,
  },
  carrier_app: {
    status: 'Carrier Application',
    description: 'Your application has been submitted to carrier partners for review.',
    step: 3,
  },
  pending: {
    status: 'Pending Approval',
    description: 'Your application is pending final approval. We will contact you shortly.',
    step: 4,
  },
  complete: {
    status: 'Approved',
    description: 'Congratulations! Your application has been approved. Welcome to the High Road family!',
    step: 5,
  },
  disqualified: {
    status: 'Not Qualified',
    description: 'Unfortunately, you do not currently meet our requirements. Please contact us for more information.',
    step: 0,
  },
}

export async function POST(request: NextRequest) {
  try {
    if (!isDBConfigured()) {
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

    // Find applicant by email
    const applicant = await findApplicantByEmail(email)

    if (!applicant) {
      return NextResponse.json(
        { error: 'NOT_FOUND', message: 'No application found with this email address' },
        { status: 404 }
      )
    }

    // Verify phone number (last 4 digits)
    const applicantPhoneDigits = applicant.phone?.replace(/\D/g, '').slice(-4)
    if (applicantPhoneDigits !== phone_last4) {
      return NextResponse.json(
        { error: 'VERIFICATION_FAILED', message: 'Phone verification failed. Please check your information.' },
        { status: 401 }
      )
    }

    // Get status info
    const statusInfo = STATUS_MAP[applicant.status] || STATUS_MAP.new

    return NextResponse.json({
      success: true,
      data: {
        firstName: applicant.first_name,
        ...statusInfo,
        isPrequalified: applicant.is_prequalified,
        appliedAt: applicant.created_at,
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
