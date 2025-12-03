import { NextResponse } from 'next/server'
import { isGHLConfigured } from '@/lib/ghl'

/**
 * GET /api/health
 * Health check endpoint to verify system status and integrations
 */
export async function GET() {
  const ghlConfigured = isGHLConfigured()

  const status = {
    status: ghlConfigured ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    services: {
      api: {
        status: 'ok',
        message: 'API is running',
      },
      ghl: {
        status: ghlConfigured ? 'ok' : 'not_configured',
        message: ghlConfigured
          ? 'GoHighLevel integration is configured'
          : 'GoHighLevel credentials not configured - applications will fail',
      },
    },
    environment: process.env.NODE_ENV,
  }

  // Return 503 if critical services are not configured
  const httpStatus = ghlConfigured ? 200 : 503

  return NextResponse.json(status, { status: httpStatus })
}
