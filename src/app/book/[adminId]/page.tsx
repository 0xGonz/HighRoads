import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { BookingCalendar } from './BookingCalendar'

export const metadata: Metadata = {
  title: 'Schedule a Call | High Road Capital',
  description: 'Schedule a call with our team to discuss your lease-to-own options.',
}

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ adminId: string }>
}

export default async function BookingPage({ params }: PageProps) {
  const { adminId } = await params
  const supabase = await createServerSupabaseClient()

  // Verify admin exists
  const { data: admin } = await supabase
    .from('admin_users')
    .select('id, name')
    .eq('id', adminId)
    .single()

  if (!admin) {
    notFound()
  }

  // Get admin availability to show available days
  const { data: availability } = await supabase
    .from('admin_availability')
    .select('day_of_week, is_active')
    .eq('admin_user_id', adminId)

  const availableDays = (availability || [])
    .filter((a) => a.is_active)
    .map((a) => a.day_of_week)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">HR</span>
            </div>
            <span className="text-xl font-bold text-gray-900">High Road Capital</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Schedule a Call
          </h1>
          <p className="text-lg text-gray-600">
            Select a convenient time to speak with our team about your lease-to-own options.
          </p>
        </div>

        <BookingCalendar adminId={adminId} availableDays={availableDays} />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} High Road Capital. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
