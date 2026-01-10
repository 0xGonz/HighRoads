import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getArticleBySlug, blogArticles } from '@/lib/blog'
import { ArticleContent } from '@/components/blog/ArticleContent'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const article = getArticleBySlug(slug)

  if (!article) {
    return { title: 'Article Not Found' }
  }

  return {
    title: `${article.title} | High Road Capital LLC`,
    description: article.excerpt,
  }
}

export async function generateStaticParams() {
  return blogArticles.map((article) => ({
    slug: article.slug,
  }))
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params
  const article = getArticleBySlug(slug)

  if (!article) {
    notFound()
  }

  // Get related articles (same category, excluding current)
  const relatedArticles = blogArticles
    .filter((a) => a.category === article.category && a.slug !== article.slug)
    .slice(0, 2)

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-primary-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Link
              href="/resources"
              className="inline-flex items-center text-primary-300 hover:text-white text-sm transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Resources
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold mt-4 tracking-tight">
              {article.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <ArticleContent content={article.content} />
          </div>
        </div>
      </div>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <div className="border-t border-gray-200 py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-6">
              Keep reading
            </h2>
            <div className="space-y-5">
              {relatedArticles.map((related) => (
                <Link
                  key={related.slug}
                  href={`/resources/${related.slug}`}
                  className="block group"
                >
                  <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                    {related.title}
                  </h3>
                  <p className="text-gray-600 mt-1 text-sm">
                    {related.excerpt}
                  </p>
                </Link>
              ))}
            </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
