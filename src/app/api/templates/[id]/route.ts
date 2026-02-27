import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/templates/[id]
 * Get a specific template
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
      .from('message_templates')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Template not found' }, { status: 404 })
      }
      console.error('Get template error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ template: data })
  } catch (error) {
    console.error('Template API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/templates/[id]
 * Update a template
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
    const { name, category, subject, body: templateBody, variables, is_active } = body

    const updateData: Record<string, unknown> = {}
    if (name !== undefined) updateData.name = name
    if (category !== undefined) updateData.category = category
    if (subject !== undefined) updateData.subject = subject
    if (templateBody !== undefined) updateData.body = templateBody
    if (variables !== undefined) updateData.variables = variables
    if (is_active !== undefined) updateData.is_active = is_active

    const { data, error } = await supabase
      .from('message_templates')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Template not found' }, { status: 404 })
      }
      console.error('Update template error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ template: data })
  } catch (error) {
    console.error('Update template error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/templates/[id]
 * Delete a template
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
      .from('message_templates')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Delete template error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete template error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
