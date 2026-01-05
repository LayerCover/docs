import Link from 'next/link'

interface GlossaryLinkProps {
    term: string
    children?: React.ReactNode
}

// Map terms to their anchor IDs in the glossary
const GLOSSARY_ANCHORS: Record<string, string> = {
    // General Terms
    'coverage': 'general-terms',
    'policy': 'general-terms',
    'premium': 'general-terms',
    'claim': 'general-terms',
    'salvage': 'general-terms',
    // Capital & Underwriting
    'underwriter': 'capital--underwriting',
    'capital pool': 'capital--underwriting',
    'shares': 'capital--underwriting',
    'principal': 'capital--underwriting',
    'allocation': 'capital--underwriting',
    'pledge': 'capital--underwriting',
    'risk points': 'capital--underwriting',
    'coverage floor': 'capital--underwriting',
    // Pools & Risk
    'pool': 'pools--risk',
    'pool utilization': 'pools--risk',
    'utilization': 'pools--risk',
    'premium rate': 'pools--risk',
    'rate model': 'pools--risk',
    'risk rating': 'pools--risk',
    'mutex group': 'pools--risk',
    // Syndicates
    'syndicate': 'syndicates',
    'syndicate manager': 'syndicates',
    'performance fee': 'syndicates',
    'high-water mark': 'syndicates',
    'auto-allocation': 'syndicates',
    'reserve ratio': 'syndicates',
    // Reinsurance
    'cat pool': 'reinsurance',
    'backstop': 'reinsurance',
    'tranche': 'reinsurance',
    'junior tranche': 'reinsurance',
    'senior tranche': 'reinsurance',
    // Claims & Payouts
    'payout waterfall': 'claims--payouts',
    't0': 'claims--payouts',
    'time zero': 'claims--payouts',
    // Yield
    'yield adapter': 'yield--rewards',
    'atokens': 'yield--rewards',
    'ctokens': 'yield--rewards',
    'reward distributor': 'yield--rewards',
    'loss distributor': 'yield--rewards',
    'harvest': 'yield--rewards',
    // Withdrawals
    'notice period': 'withdrawals--deallocations',
    'deallocation': 'withdrawals--deallocations',
    // Technical
    'erc-4626': 'technical-terms',
    'erc-721': 'technical-terms',
    'basis points': 'technical-terms',
    'bps': 'technical-terms',
}

/**
 * A component that renders a term as a link to its glossary definition.
 * 
 * Usage in MDX:
 * <GlossaryLink term="salvage">salvage rights</GlossaryLink>
 * <GlossaryLink term="syndicate" />
 */
export function GlossaryLink({ term, children }: GlossaryLinkProps) {
    const normalizedTerm = term.toLowerCase()
    const anchor = GLOSSARY_ANCHORS[normalizedTerm] || 'general-terms'
    const displayText = children || term

    return (
        <Link
            href={`/resources/glossary#${anchor}`}
            className="text-primary underline decoration-dotted underline-offset-2 hover:decoration-solid"
            title={`See glossary definition for "${term}"`}
        >
            {displayText}
        </Link>
    )
}

/**
 * Inline glossary tooltip - shows definition on hover
 */
export function GlossaryTerm({ term, children }: GlossaryLinkProps) {
    const normalizedTerm = term.toLowerCase()
    const anchor = GLOSSARY_ANCHORS[normalizedTerm] || 'general-terms'
    const displayText = children || term

    return (
        <span className="relative group inline-block">
            <Link
                href={`/resources/glossary#${anchor}`}
                className="text-primary border-b border-dotted border-primary/50 hover:border-solid"
            >
                {displayText}
            </Link>
        </span>
    )
}
