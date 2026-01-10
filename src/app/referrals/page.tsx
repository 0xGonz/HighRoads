import { Metadata } from 'next'
import { ReferralProgram } from '@/components/referrals/ReferralProgram'

export const metadata: Metadata = {
  title: 'Referral Program | High Road Capital LLC',
  description: 'Earn $500 for every driver you refer who completes 90 days in our program. No limits on referrals.',
}

export default function ReferralsPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <ReferralProgram />
    </div>
  )
}
