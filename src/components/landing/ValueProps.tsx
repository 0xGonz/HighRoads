import { DollarSign, Building2, HeartHandshake, TrendingUp } from 'lucide-react'
import { COMPANY, PROGRAM } from '@/lib/config'

const values = [
  {
    icon: TrendingUp,
    title: 'Performance-Based Ownership',
    description: `Earn ownership through ${PROGRAM.profitSplit}/${PROGRAM.profitSplit} profit-split. The better you perform, the faster you own. High performers can own in as little as 1 year.`,
  },
  {
    icon: DollarSign,
    title: 'No Barriers to Entry',
    description: 'No credit check required. No down payment. No balloon payments. No buyout tricks. Ownership is earned through performance, not debt.',
  },
  {
    icon: Building2,
    title: 'Approved Carrier Network',
    description: 'Access to carrier partners who provide freight, fuel cards, insurance, ELD, and compliance support based on your preferences.',
  },
  {
    icon: HeartHandshake,
    title: 'Full Maintenance Included',
    description: `${PROGRAM.truckModels} trucks serviced by ${COMPANY.truckPartner}. Full maintenance, repairs, ELD, and ongoing support included.`,
  },
]

export function ValueProps() {
  return (
    <section className="py-12 lg:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-primary-800 mb-3">
            Why Choose {COMPANY.shortName}?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            A performance-based ownership program built for drivers who want a clear, fair path to owning their truck.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value) => (
            <div
              key={value.title}
              className="bg-white rounded-lg p-6 border border-gray-200"
            >
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <value.icon className="h-6 w-6 text-primary-700" />
              </div>
              <h3 className="text-lg font-bold text-primary-800 mb-2">
                {value.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
