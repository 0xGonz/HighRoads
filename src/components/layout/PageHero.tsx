interface PageHeroProps {
  title: string
  subtitle?: string
  className?: string
}

export function PageHero({ title, subtitle, className = '' }: PageHeroProps) {
  return (
    <section className={`bg-gradient-to-br from-primary-800 to-primary-900 text-white py-16 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{title}</h1>
          {subtitle && (
            <p className="text-lg text-primary-200 mt-3">{subtitle}</p>
          )}
        </div>
      </div>
    </section>
  )
}
