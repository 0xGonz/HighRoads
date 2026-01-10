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
    <section className="py-16 lg:py-20 bg-primary-800 text-white relative overflow-hidden">
      {/* Clean gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-800 via-primary-800 to-primary-900" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            Program Overview
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            What to expect from our performance-based ownership program
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {programDetails.map((detail) => (
            <div
              key={detail.title}
              className="group bg-white/[0.08] backdrop-blur-sm rounded-2xl p-7 border border-white/10
                transition-all duration-300 ease-out
                hover:bg-white/[0.12] hover:border-white/20 hover:-translate-y-1"
            >
              <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center mb-5
                transition-all duration-300
                group-hover:bg-white/15 group-hover:scale-110">
                <detail.icon className="h-7 w-7 text-accent-400 transition-colors group-hover:text-accent-300" />
              </div>
              <h3 className="font-display font-bold text-lg mb-2">{detail.title}</h3>
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
