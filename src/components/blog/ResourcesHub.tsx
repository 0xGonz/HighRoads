'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, BookOpen, Calculator } from 'lucide-react'
import { blogArticles, getFeaturedArticles } from '@/lib/blog'
import { OwnershipCalculator } from '@/components/calculator/OwnershipCalculator'

export function ResourcesHub() {
  const searchParams = useSearchParams()
  const tabParam = searchParams.get('tab')
  const [activeTab, setActiveTab] = useState<'articles' | 'calculator'>(
    tabParam === 'calculator' ? 'calculator' : 'articles'
  )

  useEffect(() => {
    if (tabParam === 'calculator') {
      setActiveTab('calculator')
    }
  }, [tabParam])
  const featuredArticles = getFeaturedArticles()
  const guides = blogArticles.filter((a) => a.category === 'guides' && !a.featured)
  const tips = blogArticles.filter((a) => a.category === 'tips')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-2xl md:text-3xl font-bold">Resources</h1>
            <p className="text-primary-200 mt-2">
              Guides, articles, and tools for owner-operators.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('articles')}
              className={`flex items-center py-4 border-b-2 font-medium text-sm ${
                activeTab === 'articles'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Articles & Guides
            </button>
            <button
              onClick={() => setActiveTab('calculator')}
              className={`flex items-center py-4 border-b-2 font-medium text-sm ${
                activeTab === 'calculator'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Calculator className="h-4 w-4 mr-2" />
              Ownership Calculator
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'articles' ? (
        <>
          {/* Featured Section */}
          {featuredArticles.length > 0 && (
            <div className="bg-white border-b border-gray-200 py-10">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-6">
                  Featured
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {featuredArticles.slice(0, 2).map((article) => (
                    <Link
                      key={article.slug}
                      href={`/resources/${article.slug}`}
                      className="group block p-5 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                        {article.excerpt}
                      </p>
                      <span className="inline-flex items-center text-primary-600 font-medium mt-3 text-sm">
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
          <div className="py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Guides */}
              {guides.length > 0 && (
                <section className="mb-10">
                  <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 pb-2 border-b border-gray-200">
                    Guides
                  </h2>
                  <div className="space-y-4">
                    {guides.map((article) => (
                      <Link
                        key={article.slug}
                        href={`/resources/${article.slug}`}
                        className="block group"
                      >
                        <h3 className="text-base font-semibold text-gray-900 group-hover:text-primary-600">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 mt-1 text-sm">
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
                  <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 pb-2 border-b border-gray-200">
                    Tips &amp; How-To
                  </h2>
                  <div className="space-y-4">
                    {tips.map((article) => (
                      <Link
                        key={article.slug}
                        href={`/resources/${article.slug}`}
                        className="block group"
                      >
                        <h3 className="text-base font-semibold text-gray-900 group-hover:text-primary-600">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 mt-1 text-sm">
                          {article.excerpt}
                        </p>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-primary-800 mb-3">
                  Your Path to Ownership
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  See exactly how our lease-to-own program works. Adjust the sliders below to see your personalized timeline to truck ownership.
                </p>
              </div>
              <OwnershipCalculator />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
