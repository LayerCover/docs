'use client'

import { useEffect, useRef, useState } from 'react'
import { useTheme } from 'next-themes'

let mermaidInitialized = false

export function Mermaid({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [svg, setSvg] = useState<string>('')
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

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

        // Initialize mermaid
        if (!mermaidInitialized) {
          mermaid.initialize({
            startOnLoad: false,
            theme: 'base',
            themeVariables: {
              primaryColor: '#0ea5e9',
              primaryTextColor: '#1e293b',
              primaryBorderColor: '#0ea5e9',
              lineColor: '#64748b',
              secondaryColor: '#f1f5f9',
              tertiaryColor: '#e2e8f0',
              background: '#ffffff',
              mainBkg: '#ffffff',
              secondBkg: '#f8fafc',
              tertiaryBkg: '#f1f5f9',
              textColor: '#1e293b',
              fontSize: '14px',
              fontFamily: 'ui-sans-serif, system-ui, sans-serif',
            },
            securityLevel: 'loose',
            fontFamily: 'inherit',
          })
          mermaidInitialized = true
        }

        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`
        const { svg } = await mermaid.render(id, chart)
        setSvg(svg)
      } catch (error) {
        console.error('Failed to render mermaid chart:', error)
        // Fallback: show the raw chart code
        if (ref.current) {
          ref.current.innerHTML = `<pre class="text-sm text-red-500 p-4">${error instanceof Error ? error.message : 'Failed to render diagram'}\n\n${chart}</pre>`
        }
      }
    }

    renderChart()
  }, [chart, mounted, resolvedTheme])

  if (!mounted) {
    return null
  }

  return (
    <div
      ref={ref}
      className="mermaid-container my-8 flex justify-center overflow-x-auto"
      dangerouslySetInnerHTML={svg ? { __html: svg } : undefined}
    />
  )
}
