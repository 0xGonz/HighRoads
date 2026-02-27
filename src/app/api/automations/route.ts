import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { isDemoMode, mockAutomationRules, mockTemplates } from '@/lib/demo-data'

/**
 * GET /api/automations
 * List all automation rules
 */
export async function GET(request: NextRequest) {
  try {
    // Demo mode: return mock automations
    if (isDemoMode) {
      const searchParams = request.nextUrl.searchParams
      const activeOnly = searchParams.get('activeOnly') === 'true'
      const triggerType = searchParams.get('triggerType')

      let automations = [...mockAutomationRules]
      if (activeOnly) {
        automations = automations.filter(a => a.is_active)
      }
      if (triggerType) {
        automations = automations.filter(a => a.trigger_type === triggerType)
      }

      // Enrich with template data
      const enriched = automations.map(a => ({
        ...a,
        message_templates: a.action_template_id
          ? mockTemplates.find(t => t.id === a.action_template_id) || null
          : null,
      }))

      return NextResponse.json({ automations: enriched })
    }

    const supabase = await createServerSupabaseClient()

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams
    const activeOnly = searchParams.get('activeOnly') === 'true'
    const triggerType = searchParams.get('triggerType')

    // Build query
    let query = supabase
      .from('automation_rules')
      .select(`
        *,
        message_templates (
          id,
          name,
          channel
        )
      `)
      .order('priority', { ascending: false })
      .order('name', { ascending: true })

    if (activeOnly) {
      query = query.eq('is_active', true)
    }

    if (triggerType) {
      query = query.eq('trigger_type', triggerType)
    }

    const { data, error } = await query

    if (error) {
      console.error('Get automations error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ automations: data || [] })
  } catch (error) {
    console.error('Automations API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/automations
 * Create a new automation rule
 */
export async function POST(request: NextRequest) {
  try {
    // Demo mode: return fake created automation
    if (isDemoMode) {
      const body = await request.json()
      const automation = {
        id: `auto-demo-${Date.now()}`,
        ...body,
        is_active: true,
        created_by: 'demo-admin',
        created_at: new Date().toISOString(),
      }
      return NextResponse.json({ automation }, { status: 201 })
    }

    const supabase = await createServerSupabaseClient()

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      name,
      description,
      trigger_type,
      trigger_status,
      trigger_days,
      action_template_id,
      action_channel,
      stop_on_response,
      stop_on_status_change,
      max_sends,
      delay_minutes,
      priority,
    } = body

    if (!name || !trigger_type || !action_channel) {
      return NextResponse.json(
        { error: 'name, trigger_type, and action_channel are required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('automation_rules')
      .insert({
        name,
        description: description || null,
        trigger_type,
        trigger_status: trigger_status || null,
        trigger_days: trigger_days || null,
        action_template_id: action_template_id || null,
        action_channel,
        stop_on_response: stop_on_response ?? true,
        stop_on_status_change: stop_on_status_change ?? true,
        max_sends: max_sends ?? 1,
        delay_minutes: delay_minutes ?? 0,
        priority: priority ?? 0,
        is_active: true,
        created_by: user.id,
      })
      .select()
      .single()

    if (error) {
      console.error('Create automation error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ automation: data }, { status: 201 })
  } catch (error) {
    console.error('Create automation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
