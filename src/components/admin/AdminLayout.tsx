'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Kanban,
  MessageSquare,
  Zap,
  Calendar,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Breadcrumbs } from './Breadcrumbs'

interface AdminLayoutProps {
  children: React.ReactNode
  adminName?: string
}

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Applicants', href: '/admin/applicants', icon: Users },
  { name: 'Pipeline', href: '/admin/pipeline', icon: Kanban },
  { name: 'Communications', href: '/admin/communications', icon: MessageSquare },
  { name: 'Automations', href: '/admin/automations', icon: Zap },
  { name: 'Calendar', href: '/admin/calendar', icon: Calendar },
]

export function AdminLayout({ children, adminName }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform lg:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <span className="text-lg font-semibold text-gray-900">Admin</span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-md text-gray-500 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-64 lg:bg-white lg:shadow-sm">
        <div className="flex flex-col h-full">
          <div className="flex items-center h-16 px-6 border-b">
            <Link href="/admin" className="flex items-center">
              <span className="text-lg font-semibold text-gray-900">High Road Admin</span>
            </Link>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                  {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
                </Link>
              )
            })}
          </nav>
          <div className="p-4 border-t">
            {adminName && (
              <p className="text-sm text-gray-500 mb-2 truncate">{adminName}</p>
            )}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <div className="sticky top-0 z-40 flex items-center h-16 px-4 bg-white border-b lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md text-gray-500 hover:bg-gray-100"
          >
            <Menu className="h-6 w-6" />
          </button>
          <span className="ml-3 text-lg font-semibold text-gray-900">Admin</span>
        </div>

        {/* Page content */}
        <main className="py-6">
          <div className="px-4 sm:px-6 lg:px-8">
            <Breadcrumbs />
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
