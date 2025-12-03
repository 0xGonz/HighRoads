interface PageHeroProps {
  title: string
  subtitle?: string
  className?: string
}

export function PageHero({ title, subtitle, className = '' }: PageHeroProps) {
  return (
    <section className={`bg-primary-700 text-white py-16 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
        {subtitle && (
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">{subtitle}</p>
        )}
      </div>
    </section>
  )
}
