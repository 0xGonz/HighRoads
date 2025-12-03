import { ClipboardCheck, Truck, Award } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: ClipboardCheck,
    title: 'Apply Online',
    description: 'Complete our simple online application in just a few minutes. We\'ll review your qualifications and get back to you quickly.',
  },
  {
    number: '02',
    icon: Truck,
    title: 'Choose Your Truck',
    description: 'Once approved, browse our inventory and select the truck that\'s right for your business. Schedule a time to see it in person.',
  },
  {
    number: '03',
    icon: Award,
    title: 'Start Driving',
    description: 'Get matched with a carrier, complete your training, and hit the road. You\'re on your way to truck ownership.',
  },
]

export function HowItWorks() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header - no entrance animation */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-700 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Getting started is easy. Follow these simple steps to begin your journey to truck ownership.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {/* Static connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary-300 to-accent/50" />
              )}

              {/* Card with hover effects only */}
              <div className="relative bg-white rounded-xl p-8 text-center group transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
                <div className="relative inline-block mb-6">
                  {/* Icon circle - hover only */}
                  <div className="w-20 h-20 bg-primary-700 rounded-full flex items-center justify-center mx-auto transition-transform duration-200 group-hover:scale-105">
                    <step.icon className="h-10 w-10 text-white" />
                  </div>
                  {/* Number badge */}
                  <span className="absolute -top-2 -right-2 w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-primary-700 mb-3 transition-colors duration-200 group-hover:text-accent">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
