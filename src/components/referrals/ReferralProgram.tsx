'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { Gift, Users, DollarSign, CheckCircle, ArrowRight, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'

const referralSchema = z.object({
  // Referrer info
  referrer_name: z.string().min(2, 'Please enter your name'),
  referrer_email: z.string().email('Please enter a valid email'),
  referrer_phone: z.string().min(10, 'Please enter a valid phone number'),
  // Referred driver info
  driver_name: z.string().min(2, 'Please enter the driver\'s name'),
  driver_phone: z.string().min(10, 'Please enter a valid phone number'),
  driver_email: z.string().email('Please enter a valid email').optional().or(z.literal('')),
  relationship: z.string().min(1, 'Please select your relationship'),
})

type ReferralFormData = z.infer<typeof referralSchema>

const RELATIONSHIPS = [
  { value: 'coworker', label: 'Co-worker / Fellow Driver' },
  { value: 'friend', label: 'Friend' },
  { value: 'family', label: 'Family Member' },
  { value: 'other', label: 'Other' },
]

const BENEFITS = [
  {
    icon: DollarSign,
    title: '$500 Bonus',
    description: 'Earn $500 for every driver you refer who completes 90 days',
  },
  {
    icon: Users,
    title: 'No Limits',
    description: 'Refer as many drivers as you want — unlimited earning potential',
  },
  {
    icon: Gift,
    title: 'Help Others',
    description: 'Help fellow drivers achieve the dream of truck ownership',
  },
]

export function ReferralProgram() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReferralFormData>({
    resolver: zodResolver(referralSchema),
  })

  const onSubmit = async (data: ReferralFormData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/referrals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.message || 'Failed to submit referral')
      }

      setIsSuccess(true)
      reset()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* Hero Section */}
      <section className="bg-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center bg-accent/20 rounded-full px-4 py-2 mb-6">
            <Gift className="h-5 w-5 text-accent mr-2" />
            <span className="text-sm font-medium">Driver Referral Program</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Earn <span className="text-accent">$500</span> Per Referral
          </h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            Know a driver who wants to own their truck? Refer them to High Road and earn $500 when they complete 90 days in the program.
          </p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BENEFITS.map((benefit) => (
              <div key={benefit.title} className="text-center p-6">
                <div className="w-14 h-14 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="h-7 w-7 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                1
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Submit a Referral</h3>
              <p className="text-gray-600 text-sm">
                Fill out the form below with your info and the driver&apos;s contact details.
              </p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                2
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">They Apply & Get Approved</h3>
              <p className="text-gray-600 text-sm">
                We reach out to your referral and help them through the application process.
              </p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                3
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">You Get Paid</h3>
              <p className="text-gray-600 text-sm">
                Once they complete 90 days, you receive your $500 bonus. No limits!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Referral Form */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Submit a Referral</h2>
          <p className="text-center text-gray-600 mb-8">
            Fill out the form below and we&apos;ll take it from there.
          </p>

          {isSuccess ? (
            <div className="bg-white rounded-lg shadow-soft p-8 text-center animate-fade-in-up">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Referral Submitted!</h3>
              <p className="text-gray-600 mb-6">
                Thanks for the referral! We&apos;ll reach out to them shortly. You&apos;ll receive an email confirmation.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="outline" onClick={() => setIsSuccess(false)}>
                  Submit Another
                </Button>
                <Link href="/">
                  <Button>
                    Return Home
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-soft p-6 sm:p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Your Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Information</h3>
                  <div className="space-y-4">
                    <Input
                      label="Your Name"
                      placeholder="John Doe"
                      error={errors.referrer_name?.message}
                      {...register('referrer_name')}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Your Email"
                        type="email"
                        placeholder="john@email.com"
                        error={errors.referrer_email?.message}
                        {...register('referrer_email')}
                      />
                      <Input
                        label="Your Phone"
                        type="tel"
                        placeholder="(555) 123-4567"
                        error={errors.referrer_phone?.message}
                        {...register('referrer_phone')}
                      />
                    </div>
                  </div>
                </div>

                {/* Driver Info */}
                <div className="pt-4 border-t">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Driver You&apos;re Referring</h3>
                  <div className="space-y-4">
                    <Input
                      label="Driver's Name"
                      placeholder="Jane Smith"
                      error={errors.driver_name?.message}
                      {...register('driver_name')}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Driver's Phone"
                        type="tel"
                        placeholder="(555) 987-6543"
                        error={errors.driver_phone?.message}
                        {...register('driver_phone')}
                      />
                      <Input
                        label="Driver's Email (optional)"
                        type="email"
                        placeholder="jane@email.com"
                        error={errors.driver_email?.message}
                        {...register('driver_email')}
                      />
                    </div>
                    <Select
                      label="How do you know this driver?"
                      placeholder="Select relationship"
                      options={RELATIONSHIPS}
                      error={errors.relationship?.message}
                      {...register('relationship')}
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Referral
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </>
                  )}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  By submitting, you confirm you have permission to share this driver&apos;s contact information.
                </p>
              </form>
            </div>
          )}
          </div>
        </div>
      </section>
    </>
  )
}
