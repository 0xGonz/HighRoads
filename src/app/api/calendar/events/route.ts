import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { isDemoMode, mockCalendarEvents, mockApplicants } from '@/lib/demo-data'

/**
 * GET /api/calendar/events
 * List calendar events
 */
export async function GET(request: NextRequest) {
  try {
    // Demo mode: return mock events
    if (isDemoMode) {
      const searchParams = request.nextUrl.searchParams
      const applicantId = searchParams.get('applicantId')

      let events = [...mockCalendarEvents]
      if (applicantId) {
        events = events.filter(e => e.applicant_id === applicantId)
      }

      // Enrich with applicant data
      const enriched = events.map(e => ({
        ...e,
        applicants: e.applicant_id
          ? mockApplicants.find(a => a.id === e.applicant_id) || null
          : null,
      }))

      return NextResponse.json({ events: enriched })
    }

    const supabase = await createServerSupabaseClient()

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const applicantId = searchParams.get('applicantId')

    // Build query
    let query = supabase
      .from('calendar_events')
      .select(`
        *,
        applicants (
          id,
          first_name,
          last_name,
          phone,
          email
        )
      `)
      .eq('admin_user_id', user.id)
      .order('starts_at', { ascending: true })

    if (startDate) {
      query = query.gte('starts_at', startDate)
    }

    if (endDate) {
      query = query.lte('starts_at', endDate)
    }

    if (applicantId) {
      query = query.eq('applicant_id', applicantId)
    }

    const { data, error } = await query

    if (error) {
      console.error('Get calendar events error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ events: data || [] })
  } catch (error) {
    console.error('Calendar events API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/calendar/events
 * Create a new calendar event
 */
export async function POST(request: NextRequest) {
  try {
    // Demo mode: return fake created event
    if (isDemoMode) {
      const body = await request.json()
      const event = {
        id: `evt-demo-${Date.now()}`,
        admin_user_id: 'demo-admin',
        ...body,
        status: 'scheduled',
        created_at: new Date().toISOString(),
      }
      return NextResponse.json({ event }, { status: 201 })
    }

    const supabase = await createServerSupabaseClient()

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      title,
      description,
      event_type,
      starts_at,
      ends_at,
      applicant_id,
      phone_number,
      meeting_link,
      notes,
    } = body

    if (!title || !event_type || !starts_at || !ends_at) {
      return NextResponse.json(
        { error: 'title, event_type, starts_at, and ends_at are required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('calendar_events')
      .insert({
        admin_user_id: user.id,
        title,
        description: description || notes || null,
        event_type,
        starts_at,
        ends_at,
        applicant_id: applicant_id || null,
        phone_number: phone_number || null,
        meeting_link: meeting_link || null,
        status: 'scheduled',
      })
      .select()
      .single()

    if (error) {
      console.error('Create calendar event error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ event: data }, { status: 201 })
  } catch (error) {
    console.error('Create calendar event error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
