import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { sendEmail, sendTemplateEmail, getEmailTemplates } from '@/lib/email'
import { sendSms, sendTemplateSms, getSmsTemplates } from '@/lib/sms'
import { findApplicantById } from '@/lib/db'
import { isDemoMode, mockCommunications, mockApplicants } from '@/lib/demo-data'

/**
 * GET /api/communications
 * List communications with optional filters
 */
export async function GET(request: NextRequest) {
  try {
    // Demo mode: return mock communications
    if (isDemoMode) {
      const searchParams = request.nextUrl.searchParams
      const applicantId = searchParams.get('applicantId')
      const channel = searchParams.get('channel')
      const page = parseInt(searchParams.get('page') || '1')
      const limit = parseInt(searchParams.get('limit') || '20')

      let communications = [...mockCommunications]
      if (applicantId) {
        communications = communications.filter(c => c.applicant_id === applicantId)
      }
      if (channel) {
        communications = communications.filter(c => c.channel === channel)
      }

      // Add applicant data
      const enriched = communications.map(c => ({
        ...c,
        applicants: mockApplicants.find(a => a.id === c.applicant_id) || null,
        admin_users: { id: 'demo-admin', name: 'Demo Admin' },
        message_templates: null,
      }))

      const start = (page - 1) * limit
      const paged = enriched.slice(start, start + limit)

      return NextResponse.json({
        communications: paged,
        total: enriched.length,
        page,
        limit,
      })
    }

    const supabase = await createServerSupabaseClient()

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams
    const applicantId = searchParams.get('applicantId')
    const channel = searchParams.get('channel')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    // Build query
    let query = supabase
      .from('communications')
      .select(`
        *,
        applicants (
          id,
          first_name,
          last_name,
          email,
          phone
        ),
        admin_users (
          id,
          name
        ),
        message_templates (
          id,
          name
        )
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (applicantId) {
      query = query.eq('applicant_id', applicantId)
    }

    if (channel && (channel === 'email' || channel === 'sms')) {
      query = query.eq('channel', channel)
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Get communications error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      communications: data || [],
      total: count || 0,
      page,
      limit,
    })
  } catch (error) {
    console.error('Communications API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/communications
 * Send a new message (email or SMS)
 */
export async function POST(request: NextRequest) {
  try {
    // Demo mode: simulate sending
    if (isDemoMode) {
      const body = await request.json()
      return NextResponse.json({
        success: true,
        messageId: `demo-msg-${Date.now()}`,
        note: 'Demo mode - message not actually sent',
      })
    }

    const supabase = await createServerSupabaseClient()

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { applicantId, channel, templateId, subject, message } = body

    if (!applicantId || !channel) {
      return NextResponse.json(
        { error: 'applicantId and channel are required' },
        { status: 400 }
      )
    }

    // Get applicant
    const applicant = await findApplicantById(applicantId)
    if (!applicant) {
      return NextResponse.json({ error: 'Applicant not found' }, { status: 404 })
    }

    let result

    if (channel === 'email') {
      if (templateId) {
        // Send using template
        result = await sendTemplateEmail(templateId, applicant, user.id)
      } else if (subject && message) {
        // Send custom email
        result = await sendEmail({
          to: applicant.email,
          subject,
          body: message,
          applicantId,
          adminUserId: user.id,
        })
      } else {
        return NextResponse.json(
          { error: 'Either templateId or subject+message required for email' },
          { status: 400 }
        )
      }
    } else if (channel === 'sms') {
      // Check SMS opt-in
      if (!applicant.sms_opt_in) {
        return NextResponse.json(
          { error: 'Applicant has not opted in for SMS' },
          { status: 400 }
        )
      }

      if (templateId) {
        // Send using template
        result = await sendTemplateSms(templateId, applicant, user.id)
      } else if (message) {
        // Send custom SMS
        result = await sendSms({
          to: applicant.phone,
          body: message,
          applicantId,
          adminUserId: user.id,
        })
      } else {
        return NextResponse.json(
          { error: 'Either templateId or message required for SMS' },
          { status: 400 }
        )
      }
    } else {
      return NextResponse.json(
        { error: 'Invalid channel. Must be "email" or "sms"' },
        { status: 400 }
      )
    }

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to send message' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      messageId: result.messageId,
    })
  } catch (error) {
    console.error('Send communication error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
