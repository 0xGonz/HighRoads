'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
}

// Map of path segments to labels
const pathLabels: Record<string, string> = {
  admin: 'Dashboard',
  applicants: 'Applicants',
  pipeline: 'Pipeline',
  communications: 'Communications',
  templates: 'Templates',
  automations: 'Automations',
  calendar: 'Calendar',
  availability: 'Availability',
  settings: 'Settings',
}

export function Breadcrumbs() {
  const pathname = usePathname()

  // Don't show breadcrumbs on the main admin dashboard
  if (pathname === '/admin') {
    return null
  }

  const segments = pathname.split('/').filter(Boolean)

  // Build breadcrumb items
  const items: BreadcrumbItem[] = []
  let currentPath = ''

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i]
    currentPath += `/${segment}`

    // Skip showing 'admin' as a breadcrumb, but use it as root
    if (segment === 'admin') {
      items.push({ label: 'Dashboard', href: '/admin' })
      continue
    }

    // Check if this is a dynamic segment (like an ID)
    const isDynamic = segment.length > 10 || segment.includes('-')

    if (isDynamic) {
      // For dynamic segments, we'll get the label from the page itself
      // For now, show a placeholder that will be replaced
      items.push({ label: 'Details' })
    } else {
      const label = pathLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)
      const isLast = i === segments.length - 1
      items.push({
        label,
        href: isLast ? undefined : currentPath
      })
    }
  }

  // Don't show if only one item (the dashboard)
  if (items.length <= 1) {
    return null
  }

  return (
    <nav className="flex items-center gap-1 text-sm mb-4">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-1">
          {index > 0 && (
            <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
          )}
          {item.href ? (
            <Link
              href={item.href}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              {index === 0 ? (
                <span className="flex items-center gap-1">
                  <Home className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </span>
              ) : (
                item.label
              )}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}

// Standalone component for custom breadcrumbs (e.g., with applicant name)
interface CustomBreadcrumbsProps {
  items: BreadcrumbItem[]
}

export function CustomBreadcrumbs({ items }: CustomBreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-1 text-sm mb-4">
      <Link
        href="/admin"
        className="text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-1"
      >
        <Home className="h-4 w-4" />
        <span className="hidden sm:inline">Dashboard</span>
      </Link>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-1">
          <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
          {item.href ? (
            <Link
              href={item.href}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}
