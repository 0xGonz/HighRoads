import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { sendSimpleEmail } from '@/lib/email'

interface RouteParams {
  params: Promise<{ adminId: string }>
}

/**
 * POST /api/book/[adminId]/confirm
 * Confirm a booking
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { adminId } = await params
    const supabase = await createServerSupabaseClient()

    const body = await request.json()
    const { date, time, name, email, phone, applicantId, notes } = body

    if (!date || !time) {
      return NextResponse.json(
        { error: 'date and time are required' },
        { status: 400 }
      )
    }

    if (!name || !email) {
      return NextResponse.json(
        { error: 'name and email are required' },
        { status: 400 }
      )
    }

    // Get admin info
    const { data: admin } = await supabase
      .from('admin_users')
      .select('id, name, email')
      .eq('id', adminId)
      .single()

    if (!admin) {
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 404 }
      )
    }

    // Calculate start and end times
    const [hour, minute] = time.split(':').map(Number)
    const startsAt = new Date(date)
    startsAt.setHours(hour, minute, 0, 0)
    const endsAt = new Date(startsAt)
    endsAt.setMinutes(endsAt.getMinutes() + 30)

    // Check for conflicts
    const { data: conflicts } = await supabase
      .from('calendar_events')
      .select('id')
      .eq('admin_user_id', adminId)
      .lt('starts_at', endsAt.toISOString())
      .gt('ends_at', startsAt.toISOString())
      .neq('status', 'cancelled')
      .limit(1)

    if (conflicts && conflicts.length > 0) {
      return NextResponse.json(
        { error: 'This time slot is no longer available' },
        { status: 409 }
      )
    }

    // Create the calendar event
    const { data: event, error: eventError } = await supabase
      .from('calendar_events')
      .insert({
        admin_user_id: adminId,
        applicant_id: applicantId || null,
        title: `Call with ${name}`,
        description: notes || null,
        event_type: 'call',
        starts_at: startsAt.toISOString(),
        ends_at: endsAt.toISOString(),
        status: 'scheduled',
        phone_number: phone || null,
      })
      .select()
      .single()

    if (eventError) {
      console.error('Create event error:', eventError)
      return NextResponse.json(
        { error: 'Failed to create booking' },
        { status: 500 }
      )
    }

    // Send confirmation email to booker
    const formattedDate = startsAt.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    const formattedTime = startsAt.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })

    try {
      await sendSimpleEmail({
        to: email,
        subject: 'Your Call is Scheduled - High Road Capital',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1e3a5f;">Your Call is Confirmed!</h2>
            <p>Hi ${name},</p>
            <p>Your call with High Road Capital has been scheduled.</p>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0 0 10px 0;"><strong>Date:</strong> ${formattedDate}</p>
              <p style="margin: 0 0 10px 0;"><strong>Time:</strong> ${formattedTime}</p>
              <p style="margin: 0;"><strong>Duration:</strong> 30 minutes</p>
            </div>
            <p>We'll call you at the phone number you provided. Please make sure you're available at the scheduled time.</p>
            <p>If you need to reschedule, please reply to this email.</p>
            <p>Best regards,<br>High Road Capital Team</p>
          </div>
        `,
      })
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError)
    }

    // Notify admin
    try {
      await supabase.from('admin_notifications').insert({
        admin_user_id: adminId,
        type: 'new_booking',
        title: 'New Call Booked',
        body: `${name} booked a call for ${formattedDate} at ${formattedTime}`,
        link: '/admin/calendar',
      })
    } catch (notifyError) {
      console.error('Failed to create notification:', notifyError)
    }

    return NextResponse.json({
      success: true,
      event: {
        id: event.id,
        startsAt: event.starts_at,
        endsAt: event.ends_at,
      },
    })
  } catch (error) {
    console.error('Confirm booking error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
