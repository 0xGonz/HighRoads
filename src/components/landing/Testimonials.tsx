import { Clock, DollarSign, Wrench } from 'lucide-react'
import { PROGRAM, COMPANY } from '@/lib/config'

const programDetails = [
  {
    icon: Clock,
    title: 'Ownership Timeline',
    description: `Ownership is earned based on performance. At $1,000/week to HRC = 3 years. At $1,500/week = 2 years. At $2,000/week = just 1 year. The better you perform, the faster you own.`,
  },
  {
    icon: DollarSign,
    title: `${PROGRAM.profitSplit}/${PROGRAM.profitSplit} Profit Split`,
    description: `After the ${PROGRAM.provingGroundWeeks}-week Proving Ground, net revenue is split ${PROGRAM.profitSplit}% to you and ${PROGRAM.profitSplit}% to ${COMPANY.shortName}. No balloon payment. Title transfers when complete.`,
  },
  {
    icon: Wrench,
    title: 'What You Get',
    description: `${PROGRAM.truckModels} serviced by ${COMPANY.truckPartner}. Full maintenance, repairs, insurance, fuel cards, ELD, and compliance support included.`,
  },
]

export function Testimonials() {
  return (
    <section className="py-12 lg:py-16 bg-primary-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Program Overview
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            What to expect from our performance-based ownership program
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {programDetails.map((detail) => (
            <div
              key={detail.title}
              className="bg-white/10 rounded-lg p-6 border border-white/20"
            >
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mb-4">
                <detail.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">{detail.title}</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                {detail.description}
              </p>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 mt-10 max-w-xl mx-auto">
          Individual results vary based on performance and carrier earnings.
          All terms are provided in writing before you sign.
        </p>
      </div>
    </section>
  )
}
