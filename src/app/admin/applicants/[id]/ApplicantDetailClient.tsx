'use client'

import { useState } from 'react'
import {
  Phone, Mail, MapPin, Calendar, CheckCircle, XCircle, FileText,
  MessageSquare, Play, Pause, Send, Clock
} from 'lucide-react'
import { ApplicantTabs } from '@/components/admin/ApplicantTabs'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { SendMessageForm } from '@/components/admin/SendMessageForm'
import { ApplicantCommunications } from '@/components/admin/ApplicantCommunications'
import { AutomationPauseToggle } from '@/components/admin/AutomationPauseToggle'
import { ScheduleCallButton } from '@/components/admin/ScheduleCallButton'
import { ApplicantStatusForm } from './ApplicantStatusForm'
import { ApplicantNotesForm } from './ApplicantNotesForm'
import { buttonVariants, buttonSizes, statusColors } from '@/lib/design-tokens'
import type { ApplicantStatus } from '@/types/database'

interface ApplicantData {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  location_state: string | null
  created_at: string
  status: ApplicantStatus
  is_prequalified: boolean
  sms_opt_in: boolean
  automation_paused: boolean
  has_cdl: boolean | null
  has_medical_card: boolean | null
  us_work_eligible: boolean | null
  experience_months: number | null
  disqualification_reason: string | null
  ownership_goal: string | null
  truck_preference: string | null
  freight_preference: string | null
  has_existing_carrier: boolean | null
  carrier_name: string | null
  notes: string | null
  lead_source: string | null
  referral_code: string | null
}

interface Document {
  id: string
  type: string
  file_name: string
  file_url: string
}

interface ActivityLog {
  id: string
  action: string
  admin_name?: string | null
  created_at: string
}

interface ApplicantDetailClientProps {
  applicant: ApplicantData
  documents: Document[]
  activityLog: ActivityLog[]
}

export function ApplicantDetailClient({ applicant, documents, activityLog }: ApplicantDetailClientProps) {
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [showSmsForm, setShowSmsForm] = useState(false)

  const statusStyle = statusColors[applicant.status] || statusColors.new

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {applicant.first_name} {applicant.last_name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <StatusBadge status={applicant.status} />
              {applicant.is_prequalified ? (
                <span className="inline-flex items-center text-sm text-green-600">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Prequalified
                </span>
              ) : (
                <span className="inline-flex items-center text-sm text-gray-500">
                  <XCircle className="h-4 w-4 mr-1" />
                  Not Prequalified
                </span>
              )}
              {applicant.sms_opt_in && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  SMS Opted In
                </span>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowEmailForm(!showEmailForm)}
              className={`${buttonVariants.secondary} ${buttonSizes.sm} inline-flex items-center gap-2`}
            >
              <Mail className="h-4 w-4" />
              Email
            </button>
            <button
              onClick={() => setShowSmsForm(!showSmsForm)}
              disabled={!applicant.sms_opt_in}
              className={`${buttonVariants.secondary} ${buttonSizes.sm} inline-flex items-center gap-2`}
              title={!applicant.sms_opt_in ? 'SMS not opted in' : undefined}
            >
              <MessageSquare className="h-4 w-4" />
              SMS
            </button>
            <ScheduleCallButton
              applicantId={applicant.id}
              applicantName={`${applicant.first_name} ${applicant.last_name}`}
              applicantPhone={applicant.phone}
              variant="compact"
            />
            <AutomationPauseToggle
              applicantId={applicant.id}
              initialPaused={applicant.automation_paused}
              variant="compact"
            />
          </div>
        </div>

        {/* Inline Message Form */}
        {(showEmailForm || showSmsForm) && (
          <div className="mt-4 pt-4 border-t">
            <SendMessageForm
              applicantId={applicant.id}
              applicantEmail={applicant.email}
              applicantPhone={applicant.phone}
              applicantFirstName={applicant.first_name}
              smsOptedIn={applicant.sms_opt_in}
              defaultChannel={showSmsForm ? 'sms' : 'email'}
            />
          </div>
        )}
      </div>

      {/* Tabbed Content */}
      <ApplicantTabs>
        {{
          overview: (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Column */}
              <div className="lg:col-span-2 space-y-6">
                {/* Contact Info */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="font-semibold text-gray-900 mb-4">Contact Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center text-gray-600">
                      <Mail className="h-5 w-5 mr-3 text-gray-400" />
                      <a href={`mailto:${applicant.email}`} className="hover:text-primary-600">
                        {applicant.email}
                      </a>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Phone className="h-5 w-5 mr-3 text-gray-400" />
                      <a href={`tel:${applicant.phone}`} className="hover:text-primary-600">
                        {applicant.phone}
                      </a>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-5 w-5 mr-3 text-gray-400" />
                      {applicant.location_state || 'Not specified'}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-5 w-5 mr-3 text-gray-400" />
                      Applied {formatDate(applicant.created_at)}
                    </div>
                  </div>
                </div>

                {/* Qualification Details */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="font-semibold text-gray-900 mb-4">Qualifications</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <QualificationItem label="CDL-A" value={applicant.has_cdl} />
                    <QualificationItem label="Medical Card" value={applicant.has_medical_card} />
                    <QualificationItem label="US Work Eligible" value={applicant.us_work_eligible} />
                    <div>
                      <p className="text-sm text-gray-500">Experience</p>
                      <p className="font-medium text-gray-900">
                        {applicant.experience_months
                          ? `${applicant.experience_months} months`
                          : 'Not specified'}
                      </p>
                    </div>
                  </div>
                  {applicant.disqualification_reason && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm text-gray-500">Disqualification Reason</p>
                      <p className="text-red-600">{applicant.disqualification_reason}</p>
                    </div>
                  )}
                </div>

                {/* Preferences */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="font-semibold text-gray-900 mb-4">Preferences</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoItem label="Ownership Goal" value={applicant.ownership_goal} />
                    <InfoItem label="Truck Preference" value={applicant.truck_preference} />
                    <InfoItem label="Freight Preference" value={applicant.freight_preference} />
                    <InfoItem
                      label="Existing Carrier"
                      value={applicant.has_existing_carrier ? applicant.carrier_name || 'Yes' : 'No'}
                    />
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Status Update */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="font-semibold text-gray-900 mb-4">Update Status</h2>
                  <ApplicantStatusForm
                    applicantId={applicant.id}
                    currentStatus={applicant.status}
                  />
                </div>

                {/* Notes */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="font-semibold text-gray-900 mb-4">Notes</h2>
                  <ApplicantNotesForm
                    applicantId={applicant.id}
                    currentNotes={applicant.notes || ''}
                  />
                </div>

                {/* Lead Source */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="font-semibold text-gray-900 mb-4">Lead Info</h2>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-gray-500">Lead Source</p>
                      <p className="text-gray-900">{applicant.lead_source || 'Direct'}</p>
                    </div>
                    {applicant.referral_code && (
                      <div>
                        <p className="text-gray-500">Referral Code</p>
                        <p className="text-gray-900">{applicant.referral_code}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ),
          communications: (
            <div className="space-y-6">
              {/* Send Message Form */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="font-semibold text-gray-900 mb-4">Send Message</h2>
                <SendMessageForm
                  applicantId={applicant.id}
                  applicantEmail={applicant.email}
                  applicantPhone={applicant.phone}
                  applicantFirstName={applicant.first_name}
                  smsOptedIn={applicant.sms_opt_in}
                />
              </div>

              {/* Communications History */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="font-semibold text-gray-900 mb-4">Message History</h2>
                <ApplicantCommunications applicantId={applicant.id} />
              </div>
            </div>
          ),
          documents: (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Documents</h2>
              {documents.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No documents uploaded yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {documents.map((doc) => (
                    <a
                      key={doc.id}
                      href={doc.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors group"
                    >
                      <FileText className="h-10 w-10 text-gray-400 group-hover:text-primary-500 mr-3 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">{formatDocType(doc.type)}</p>
                        <p className="text-sm text-gray-500 truncate">{doc.file_name}</p>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          ),
          activity: (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Activity Log</h2>
              {activityLog.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No activity recorded yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activityLog.map((activity) => (
                    <div key={activity.id} className="flex gap-3 pb-4 border-b border-gray-100 last:border-0">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <Clock className="h-4 w-4 text-gray-500" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {activity.admin_name || 'System'} &middot; {formatDate(activity.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ),
        }}
      </ApplicantTabs>
    </div>
  )
}

function QualificationItem({ label, value }: { label: string; value: boolean | null }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      {value === true ? (
        <span className="inline-flex items-center text-green-600">
          <CheckCircle className="h-4 w-4 mr-1" />
          Yes
        </span>
      ) : value === false ? (
        <span className="inline-flex items-center text-red-600">
          <XCircle className="h-4 w-4 mr-1" />
          No
        </span>
      ) : (
        <span className="text-gray-400">N/A</span>
      )}
    </div>
  )
}

function InfoItem({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium text-gray-900">{value || 'Not specified'}</p>
    </div>
  )
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatDocType(type: string): string {
  const labels: Record<string, string> = {
    cdl_front: 'CDL (Front)',
    cdl_back: 'CDL (Back)',
    medical_card: 'Medical Card',
    mvr: 'MVR Report',
  }
  return labels[type] || type
}
