import { Truck, MapPin, Package } from 'lucide-react'

export function CarrierLogos() {
  return (
    <section className="py-12 lg:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Carrier Matching
        </h2>
        <p className="text-gray-600 mb-10 max-w-2xl mx-auto">
          We work with regional and national carriers across the Southeast and nationwide.
          During your application, we&apos;ll discuss options that match your freight preferences and home time needs.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <Truck className="h-8 w-8 text-primary-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">OTR & Regional</h3>
            <p className="text-sm text-gray-500">Long-haul and regional routes available</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            <Package className="h-8 w-8 text-primary-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Freight Types</h3>
            <p className="text-sm text-gray-500">Dry van, reefer, and flatbed options</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            <MapPin className="h-8 w-8 text-primary-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Home Time</h3>
            <p className="text-sm text-gray-500">Routes matched to your preferences</p>
          </div>
        </div>
      </div>
    </section>
  )
}
