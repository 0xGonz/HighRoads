import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/calendar/events/[id]
 * Get a specific calendar event
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createServerSupabaseClient()
    const { id } = await params

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
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
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Event not found' }, { status: 404 })
      }
      console.error('Get calendar event error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ event: data })
  } catch (error) {
    console.error('Calendar event API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/calendar/events/[id]
 * Update a calendar event
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createServerSupabaseClient()
    const { id } = await params

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
      status,
      phone_number,
      meeting_link,
      notes,
    } = body

    const updateData: Record<string, unknown> = {}
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (event_type !== undefined) updateData.event_type = event_type
    if (starts_at !== undefined) updateData.starts_at = starts_at
    if (ends_at !== undefined) updateData.ends_at = ends_at
    if (status !== undefined) updateData.status = status
    if (phone_number !== undefined) updateData.phone_number = phone_number
    if (meeting_link !== undefined) updateData.meeting_link = meeting_link
    if (notes !== undefined) updateData.notes = notes

    const { data, error } = await supabase
      .from('calendar_events')
      .update(updateData)
      .eq('id', id)
      .eq('admin_user_id', user.id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Event not found' }, { status: 404 })
      }
      console.error('Update calendar event error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ event: data })
  } catch (error) {
    console.error('Update calendar event error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/calendar/events/[id]
 * Delete a calendar event
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createServerSupabaseClient()
    const { id } = await params

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { error } = await supabase
      .from('calendar_events')
      .delete()
      .eq('id', id)
      .eq('admin_user_id', user.id)

    if (error) {
      console.error('Delete calendar event error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete calendar event error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
