import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { isDemoMode, mockTemplates } from '@/lib/demo-data'

/**
 * GET /api/templates
 * List message templates
 */
export async function GET(request: NextRequest) {
  try {
    // Demo mode: return mock templates
    if (isDemoMode) {
      const searchParams = request.nextUrl.searchParams
      const channel = searchParams.get('channel')
      const category = searchParams.get('category')
      const activeOnly = searchParams.get('activeOnly') !== 'false'

      let templates = [...mockTemplates]
      if (channel) {
        templates = templates.filter(t => t.channel === channel)
      }
      if (category) {
        templates = templates.filter(t => t.category === category)
      }
      if (activeOnly) {
        templates = templates.filter(t => t.is_active)
      }
      return NextResponse.json({ templates })
    }

    const supabase = await createServerSupabaseClient()

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams
    const channel = searchParams.get('channel')
    const category = searchParams.get('category')
    const activeOnly = searchParams.get('activeOnly') !== 'false'

    // Build query
    let query = supabase
      .from('message_templates')
      .select('*')
      .order('category', { ascending: true })
      .order('name', { ascending: true })

    if (channel && (channel === 'email' || channel === 'sms')) {
      query = query.eq('channel', channel)
    }

    if (category) {
      query = query.eq('category', category)
    }

    if (activeOnly) {
      query = query.eq('is_active', true)
    }

    const { data, error } = await query

    if (error) {
      console.error('Get templates error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ templates: data || [] })
  } catch (error) {
    console.error('Templates API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/templates
 * Create a new message template
 */
export async function POST(request: NextRequest) {
  try {
    // Demo mode: return fake created template
    if (isDemoMode) {
      const body = await request.json()
      const template = {
        id: `tpl-demo-${Date.now()}`,
        ...body,
        is_active: true,
        created_by: 'demo-admin',
        created_at: new Date().toISOString(),
      }
      return NextResponse.json({ template }, { status: 201 })
    }

    const supabase = await createServerSupabaseClient()

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, channel, category, subject, body: templateBody, variables } = body

    if (!name || !channel || !category || !templateBody) {
      return NextResponse.json(
        { error: 'name, channel, category, and body are required' },
        { status: 400 }
      )
    }

    if (channel !== 'email' && channel !== 'sms') {
      return NextResponse.json(
        { error: 'channel must be "email" or "sms"' },
        { status: 400 }
      )
    }

    // Create template
    const { data, error } = await supabase
      .from('message_templates')
      .insert({
        name,
        channel,
        category,
        subject: channel === 'email' ? subject : null,
        body: templateBody,
        variables: variables || [],
        created_by: user.id,
      })
      .select()
      .single()

    if (error) {
      console.error('Create template error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ template: data }, { status: 201 })
  } catch (error) {
    console.error('Create template error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
