import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Zap, Mail, MessageSquare, Clock, Play, Pause } from 'lucide-react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { getCurrentAdmin } from '@/lib/auth'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { isDemoMode, mockAutomationRules, mockTemplates } from '@/lib/demo-data'
import { AutomationRuleCard } from './AutomationRuleCard'

export const metadata: Metadata = {
  title: 'Automations | Admin Dashboard',
  description: 'Manage automated follow-up sequences.',
}

export const dynamic = 'force-dynamic'

interface AutomationRule {
  id: string
  name: string
  description: string | null
  trigger_type: string
  trigger_status: string | null
  trigger_days: number | null
  action_template_id: string | null
  action_channel: 'email' | 'sms'
  stop_on_response: boolean
  stop_on_status_change: boolean
  max_sends: number
  delay_minutes: number
  is_active: boolean
  priority: number
  created_at: string
  message_templates?: {
    id: string
    name: string
  } | null
}

interface AutomationStats {
  totalRules: number
  activeRules: number
  executionsToday: number
  messagesSentToday: number
}

export default async function AutomationsPage() {
  const admin = await getCurrentAdmin()

  if (!admin) {
    redirect('/admin/login')
  }

  let rules: AutomationRule[] = []
  let stats: AutomationStats = {
    totalRules: 0,
    activeRules: 0,
    executionsToday: 0,
    messagesSentToday: 0,
  }

  if (isDemoMode) {
    // Demo mode: use mock data
    rules = mockAutomationRules.map(r => ({
      ...r,
      message_templates: r.action_template_id
        ? mockTemplates.find(t => t.id === r.action_template_id) || null
        : null,
    })) as AutomationRule[]
    stats = {
      totalRules: mockAutomationRules.length,
      activeRules: mockAutomationRules.filter(r => r.is_active).length,
      executionsToday: 3,
      messagesSentToday: 5,
    }
  } else {
    const supabase = await createServerSupabaseClient()

    // Get all automation rules with template info
    const { data, error } = await supabase
      .from('automation_rules')
      .select(`
        *,
        message_templates (
          id,
          name
        )
      `)
      .order('priority', { ascending: false })
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching automation rules:', error)
    }
    rules = (data || []) as AutomationRule[]

    // Get stats
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const { count: totalRules } = await supabase
      .from('automation_rules')
      .select('*', { count: 'exact', head: true })

    const { count: activeRules } = await supabase
      .from('automation_rules')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)

    const { count: executionsToday } = await supabase
      .from('automation_executions')
      .select('*', { count: 'exact', head: true })
      .gte('last_executed_at', today.toISOString())

    const { count: messagesSentToday } = await supabase
      .from('communications')
      .select('*', { count: 'exact', head: true })
      .eq('is_automated', true)
      .gte('created_at', today.toISOString())

    stats = {
      totalRules: totalRules || 0,
      activeRules: activeRules || 0,
      executionsToday: executionsToday || 0,
      messagesSentToday: messagesSentToday || 0,
    }
  }

  // Group rules by trigger type
  const statusChangeRules = (rules || []).filter(r => r.trigger_type === 'status_change')
  const daysInStatusRules = (rules || []).filter(r => r.trigger_type === 'days_in_status')
  const missingDocsRules = (rules || []).filter(r => r.trigger_type === 'missing_documents')
  const noResponseRules = (rules || []).filter(r => r.trigger_type === 'no_response')

  return (
    <AdminLayout adminName={admin.name}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Automations</h1>
          <p className="text-gray-500">Configure automated follow-up sequences for applicants</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon={<Zap className="h-5 w-5 text-purple-600" />}
            label="Total Rules"
            value={stats.totalRules}
            bgColor="bg-purple-50"
          />
          <StatCard
            icon={<Play className="h-5 w-5 text-green-600" />}
            label="Active Rules"
            value={stats.activeRules}
            bgColor="bg-green-50"
          />
          <StatCard
            icon={<Clock className="h-5 w-5 text-blue-600" />}
            label="Runs Today"
            value={stats.executionsToday}
            bgColor="bg-blue-50"
          />
          <StatCard
            icon={<Mail className="h-5 w-5 text-orange-600" />}
            label="Messages Sent"
            value={stats.messagesSentToday}
            bgColor="bg-orange-50"
          />
        </div>

        {/* How it works */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6">
          <h2 className="font-semibold text-gray-900 mb-2">How Automations Work</h2>
          <p className="text-sm text-gray-600 mb-4">
            Automations run automatically every 5 minutes and send messages based on triggers:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="bg-white/60 rounded-lg p-3">
              <p className="font-medium text-gray-900">Status Change</p>
              <p className="text-gray-500">When applicant moves to a status</p>
            </div>
            <div className="bg-white/60 rounded-lg p-3">
              <p className="font-medium text-gray-900">Days in Status</p>
              <p className="text-gray-500">After X days in a specific status</p>
            </div>
            <div className="bg-white/60 rounded-lg p-3">
              <p className="font-medium text-gray-900">Missing Documents</p>
              <p className="text-gray-500">When docs are missing for X days</p>
            </div>
            <div className="bg-white/60 rounded-lg p-3">
              <p className="font-medium text-gray-900">No Response</p>
              <p className="text-gray-500">When no reply for X days</p>
            </div>
          </div>
        </div>

        {/* Status Change Rules */}
        {statusChangeRules.length > 0 && (
          <RuleSection
            title="Status Change Triggers"
            description="Sent immediately when applicant status changes"
            rules={statusChangeRules as AutomationRule[]}
          />
        )}

        {/* Days in Status Rules */}
        {daysInStatusRules.length > 0 && (
          <RuleSection
            title="Time-Based Triggers"
            description="Sent after applicant has been in a status for X days"
            rules={daysInStatusRules as AutomationRule[]}
          />
        )}

        {/* Missing Documents Rules */}
        {missingDocsRules.length > 0 && (
          <RuleSection
            title="Document Reminders"
            description="Sent when required documents are missing"
            rules={missingDocsRules as AutomationRule[]}
          />
        )}

        {/* No Response Rules */}
        {noResponseRules.length > 0 && (
          <RuleSection
            title="No Response Follow-ups"
            description="Sent when applicant hasn't responded"
            rules={noResponseRules as AutomationRule[]}
          />
        )}

        {/* Empty State */}
        {(!rules || rules.length === 0) && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Zap className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No automation rules</h3>
            <p className="text-gray-500">
              Automation rules are created in the database. Default rules should be seeded automatically.
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

function StatCard({
  icon,
  label,
  value,
  bgColor,
}: {
  icon: React.ReactNode
  label: string
  value: number
  bgColor: string
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${bgColor}`}>
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{label}</p>
        </div>
      </div>
    </div>
  )
}

function RuleSection({
  title,
  description,
  rules,
}: {
  title: string
  description: string
  rules: AutomationRule[]
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="font-semibold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <div className="divide-y divide-gray-100">
        {rules.map((rule) => (
          <AutomationRuleCard key={rule.id} rule={rule} />
        ))}
      </div>
    </div>
  )
}
