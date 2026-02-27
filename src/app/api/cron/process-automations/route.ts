import { NextRequest, NextResponse } from 'next/server'
import { processAutomations } from '@/lib/automation'

/**
 * POST /api/cron/process-automations
 * Process all active automation rules
 *
 * This endpoint should be called by a cron job every 5 minutes.
 * It can be triggered by:
 * - Vercel Cron: Add to vercel.json
 * - External cron service (e.g., cron-job.org)
 * - Self-hosted cron
 *
 * Security: Uses a CRON_SECRET header for authentication
 */
export async function POST(request: NextRequest) {
  try {
    // Verify cron secret if configured
    const cronSecret = process.env.CRON_SECRET
    if (cronSecret) {
      const authHeader = request.headers.get('Authorization')
      const providedSecret = authHeader?.replace('Bearer ', '')

      if (providedSecret !== cronSecret) {
        console.warn('Invalid cron secret provided')
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    console.log('Starting automation processing...')
    const startTime = Date.now()

    const result = await processAutomations()

    const duration = Date.now() - startTime
    console.log(`Automation processing complete in ${duration}ms:`, result)

    return NextResponse.json({
      success: true,
      ...result,
      duration_ms: duration,
    })
  } catch (error) {
    console.error('Automation processing error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/cron/process-automations
 * Check the status of the automation cron job
 */
export async function GET() {
  return NextResponse.json({
    status: 'ready',
    message: 'POST to this endpoint to process automations',
    schedule: 'Should be called every 5 minutes',
  })
}
