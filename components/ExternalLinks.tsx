'use client'

import { ExternalLink } from 'lucide-react'

interface LinkBanner {
  title: string
  url: string
  description: string
  icon?: string
}

interface LinkSection {
  title: string
  links: LinkBanner[]
}

interface ExternalLinksProps {
  sections: LinkSection[]
}

export function ExternalLinks({ sections }: ExternalLinksProps) {
  return (
    <div className="space-y-10">
      {sections.map((section, idx) => (
        <div key={idx} className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">{section.title}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {section.links.map((link, linkIdx) => (
              <a
                key={linkIdx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden rounded-lg border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50 hover:bg-card/80"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      {link.icon && (
                        <span className="text-2xl" aria-hidden="true">
                          {link.icon}
                        </span>
                      )}
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {link.title}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {link.description}
                    </p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                </div>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
