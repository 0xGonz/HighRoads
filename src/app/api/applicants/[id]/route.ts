import { NextRequest, NextResponse } from 'next/server'
import { findApplicantById, updateApplicant, updateApplicantStatus } from '@/lib/db'
import type { ApplicantStatus, ApplicantUpdate } from '@/types/database'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

/**
 * GET /api/applicants/[id]
 * Get a single applicant by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const applicant = await findApplicantById(id)

    if (!applicant) {
      return NextResponse.json(
        { error: 'NOT_FOUND', message: 'Applicant not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: applicant,
    })
  } catch (error) {
    console.error('Error fetching applicant:', error)
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: 'Failed to fetch applicant' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/applicants/[id]
 * Update an applicant
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Check if this is a status-only update
    if (body.status && Object.keys(body).length === 1) {
      const validStatuses: ApplicantStatus[] = ['new', 'in_progress', 'carrier_app', 'pending', 'complete', 'disqualified']
      if (!validStatuses.includes(body.status)) {
        return NextResponse.json(
          { error: 'VALIDATION_ERROR', message: 'Invalid status' },
          { status: 400 }
        )
      }

      const applicant = await updateApplicantStatus(id, body.status)
      return NextResponse.json({
        success: true,
        data: applicant,
      })
    }

    // Full update
    const updateData: ApplicantUpdate = {}

    // Only include fields that are provided
    if (body.first_name !== undefined) updateData.first_name = body.first_name
    if (body.last_name !== undefined) updateData.last_name = body.last_name
    if (body.email !== undefined) updateData.email = body.email
    if (body.phone !== undefined) updateData.phone = body.phone
    if (body.sms_opt_in !== undefined) updateData.sms_opt_in = body.sms_opt_in
    if (body.status !== undefined) updateData.status = body.status
    if (body.notes !== undefined) updateData.notes = body.notes
    if (body.assigned_to !== undefined) updateData.assigned_to = body.assigned_to
    if (body.ownership_goal !== undefined) updateData.ownership_goal = body.ownership_goal
    if (body.truck_preference !== undefined) updateData.truck_preference = body.truck_preference
    if (body.freight_preference !== undefined) updateData.freight_preference = body.freight_preference
    if (body.has_existing_carrier !== undefined) updateData.has_existing_carrier = body.has_existing_carrier
    if (body.carrier_name !== undefined) updateData.carrier_name = body.carrier_name

    const applicant = await updateApplicant(id, updateData)

    return NextResponse.json({
      success: true,
      data: applicant,
    })
  } catch (error) {
    console.error('Error updating applicant:', error)
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: 'Failed to update applicant' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/applicants/[id]
 * Soft delete an applicant (set status to disqualified)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Soft delete by setting status to disqualified
    const applicant = await updateApplicantStatus(id, 'disqualified')

    return NextResponse.json({
      success: true,
      message: 'Applicant marked as disqualified',
      data: applicant,
    })
  } catch (error) {
    console.error('Error deleting applicant:', error)
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: 'Failed to delete applicant' },
      { status: 500 }
    )
  }
}
