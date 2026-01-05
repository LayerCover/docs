'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface TOCProps {
  headings: { id: string; text: string; level: number }[]
}

export function RightTOC({ headings }: TOCProps) {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-100px 0px -66%' }
    )

    headings.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  return (
    <aside className="hidden xl:block w-64 flex-shrink-0">
      <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto py-8 pl-4">
        <h4 className="font-semibold text-sm mb-4">On This Page</h4>
        <nav>
          <ul className="space-y-2 text-sm">
            {headings.map((heading) => (
              <li
                key={heading.id}
                style={{ paddingLeft: `${(heading.level - 2) * 12}px` }}
              >
                <a
                  href={`#${heading.id}`}
                  className={cn(
                    'block py-1 text-muted-foreground hover:text-foreground transition-colors border-l-2 border-transparent pl-3',
                    activeId === heading.id &&
                      'border-brand-500 text-brand-600 dark:text-brand-400 font-medium'
                  )}
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  )
}
