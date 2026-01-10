'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { blogArticles, getFeaturedArticles } from '@/lib/blog'

export function ResourcesHub() {
  const featuredArticles = getFeaturedArticles()
  const guides = blogArticles.filter((a) => a.category === 'guides' && !a.featured)
  const tips = blogArticles.filter((a) => a.category === 'tips')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Resources</h1>
            <p className="text-primary-200 mt-3 text-lg">
              Guides and articles for owner-operators.
            </p>
          </div>
        </div>
      </div>

      {/* Featured Section */}
      {featuredArticles.length > 0 && (
        <div className="bg-white border-b border-gray-200 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-6">
              Featured
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {featuredArticles.slice(0, 2).map((article) => (
                <Link
                  key={article.slug}
                  href={`/resources/${article.slug}`}
                  className="group block p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 mt-2 leading-relaxed">
                    {article.excerpt}
                  </p>
                  <span className="inline-flex items-center text-primary-600 font-medium mt-4 text-sm">
                    Read article
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* All Articles */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Guides */}
          {guides.length > 0 && (
            <section className="mb-12">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-6 pb-3 border-b border-gray-200">
                Guides
              </h2>
              <div className="space-y-6">
                {guides.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/resources/${article.slug}`}
                    className="block group"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 mt-1">
                      {article.excerpt}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Tips */}
          {tips.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-6 pb-3 border-b border-gray-200">
                Tips &amp; How-To
              </h2>
              <div className="space-y-6">
                {tips.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/resources/${article.slug}`}
                    className="block group"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 mt-1">
                      {article.excerpt}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
