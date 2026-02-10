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
    // Getting Started
    { title: 'Introduction', slug: '/getting-started', excerpt: 'Get up and running with LayerCover', section: 'Getting Started' },
    // Policyholders
    { title: 'Policyholders', slug: '/policyholders', excerpt: 'Protect your DeFi positions with on-chain insurance', section: 'Policyholders' },
    { title: 'Buying Cover', slug: '/policyholders/buying-cover', excerpt: 'Step-by-step guide to purchasing your first LayerCover policy', section: 'Policyholders' },
    { title: 'Coverage Types', slug: '/policyholders/coverage-types', excerpt: 'Stablecoin depeg, vault cover, and parametric protection explained', section: 'Policyholders' },
    { title: 'Filing Claims', slug: '/policyholders/filing-claims', excerpt: 'How to file a claim and receive your instant payout', section: 'Policyholders' },
    { title: 'Managing Policies', slug: '/policyholders/managing-policies', excerpt: 'View, transfer, cancel, and renew your LayerCover policies', section: 'Policyholders' },
    // Underwriters
    { title: 'Underwriters', slug: '/underwriters', excerpt: 'Earn premiums and DeFi yield by backing on-chain insurance', section: 'Underwriters' },
    { title: 'Syndicates', slug: '/underwriters/syndicates', excerpt: 'Passive underwriting through professionally managed vaults', section: 'Underwriters' },
    { title: 'Managing a Syndicate', slug: '/underwriters/managing-a-syndicate', excerpt: 'Allocation, intents, fees, and operations for Syndicate Managers', section: 'Underwriters' },
    { title: 'Capital & Leverage', slug: '/underwriters/capital-and-leverage', excerpt: 'How capital pledges, risk points, and leverage controls work', section: 'Underwriters' },
    { title: 'Risk Assessment', slug: '/underwriters/risk-assessment', excerpt: 'Evaluating risk pools before allocating capital', section: 'Underwriters' },
    { title: 'Claims & Salvage', slug: '/underwriters/claims-and-salvage', excerpt: 'How losses are distributed and salvage rights work for underwriters', section: 'Underwriters' },
    // Protocol
    { title: 'Protocol Architecture', slug: '/protocol', excerpt: 'How LayerCover works under the hood', section: 'Protocol' },
    { title: 'How Cover Works', slug: '/protocol/how-cover-works', excerpt: 'The LayerCover insurance model and the on-chain Lloyd\'s analogy', section: 'Protocol' },
    { title: 'Pricing Model', slug: '/protocol/pricing', excerpt: 'Fixed-rate intent system and the RFQ marketplace', section: 'Protocol' },
    { title: 'Capital Pool', slug: '/protocol/capital-pool', excerpt: 'ERC-4626 vault mechanics, yield adapters, and solvency controls', section: 'Protocol' },
    { title: 'Backstop Pool', slug: '/protocol/backstop-pool', excerpt: 'The protocol-wide safety net that absorbs catastrophic losses', section: 'Protocol' },
    { title: '3rd Party Reinsurance', slug: '/protocol/reinsurance', excerpt: 'External reinsurance capacity via the hook-based integration system', section: 'Protocol' },
    { title: 'Governance & Administration', slug: '/protocol/governance', excerpt: 'Protocol administration, emergency controls, and UMA dispute resolution', section: 'Protocol' },
    // Governance
    { title: 'Governance', slug: '/governance/governance', excerpt: 'Governance in the LayerCover protocol', section: 'Governance' },
    { title: 'Referral System', slug: '/governance/referral-system', excerpt: 'Referral system in the LayerCover protocol', section: 'Governance' },
    { title: 'Tokenomics', slug: '/governance/tokenomics', excerpt: 'Tokenomics in the LayerCover protocol', section: 'Governance' },
    // Developers
    { title: 'Developers', slug: '/developers', excerpt: 'Integrate LayerCover insurance into your dApp', section: 'Developers' },
    { title: 'Quickstart', slug: '/developers/quickstart', excerpt: 'Add LayerCover insurance to your dApp in under 5 minutes', section: 'Developers' },
    { title: 'SDK Reference', slug: '/developers/sdk-reference', excerpt: 'Full API reference for @layercover/sdk', section: 'Developers' },
    { title: 'API Reference', slug: '/developers/api-reference', excerpt: 'REST API endpoints for 3rd party integrations', section: 'Developers' },
    { title: 'Custom Theming', slug: '/developers/theming', excerpt: 'Customise the LayerCover widget to match your brand', section: 'Developers' },
    // Resources
    { title: 'Glossary', slug: '/resources/glossary', excerpt: 'Comprehensive glossary of LayerCover terms and concepts', section: 'Resources' },
    { title: 'FAQ', slug: '/resources/faq', excerpt: 'Frequently asked questions about LayerCover', section: 'Resources' },
    { title: 'Contract Addresses', slug: '/resources/contract-addresses', excerpt: 'Quick reference for deployed smart contract addresses', section: 'Resources' },
    { title: 'Pool Parameters', slug: '/resources/parameters', excerpt: 'Live configuration from the deployed LayerCover contracts', section: 'Resources' },
    { title: 'Security & Audits', slug: '/resources/audits', excerpt: 'Security audits, testing practices, and guarded launch strategy', section: 'Resources' },
    { title: 'Access Controls', slug: '/resources/access-controls', excerpt: 'Permission system and role-based access control', section: 'Resources' },
    { title: 'Brand Kit', slug: '/resources/brand-kit', excerpt: 'Official LayerCover brand assets, logos, and usage guidelines', section: 'Resources' },
    { title: 'Community', slug: '/resources/community', excerpt: 'Official LayerCover channels, programs, and contribution paths', section: 'Resources' },
    { title: 'External Resources', slug: '/resources/external-resources', excerpt: 'Official LayerCover links and resources', section: 'Resources' },
    { title: 'Code Licensing', slug: '/resources/licensing', excerpt: 'Software licenses and usage terms for LayerCover protocol', section: 'Resources' },
    { title: 'Privacy Policy', slug: '/resources/privacy-policy', excerpt: 'How LayerCover collects, uses, and protects your information', section: 'Resources' },
    { title: 'Terms of Service', slug: '/resources/terms-of-service', excerpt: 'Terms and conditions governing your use of LayerCover', section: 'Resources' },
    // Smart Contract Reference
    { title: 'Smart Contracts', slug: '/contracts', excerpt: 'Complete smart contract API reference', section: 'Contracts' },
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
