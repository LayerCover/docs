'use client'
// Client-side only: relies on DOM APIs and window messaging for dynamic sizing.

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface ResponsiveIframeProps extends React.IframeHTMLAttributes<HTMLIFrameElement> {
    src: string
    title: string
    className?: string
    initialHeight?: number
}

export function ResponsiveIframe({ src, title, className, initialHeight = 600, ...props }: ResponsiveIframeProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null)
    const [height, setHeight] = useState<number>(initialHeight)

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (iframeRef.current && event.source === iframeRef.current.contentWindow) {
                if (event.data && event.data.type === 'iframe-resize' && typeof event.data.height === 'number') {
                    // Add a small buffer to prevent scrollbars
                    setHeight(event.data.height + 0)
                }
            }
        }

        window.addEventListener('message', handleMessage)
        return () => window.removeEventListener('message', handleMessage)
    }, [])

    return (
        <div className={cn("w-full overflow-hidden rounded-xl border border-border shadow-sm", className)}>
            <iframe
                ref={iframeRef}
                src={src}
                title={title}
                width="100%"
                height={height}
                style={{ border: 0, overflow: 'hidden' }}
                scrolling="no"
                {...props}
            />
        </div>
    )
}
