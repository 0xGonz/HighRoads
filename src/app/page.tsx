import { Hero } from '@/components/landing/Hero'
import { TrustBadges } from '@/components/landing/TrustBadges'
import { ValueProps } from '@/components/landing/ValueProps'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { Requirements } from '@/components/landing/Requirements'
import { Testimonials } from '@/components/landing/Testimonials'
import { FAQ } from '@/components/landing/FAQ'
import { CTA } from '@/components/landing/CTA'

export default function Home() {
  return (
    <>
      <Hero />
      <TrustBadges />
      <ValueProps />
      <HowItWorks />
      <Requirements />
      <Testimonials />
      <FAQ />
      <CTA />
    </>
  )
}
