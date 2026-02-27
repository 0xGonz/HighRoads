import { NextResponse } from 'next/server'
import { isDBConfigured } from '@/lib/db'

/**
 * GET /api/health
 * Health check endpoint to verify system status and integrations
 */
export async function GET() {
  const dbConfigured = isDBConfigured()

  const status = {
    status: dbConfigured ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    services: {
      api: {
        status: 'ok',
        message: 'API is running',
      },
      database: {
        status: dbConfigured ? 'ok' : 'not_configured',
        message: dbConfigured
          ? 'Supabase database is configured'
          : 'Supabase credentials not configured - applications will fail',
      },
    },
    environment: process.env.NODE_ENV,
  }

  // Return 503 if critical services are not configured
  const httpStatus = dbConfigured ? 200 : 503

  return NextResponse.json(status, { status: httpStatus })
}
