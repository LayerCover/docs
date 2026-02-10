'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, FileText, BookOpen } from 'lucide-react'

const papers = [
    {
        title: 'Whitepaper',
        description: 'Full technical specification',
        href: 'https://whitepaper.layercover.com/Whitepaper.pdf',
        icon: FileText,
    },
    {
        title: 'Litepaper',
        description: 'High-level protocol overview',
        href: 'https://litepaper.layercover.com/Litepaper.pdf',
        icon: BookOpen,
    },
]

export function PapersDropdown() {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="hidden sm:inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
                Papers
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-border bg-background shadow-lg ring-1 ring-black/5 dark:ring-white/5 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                    {papers.map((paper) => (
                        <a
                            key={paper.title}
                            href={paper.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setIsOpen(false)}
                            className="flex items-start gap-3 px-4 py-3 hover:bg-muted transition-colors no-underline"
                        >
                            <paper.icon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                            <div>
                                <div className="text-sm font-medium text-foreground">{paper.title}</div>
                                <div className="text-xs text-muted-foreground">{paper.description}</div>
                            </div>
                        </a>
                    ))}
                </div>
            )}
        </div>
    )
}
