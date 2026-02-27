'use client'

import { useState } from 'react'
import { User, MessageSquare, FileText, Activity } from 'lucide-react'

interface Tab {
  id: string
  label: string
  icon: React.ReactNode
}

const tabs: Tab[] = [
  { id: 'overview', label: 'Overview', icon: <User className="h-4 w-4" /> },
  { id: 'communications', label: 'Communications', icon: <MessageSquare className="h-4 w-4" /> },
  { id: 'documents', label: 'Documents', icon: <FileText className="h-4 w-4" /> },
  { id: 'activity', label: 'Activity', icon: <Activity className="h-4 w-4" /> },
]

interface ApplicantTabsProps {
  children: {
    overview: React.ReactNode
    communications: React.ReactNode
    documents: React.ReactNode
    activity: React.ReactNode
  }
}

export function ApplicantTabs({ children }: ApplicantTabsProps) {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div>
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex gap-6" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 py-3 px-1 border-b-2 text-sm font-medium transition-colors
                ${activeTab === tab.id
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && children.overview}
        {activeTab === 'communications' && children.communications}
        {activeTab === 'documents' && children.documents}
        {activeTab === 'activity' && children.activity}
      </div>
    </div>
  )
}
