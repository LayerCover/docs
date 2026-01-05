import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import type { DocPage } from '@/lib/content/loader'

interface PrevNextProps {
  prev: DocPage | null
  next: DocPage | null
}

export function PrevNext({ prev, next }: PrevNextProps) {
  if (!prev && !next) return null

  return (
    <div className="grid grid-cols-2 gap-4 mt-12 pt-8 border-t border-border">
      {prev ? (
        <Link
          href={prev.slug.length ? `/${prev.slug.join('/')}` : '/'}
          className="flex items-center gap-3 rounded-lg border border-border p-4 hover:bg-accent transition-colors group"
        >
          <ArrowLeft className="h-5 w-5 flex-shrink-0 text-muted-foreground group-hover:text-foreground" />
          <div className="min-w-0">
            <div className="text-sm text-muted-foreground mb-1">Previous</div>
            <div className="font-medium truncate">{prev.frontmatter.title}</div>
          </div>
        </Link>
      ) : (
        <div />
      )}
      {next && (
        <Link
          href={next.slug.length ? `/${next.slug.join('/')}` : '/'}
          className="flex items-center justify-end gap-3 rounded-lg border border-border p-4 hover:bg-accent transition-colors text-right group"
        >
          <div className="min-w-0">
            <div className="text-sm text-muted-foreground mb-1">Next</div>
            <div className="font-medium truncate">{next.frontmatter.title}</div>
          </div>
          <ArrowRight className="h-5 w-5 flex-shrink-0 text-muted-foreground group-hover:text-foreground" />
        </Link>
      )}
    </div>
  )
}
