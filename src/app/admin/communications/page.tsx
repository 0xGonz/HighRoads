import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Mail, MessageSquare, FileText, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { getCurrentAdmin } from '@/lib/auth'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { isDemoMode, mockCommunications, mockApplicants } from '@/lib/demo-data'

export const metadata: Metadata = {
  title: 'Communications | Admin Dashboard',
  description: 'View and manage all communications.',
}

export const dynamic = 'force-dynamic'

interface Communication {
  id: string
  applicant_id: string
  channel: 'email' | 'sms'
  direction: 'inbound' | 'outbound'
  subject: string | null
  body: string
  status: string
  is_automated: boolean
  sent_at: string | null
  created_at: string
  applicants: {
    id: string
    first_name: string
    last_name: string
    email: string
    phone: string
  } | null
  admin_users: {
    id: string
    name: string
  } | null
  message_templates: {
    id: string
    name: string
  } | null
}

export default async function CommunicationsPage() {
  const admin = await getCurrentAdmin()

  if (!admin) {
    redirect('/admin/login')
  }

  let communications: Communication[] = []
  let totalCount = 0
  let emailCount = 0
  let smsCount = 0
  let failedCount = 0

  if (isDemoMode) {
    // Demo mode: use mock communications with applicant data
    communications = mockCommunications.map(c => ({
      ...c,
      applicants: mockApplicants.find(a => a.id === c.applicant_id) || null,
      admin_users: { id: 'demo-admin', name: 'Demo Admin' },
      message_templates: null,
    })) as Communication[]
    totalCount = communications.length
    emailCount = communications.filter(c => c.channel === 'email').length
    smsCount = communications.filter(c => c.channel === 'sms').length
    failedCount = communications.filter(c => c.status === 'failed').length
  } else {
    const supabase = await createServerSupabaseClient()

    // Get recent communications
    const { data, error } = await supabase
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
      `)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Error fetching communications:', error)
    }
    communications = (data || []) as Communication[]

    // Get stats
    const { count: total } = await supabase
      .from('communications')
      .select('*', { count: 'exact', head: true })

    const { count: emails } = await supabase
      .from('communications')
      .select('*', { count: 'exact', head: true })
      .eq('channel', 'email')

    const { count: sms } = await supabase
      .from('communications')
      .select('*', { count: 'exact', head: true })
      .eq('channel', 'sms')

    const { count: failed } = await supabase
      .from('communications')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'failed')

    totalCount = total || 0
    emailCount = emails || 0
    smsCount = sms || 0
    failedCount = failed || 0
  }

  return (
    <AdminLayout adminName={admin.name}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Communications</h1>
            <p className="text-gray-500">View and manage all messages sent to applicants</p>
          </div>
          <Link
            href="/admin/communications/templates"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <FileText className="h-4 w-4" />
            Manage Templates
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon={<Mail className="h-5 w-5 text-blue-600" />}
            label="Total Emails"
            value={emailCount || 0}
            bgColor="bg-blue-50"
          />
          <StatCard
            icon={<MessageSquare className="h-5 w-5 text-green-600" />}
            label="Total SMS"
            value={smsCount || 0}
            bgColor="bg-green-50"
          />
          <StatCard
            icon={<CheckCircle className="h-5 w-5 text-gray-600" />}
            label="Total Sent"
            value={totalCount || 0}
            bgColor="bg-gray-50"
          />
          <StatCard
            icon={<XCircle className="h-5 w-5 text-red-600" />}
            label="Failed"
            value={failedCount || 0}
            bgColor="bg-red-50"
          />
        </div>

        {/* Communications List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Recent Communications</h2>
          </div>

          {!communications || communications.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500">
              <Mail className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <p>No communications yet.</p>
              <p className="text-sm">Messages sent to applicants will appear here.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {(communications as Communication[]).map((comm) => (
                <div key={comm.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        comm.channel === 'email' ? 'bg-blue-50' : 'bg-green-50'
                      }`}>
                        {comm.channel === 'email' ? (
                          <Mail className="h-5 w-5 text-blue-600" />
                        ) : (
                          <MessageSquare className="h-5 w-5 text-green-600" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          {comm.applicants ? (
                            <Link
                              href={`/admin/applicants/${comm.applicants.id}`}
                              className="font-medium text-gray-900 hover:text-primary-600"
                            >
                              {comm.applicants.first_name} {comm.applicants.last_name}
                            </Link>
                          ) : (
                            <span className="text-gray-500">Unknown</span>
                          )}
                          <StatusBadge status={comm.status} />
                          {comm.is_automated && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700">
                              Auto
                            </span>
                          )}
                        </div>
                        {comm.channel === 'email' && comm.subject && (
                          <p className="text-sm font-medium text-gray-700 mt-1">
                            {comm.subject}
                          </p>
                        )}
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {comm.body}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(comm.created_at)}
                          </span>
                          {comm.admin_users && (
                            <span>by {comm.admin_users.name}</span>
                          )}
                          {comm.message_templates && (
                            <span>Template: {comm.message_templates.name}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 capitalize">
                      {comm.direction}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
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

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    sent: 'bg-blue-100 text-blue-700',
    delivered: 'bg-green-100 text-green-700',
    failed: 'bg-red-100 text-red-700',
    bounced: 'bg-orange-100 text-orange-700',
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
      {status}
    </span>
  )
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  })
}
