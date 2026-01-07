'use client'

import { useState, useEffect, useCallback, useRef, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Search, X, FileText, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface SearchResult {
    title: string
    slug: string
    excerpt: string
    section?: string
}

// Static search index - in production this would be loaded from a JSON file
const SEARCH_INDEX: SearchResult[] = [
    // Concepts
    { title: 'Core Concepts', slug: '/concepts', excerpt: 'The fundamental architecture of LayerCover', section: 'Concepts' },
    { title: 'Buying Cover', slug: '/concepts/buying-cover', excerpt: 'Purchase protection for your crypto assets', section: 'Concepts' },
    { title: 'Fixed Rate Cover', slug: '/concepts/buying-cover/fixed-rate-cover', excerpt: 'Lock in rates with fixed-term policies', section: 'Concepts' },
    { title: 'Filing a Claim', slug: '/concepts/buying-cover/claims-payouts', excerpt: 'How to file claims and receive payouts', section: 'Concepts' },
    { title: 'Core Underwriting', slug: '/concepts/underwriting/core-concepts', excerpt: 'Underwriting fundamentals and capital deployment', section: 'Underwriting' },
    { title: 'Syndicates', slug: '/concepts/underwriting/syndicates', excerpt: 'Managed underwriting vaults', section: 'Underwriting' },
    { title: 'Paying Claims', slug: '/concepts/underwriting/paying-claims', excerpt: 'How claims affect underwriter capital', section: 'Underwriting' },
    { title: 'Risk Assessment', slug: '/concepts/underwriting/risk-assessment', excerpt: 'Risk points, mutex groups, and pool ratings', section: 'Underwriting' },
    { title: 'Intent-Based Pricing', slug: '/concepts/pricing/intent-based', excerpt: 'How quotes and premiums work', section: 'Pricing' },
    { title: 'Reinsurance', slug: '/concepts/reinsurance', excerpt: 'Protocol-native reinsurance and CAT pool', section: 'Concepts' },
    { title: 'Governance', slug: '/concepts/governance', excerpt: 'Protocol governance and administration', section: 'Governance' },
    { title: 'Referrals', slug: '/concepts/referrals', excerpt: 'Earn rewards for referring users', section: 'Concepts' },
    // Resources
    { title: 'Glossary', slug: '/resources/glossary', excerpt: 'Comprehensive terms and definitions', section: 'Resources' },
    { title: 'FAQ', slug: '/resources/faq', excerpt: 'Frequently asked questions', section: 'Resources' },
    { title: 'Contract Addresses', slug: '/resources/contract-addresses', excerpt: 'Deployed contract addresses by network', section: 'Resources' },
    { title: 'Pool Parameters', slug: '/resources/parameters', excerpt: 'Live configuration from deployed contracts', section: 'Resources' },
    { title: 'Audits', slug: '/resources/audits', excerpt: 'Security audit information', section: 'Resources' },
    // Technical
    { title: 'Policy System', slug: '/technical-reference/policy-system', excerpt: 'Policy NFT technical details', section: 'Technical' },
    { title: 'Syndicate System', slug: '/technical-reference/syndicate-system', excerpt: 'Syndicate vault architecture', section: 'Technical' },
    { title: 'Payout System', slug: '/technical-reference/payout-system', excerpt: 'Claim processing and payout mechanics', section: 'Technical' },
    // Guides
    { title: 'User Guides', slug: '/guides', excerpt: 'Step-by-step guides for using LayerCover', section: 'Guides' },
    // SDK
    { title: 'SDK Integration', slug: '/sdk', excerpt: 'Integrate LayerCover insurance into your dApp', section: 'SDK' },
    { title: 'React Hook', slug: '/sdk#react-hook', excerpt: 'useLayerCover hook for React applications', section: 'SDK' },
]

export function DocSearch() {
    const [isOpen, setIsOpen] = useState(false)
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<SearchResult[]>([])
    const inputRef = useRef<HTMLInputElement>(null)

    const search = useCallback((q: string) => {
        if (!q.trim()) {
            setResults([])
            return
        }
        const lower = q.toLowerCase()
        const filtered = SEARCH_INDEX.filter(
            (item) =>
                item.title.toLowerCase().includes(lower) ||
                item.excerpt.toLowerCase().includes(lower) ||
                item.section?.toLowerCase().includes(lower)
        )
        setResults(filtered.slice(0, 8))
    }, [])

    useEffect(() => {
        search(query)
    }, [query, search])

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault()
                setIsOpen(true)
            }
        }
        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [])

    const handleClose = () => {
        setIsOpen(false)
        setQuery('')
        setResults([])
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted transition-colors"
            >
                <Search className="h-4 w-4" />
                <span className="hidden sm:inline">Search docs...</span>
                <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </button>

            <Transition show={isOpen} as={Fragment}>
                <Dialog onClose={handleClose} className="relative z-50">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-200"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-150"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/50" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto p-4 sm:p-6 md:p-20">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-200"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-150"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="mx-auto max-w-xl transform overflow-hidden rounded-xl bg-background shadow-2xl ring-1 ring-border">
                                <div className="flex items-center border-b border-border px-4">
                                    <Search className="h-5 w-5 text-muted-foreground" />
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        placeholder="Search documentation..."
                                        className="flex-1 bg-transparent px-4 py-4 text-foreground placeholder-muted-foreground outline-none"
                                        autoFocus
                                    />
                                    {query && (
                                        <button onClick={() => setQuery('')} className="p-1 hover:bg-muted rounded">
                                            <X className="h-4 w-4 text-muted-foreground" />
                                        </button>
                                    )}
                                </div>

                                <div className="max-h-80 overflow-y-auto p-2">
                                    {results.length > 0 ? (
                                        <ul className="space-y-1">
                                            {results.map((result) => (
                                                <li key={result.slug}>
                                                    <Link
                                                        href={result.slug}
                                                        onClick={handleClose}
                                                        className="flex items-start gap-3 rounded-lg px-3 py-2 hover:bg-muted transition-colors"
                                                    >
                                                        <FileText className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-medium text-foreground">{result.title}</span>
                                                                {result.section && (
                                                                    <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                                                        {result.section}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="text-sm text-muted-foreground truncate">{result.excerpt}</p>
                                                        </div>
                                                        <ArrowRight className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : query ? (
                                        <p className="py-8 text-center text-muted-foreground">No results found for &quot;{query}&quot;</p>
                                    ) : (
                                        <div className="py-8 text-center text-muted-foreground">
                                            <p className="mb-2">Start typing to search...</p>
                                            <p className="text-xs">Try: &quot;claims&quot;, &quot;syndicate&quot;, &quot;salvage&quot;</p>
                                        </div>
                                    )}
                                </div>

                                <div className="border-t border-border px-4 py-2 text-xs text-muted-foreground flex items-center justify-between">
                                    <span>Navigate with ↑↓ • Select with Enter</span>
                                    <span>ESC to close</span>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}
