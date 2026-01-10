import { Shield, MapPin, FileText, Truck } from 'lucide-react'

const badges = [
  {
    icon: Shield,
    title: 'FMCSA Compliant',
    description: 'Working with registered carriers',
  },
  {
    icon: MapPin,
    title: 'North Charleston, SC',
    description: 'South Carolina-based team',
  },
  {
    icon: Truck,
    title: '2020+ Model Trucks',
    description: 'Quality equipment available',
  },
  {
    icon: FileText,
    title: 'No Balloon Payment',
    description: 'All terms in writing upfront',
  },
]

export function TrustBadges() {
  return (
    <section className="py-10 lg:py-12 bg-gray-50 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {badges.map((badge) => (
            <div
              key={badge.title}
              className="group flex flex-col items-center text-center px-2"
            >
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-3 shadow-soft
                transition-all duration-300 group-hover:shadow-soft-lg group-hover:scale-105">
                <badge.icon className="h-6 w-6 text-primary-700 transition-colors group-hover:text-primary-600" />
              </div>
              <h3 className="font-semibold text-sm text-gray-900">{badge.title}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
