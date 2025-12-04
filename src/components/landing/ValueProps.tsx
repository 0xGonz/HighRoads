import { DollarSign, Building2, HeartHandshake, TrendingUp } from 'lucide-react'

const values = [
  {
    icon: DollarSign,
    title: 'Flexible Payments',
    description: 'Weekly payments that work with your schedule. No large upfront costs, no credit check required.',
  },
  {
    icon: Building2,
    title: 'Top-Paying Carriers',
    description: 'Access to premium carrier partners offering competitive rates and consistent freight.',
  },
  {
    icon: HeartHandshake,
    title: 'Full Support',
    description: 'Comprehensive training, mentorship, and 24/7 support to help you succeed every step of the way.',
  },
  {
    icon: TrendingUp,
    title: 'Build Equity',
    description: 'Every payment brings you closer to ownership. Build wealth while doing what you love.',
  },
]

export function ValueProps() {
  return (
    <section className="py-24 lg:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="font-display tracking-heading text-3xl md:text-4xl font-bold text-primary-700 mb-5">
            Why Choose High Road?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            We&apos;re not just a lease program. We&apos;re your partners in building a successful trucking business.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value) => (
            <div
              key={value.title}
              className="bg-white rounded-xl p-8 lg:p-10 shadow-soft border border-gray-100/80 hover:shadow-soft-lg hover:scale-[1.02] hover:border-accent/20 transition-all duration-300 ease-smooth"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-accent/20 to-accent/5 rounded-xl flex items-center justify-center mb-6">
                <value.icon className="h-7 w-7 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-primary-700 mb-3">
                {value.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
