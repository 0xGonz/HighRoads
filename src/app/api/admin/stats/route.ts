import { NextResponse } from 'next/server'
import { getDashboardStats, getApplicantsByStatus } from '@/lib/db'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

/**
 * GET /api/admin/stats
 * Get dashboard statistics for admin
 */
export async function GET() {
  try {
    const stats = await getDashboardStats()
    const byStatus = await getApplicantsByStatus()

    return NextResponse.json({
      success: true,
      data: {
        stats,
        byStatus: {
          new: byStatus.new.length,
          in_progress: byStatus.in_progress.length,
          carrier_app: byStatus.carrier_app.length,
          pending: byStatus.pending.length,
          complete: byStatus.complete.length,
          disqualified: byStatus.disqualified.length,
        },
      },
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}
