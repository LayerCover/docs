import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import type { DocPage } from '@/lib/content/loader'

interface BreadcrumbsProps {
  slug: string[]
  doc: DocPage
}

export function Breadcrumbs({ slug, doc }: BreadcrumbsProps) {
  const parts = slug

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
      <Link href="/" className="hover:text-foreground transition-colors">
        Home
      </Link>
      {parts.length === 0 ? (
        <div className="flex items-center space-x-2">
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">
            {doc.frontmatter.title}
          </span>
        </div>
      ) : (
        parts.map((part, i) => (
          <div key={i} className="flex items-center space-x-2">
            <ChevronRight className="h-4 w-4" />
            {i === parts.length - 1 ? (
              <span className="text-foreground font-medium">
                {doc.frontmatter.title}
              </span>
            ) : (
              <Link
                href={`/${parts.slice(0, i + 1).join('/')}`}
                className="hover:text-foreground capitalize transition-colors"
              >
                {part}
              </Link>
            )}
          </div>
        ))
      )}
    </nav>
  )
}
