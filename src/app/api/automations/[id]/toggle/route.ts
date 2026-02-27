import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * POST /api/automations/[id]/toggle
 * Toggle an automation rule's active status
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createServerSupabaseClient()
    const { id } = await params

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { is_active } = body

    if (typeof is_active !== 'boolean') {
      return NextResponse.json(
        { error: 'is_active must be a boolean' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('automation_rules')
      .update({ is_active })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Automation not found' }, { status: 404 })
      }
      console.error('Toggle automation error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ automation: data })
  } catch (error) {
    console.error('Toggle automation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
