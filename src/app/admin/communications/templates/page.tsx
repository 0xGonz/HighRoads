import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Mail, MessageSquare, Edit, Trash2 } from 'lucide-react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { getCurrentAdmin } from '@/lib/auth'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { isDemoMode, mockTemplates } from '@/lib/demo-data'
import { TemplateList } from './TemplateList'

export const metadata: Metadata = {
  title: 'Message Templates | Admin Dashboard',
  description: 'Manage email and SMS templates.',
}

export const dynamic = 'force-dynamic'

interface MessageTemplate {
  id: string
  name: string
  channel: 'email' | 'sms'
  category: string
  subject: string | null
  body: string
  variables: string[]
  is_active: boolean
  created_at: string
}

export default async function TemplatesPage() {
  const admin = await getCurrentAdmin()

  if (!admin) {
    redirect('/admin/login')
  }

  let templates: MessageTemplate[] = []

  if (isDemoMode) {
    // Demo mode: use mock templates
    templates = mockTemplates as MessageTemplate[]
  } else {
    const supabase = await createServerSupabaseClient()

    // Get all templates
    const { data, error } = await supabase
      .from('message_templates')
      .select('*')
      .order('category', { ascending: true })
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching templates:', error)
    }
    templates = (data || []) as MessageTemplate[]
  }

  // Group templates by category
  const emailTemplates = templates.filter(t => t.channel === 'email')
  const smsTemplates = templates.filter(t => t.channel === 'sms')

  return (
    <AdminLayout adminName={admin.name}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/communications"
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-500" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Message Templates</h1>
              <p className="text-gray-500">Manage email and SMS templates for applicant communications</p>
            </div>
          </div>
        </div>

        {/* Email Templates */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50">
              <Mail className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Email Templates</h2>
              <p className="text-sm text-gray-500">{emailTemplates.length} templates</p>
            </div>
          </div>
          <TemplateList templates={emailTemplates as MessageTemplate[]} />
        </div>

        {/* SMS Templates */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-50">
              <MessageSquare className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">SMS Templates</h2>
              <p className="text-sm text-gray-500">{smsTemplates.length} templates</p>
            </div>
          </div>
          <TemplateList templates={smsTemplates as MessageTemplate[]} />
        </div>

        {/* Variable Reference */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Available Variables</h2>
          <p className="text-sm text-gray-500 mb-4">
            Use these variables in your templates. They will be replaced with actual values when sending.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <VariableItem name="first_name" description="Applicant's first name" />
            <VariableItem name="last_name" description="Applicant's last name" />
            <VariableItem name="full_name" description="Full name" />
            <VariableItem name="email" description="Email address" />
            <VariableItem name="phone" description="Phone number" />
            <VariableItem name="admin_name" description="Sender's name" />
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

function VariableItem({ name, description }: { name: string; description: string }) {
  return (
    <div className="p-3 bg-gray-50 rounded-lg">
      <code className="text-sm font-mono text-primary-600">{`{{${name}}}`}</code>
      <p className="text-xs text-gray-500 mt-1">{description}</p>
    </div>
  )
}
