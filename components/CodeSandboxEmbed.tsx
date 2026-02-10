'use client'

import { useState } from 'react'

interface CodeSandboxEmbedProps {
    url: string
    title?: string
    height?: number
}

export function CodeSandboxEmbed({
    url,
    title = 'Live Example',
    height = 500,
}: CodeSandboxEmbedProps) {
    const [loaded, setLoaded] = useState(false)

    // Support both CodeSandbox and StackBlitz URLs
    const embedUrl = url.includes('codesandbox.io')
        ? url.replace('/s/', '/embed/') + '?fontsize=14&hidenavigation=1&theme=dark&view=preview'
        : url.includes('stackblitz.com')
            ? url.replace('/edit/', '/embed/') + '?embed=1&file=src/App.tsx&theme=dark'
            : url

    return (
        <div className="rounded-xl border border-border overflow-hidden my-8 not-prose">
            <div className="flex items-center gap-2 px-4 py-3 bg-muted border-b border-border">
                <span className="text-sm">⚡</span>
                <span className="text-sm font-medium text-foreground">{title}</span>
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto text-xs text-muted-foreground hover:text-foreground transition-colors no-underline"
                >
                    Open in new tab ↗
                </a>
            </div>
            {/* eslint-disable-next-line react-dom/no-unsafe-inline-style */}
            <div className="relative w-full" style={{ height }}>
                {!loaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-muted">
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                            <span className="text-sm text-muted-foreground">Loading sandbox...</span>
                        </div>
                    </div>
                )}
                <iframe
                    src={embedUrl}
                    title={title}
                    className="w-full h-full border-0"
                    allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
                    sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
                    onLoad={() => setLoaded(true)}
                />
            </div>
        </div>
    )
}
