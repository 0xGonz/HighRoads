import { Metadata } from 'next'
import { PageHero } from '@/components/layout/PageHero'
import { COMPANY, PRIVACY_POLICY } from '@/lib/config'

export const metadata: Metadata = {
  title: 'Privacy Policy | High Road Capital LLC',
  description: 'High Road Capital LLC Privacy Policy - Learn how we collect, use, store, and protect your information.',
}

export default function PrivacyPage() {
  return (
    <div>
      <PageHero
        title="Privacy Policy"
        subtitle={`${COMPANY.name} — Privacy Policy`}
      />

      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-gray-500 mb-8">
            Last Updated: {PRIVACY_POLICY.lastUpdated}
          </p>

          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-8">
              {COMPANY.name} (&quot;HRC,&quot; &quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy.
              This Privacy Policy explains how we collect, use, store, and protect your information
              when you visit our website, apply for our program, or communicate with us.
            </p>

            <div className="space-y-10">
              {PRIVACY_POLICY.sections.map((section, index) => (
                <div key={index}>
                  <h2 className="text-xl font-bold text-primary-800 mb-4">{section.title}</h2>
                  <p className="text-gray-600 leading-relaxed">{section.content}</p>
                </div>
              ))}

              {/* Contact Section */}
              <div>
                <h2 className="text-xl font-bold text-primary-800 mb-4">Contact Us</h2>
                <p className="text-gray-600 leading-relaxed">
                  If you have any questions about this Privacy Policy, please contact {COMPANY.name} at{' '}
                  <a
                    href={`mailto:${COMPANY.supportEmail}`}
                    className="text-primary-700 hover:underline"
                  >
                    {COMPANY.supportEmail}
                  </a>{' '}
                  or through the contact form on this website.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
