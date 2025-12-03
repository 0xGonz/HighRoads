import { NextResponse } from 'next/server'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

/**
 * Individual applicant management has moved to GoHighLevel
 * These endpoints are deprecated in favor of GHL dashboard
 */

export async function GET() {
  return NextResponse.json({
    message: 'Applicant management has moved to GoHighLevel',
    redirect: 'Use the GHL dashboard to view individual contacts',
    ghl_dashboard: 'https://app.gohighlevel.com/contacts',
  })
}

export async function PATCH() {
  return NextResponse.json({
    message: 'Applicant management has moved to GoHighLevel',
    redirect: 'Use the GHL dashboard to update contacts',
    ghl_dashboard: 'https://app.gohighlevel.com/contacts',
  })
}

export async function DELETE() {
  return NextResponse.json({
    message: 'Applicant management has moved to GoHighLevel',
    redirect: 'Use the GHL dashboard to delete contacts',
    ghl_dashboard: 'https://app.gohighlevel.com/contacts',
  })
}
