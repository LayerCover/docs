'use client'

import { useState, useMemo } from 'react'

interface PremiumCalculatorProps {
    defaultCoverage?: number
    defaultRate?: number
    defaultDuration?: number
}

export function PremiumCalculator({
    defaultCoverage = 10000,
    defaultRate = 500,
    defaultDuration = 90,
}: PremiumCalculatorProps) {
    const [coverage, setCoverage] = useState(defaultCoverage)
    const [rate, setRate] = useState(defaultRate)
    const [duration, setDuration] = useState(defaultDuration)

    const premium = useMemo(() => {
        return (coverage * rate * duration) / (365 * 10000)
    }, [coverage, rate, duration])

    const dailyCost = useMemo(() => premium / duration, [premium, duration])
    const effectiveApr = useMemo(() => (rate / 10000) * 100, [rate])

    return (
        <div className="rounded-xl border border-border bg-gradient-to-br from-background to-brand-50/30 dark:to-brand-900/10 p-6 my-8 not-prose">
            <div className="flex items-center gap-2 mb-6">
                <span className="text-2xl">🧮</span>
                <h3 className="text-lg font-semibold text-foreground m-0">Premium Calculator</h3>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
                {/* Coverage Amount */}
                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Coverage Amount (USDC)
                    </label>
                    <input
                        type="range"
                        min={1000}
                        max={100000}
                        step={1000}
                        value={coverage}
                        onChange={(e) => setCoverage(Number(e.target.value))}
                        className="w-full h-2 rounded-full appearance-none cursor-pointer accent-brand-500 bg-muted"
                        aria-label="Coverage Amount Slider"
                    />
                    <div className="mt-1 flex justify-between items-center">
                        <input
                            type="number"
                            value={coverage}
                            onChange={(e) => setCoverage(Math.max(1000, Math.min(100000, Number(e.target.value))))}
                            className="w-28 px-2 py-1 rounded-md border border-border bg-background text-foreground text-sm font-mono"
                            aria-label="Coverage Amount Value"
                        />
                        <span className="text-xs text-muted-foreground">$1K – $100K</span>
                    </div>
                </div>

                {/* Rate */}
                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Rate (basis points)
                    </label>
                    <input
                        type="range"
                        min={100}
                        max={2000}
                        step={50}
                        value={rate}
                        onChange={(e) => setRate(Number(e.target.value))}
                        className="w-full h-2 rounded-full appearance-none cursor-pointer accent-brand-500 bg-muted"
                        aria-label="Rate Slider"
                    />
                    <div className="mt-1 flex justify-between items-center">
                        <input
                            type="number"
                            value={rate}
                            onChange={(e) => setRate(Math.max(100, Math.min(2000, Number(e.target.value))))}
                            className="w-28 px-2 py-1 rounded-md border border-border bg-background text-foreground text-sm font-mono"
                            aria-label="Rate Value"
                        />
                        <span className="text-xs text-muted-foreground">{effectiveApr.toFixed(1)}% APR</span>
                    </div>
                </div>

                {/* Duration */}
                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Duration (days)
                    </label>
                    <div className="flex gap-2 mb-2">
                        {[30, 60, 90].map((d) => (
                            <button
                                key={d}
                                onClick={() => setDuration(d)}
                                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${duration === d
                                        ? 'bg-brand-500 text-white shadow-sm'
                                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                    }`}
                            >
                                {d}d
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Results */}
            <div className="mt-6 pt-6 border-t border-border">
                <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-lg bg-brand-500/10 dark:bg-brand-500/20 p-4 text-center">
                        <div className="text-2xl font-bold text-brand-600 dark:text-brand-400 font-mono">
                            ${premium.toFixed(2)}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">Total Premium</div>
                    </div>
                    <div className="rounded-lg bg-muted p-4 text-center">
                        <div className="text-2xl font-bold text-foreground font-mono">
                            ${dailyCost.toFixed(2)}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">Per Day</div>
                    </div>
                    <div className="rounded-lg bg-muted p-4 text-center">
                        <div className="text-2xl font-bold text-foreground font-mono">
                            ${coverage.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">Coverage</div>
                    </div>
                </div>

                <div className="mt-4 text-xs text-muted-foreground text-center font-mono">
                    P = ({coverage.toLocaleString()} × {rate} × {duration}) / (365 × 10,000) = ${premium.toFixed(2)}
                </div>
            </div>
        </div>
    )
}
