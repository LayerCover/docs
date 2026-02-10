'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useTheme } from 'next-themes'

// Config for mermaid
const DEFAULT_CONFIG = {
  startOnLoad: false,
  securityLevel: 'loose' as const,
  fontFamily: '"Trebuchet MS", "Lucida Grande", "Lucida Sans Unicode", "Lucida Sans", Tahoma, sans-serif',
}

export function Mermaid({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [svg, setSvg] = useState<string>('')
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  // Handle mounting for theme
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const renderChart = async () => {
      if (!ref.current) return

      try {
        // Dynamically import mermaid only on the client side
        const mermaid = (await import('mermaid')).default

        const isDark = resolvedTheme === 'dark'

        mermaid.initialize({
          ...DEFAULT_CONFIG,
          theme: isDark ? 'dark' : 'base',
          flowchart: {
            useMaxWidth: false,
            htmlLabels: true,
            padding: 15,
            nodeSpacing: 30,
            rankSpacing: 50,
          },
          themeVariables: isDark ? {
            darkMode: true,
            background: '#1e293b',
            mainBkg: '#1e293b',
            primaryColor: '#38bdf8',
            primaryTextColor: '#f1f5f9',
            primaryBorderColor: '#38bdf8',
            lineColor: '#94a3b8',
            secondaryColor: '#334155',
            tertiaryColor: '#1e293b',
          } : {
            darkMode: false,
            background: '#ffffff',
            mainBkg: '#ffffff',
            primaryColor: '#0ea5e9',
            primaryTextColor: '#1e293b',
            primaryBorderColor: '#0ea5e9',
            lineColor: '#64748b',
            secondaryColor: '#f1f5f9',
            tertiaryColor: '#e2e8f0',
          }
        })

        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`
        // @ts-ignore - mermaid types might be slightly off for render param
        const { svg } = await mermaid.render(id, chart)
        setSvg(svg)
      } catch (error) {
        console.error('Failed to render mermaid chart:', error)
        if (ref.current) {
          ref.current.innerHTML = `<pre class="text-sm text-red-500 p-4">${error instanceof Error ? error.message : 'Failed to render diagram'}\n\n${chart}</pre>`
        }
      }
    }

    renderChart()
  }, [chart, mounted, resolvedTheme])

  // Close on Escape key
  useEffect(() => {
    if (!isExpanded) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsExpanded(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isExpanded])

  const handleExpand = useCallback(() => {
    if (svg) setIsExpanded(true)
  }, [svg])

  if (!mounted) {
    return null
  }

  return (
    <>
      {/* Inline diagram with click hint */}
      <div
        className="mermaid-container my-8 relative group cursor-pointer"
        onClick={handleExpand}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleExpand() }}
        aria-label="Click to expand diagram"
      >
        <div
          ref={ref}
          className="flex justify-center overflow-x-auto"
          dangerouslySetInnerHTML={svg ? { __html: svg } : undefined}
        />
        {svg && (
          <div className="absolute inset-0 flex items-end justify-center pb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <span className="text-xs px-3 py-1.5 rounded-full bg-foreground/80 text-background backdrop-blur-sm font-medium shadow-lg">
              🔍 Click to expand
            </span>
          </div>
        )}
      </div>

      {/* Fullscreen modal */}
      {isExpanded && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setIsExpanded(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Expanded diagram view"
        >
          <div
            className="relative w-[95vw] h-[90vh] bg-background rounded-2xl shadow-2xl border border-border overflow-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setIsExpanded(false)}
              className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-muted hover:bg-muted/80 text-foreground transition-colors text-lg font-bold"
              aria-label="Close expanded view"
            >
              ×
            </button>

            {/* Expanded SVG */}
            <div
              className="w-full h-full flex items-center justify-center mermaid-expanded"
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          </div>
        </div>
      )}

      <style jsx global>{`
        .mermaid-expanded svg {
          max-width: 100%;
          max-height: 100%;
          width: auto;
          height: auto;
        }
        .mermaid-container svg foreignObject {
          overflow: visible;
        }
        .mermaid-container svg foreignObject div {
          overflow: visible !important;
        }
        .mermaid-container svg .cluster-label foreignObject {
          overflow: visible;
        }
      `}</style>
    </>
  )
}
