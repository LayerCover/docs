'use client'

import { useState, useMemo } from 'react'

interface PoolAllocation {
    id: number
    name: string
    rating: string
    riskCost: number
    allocation: number
    emoji: string
}

const POOL_PRESETS: PoolAllocation[] = [
    { id: 1, name: 'Aave USDC', rating: 'AAA', riskCost: 10, allocation: 0, emoji: '✅' },
    { id: 2, name: 'Compound cDAI', rating: 'AA', riskCost: 20, allocation: 0, emoji: '✅' },
    { id: 3, name: 'Vault Protocol X', rating: 'A', riskCost: 30, allocation: 0, emoji: '⚠️' },
    { id: 4, name: 'Yield Farm Y', rating: 'BBB', riskCost: 50, allocation: 0, emoji: '⚠️' },
    { id: 5, name: 'New Protocol Z', rating: 'BB', riskCost: 70, allocation: 0, emoji: '🚨' },
]

interface RiskPointsCalculatorProps {
    defaultDeposit?: number
    maxBudget?: number
}

const CONCENTRATION_LIMIT_BPS = 3500 // 35% — matches PoolAllocations.sol maxExposurePerPoolBps

export function RiskPointsCalculator({
    defaultDeposit = 100000,
    maxBudget = 100,
}: RiskPointsCalculatorProps) {
    const [deposit, setDeposit] = useState(defaultDeposit)
    const [pools, setPools] = useState(POOL_PRESETS)

    const perPoolCap = Math.floor(deposit * CONCENTRATION_LIMIT_BPS / 10000)

    const stats = useMemo(() => {
        const totalAllocation = pools.reduce((sum, p) => sum + p.allocation, 0)
        const pointsUsed = pools.reduce((sum, p) => {
            if (p.allocation === 0 || deposit === 0) return sum
            return sum + p.riskCost * (p.allocation / deposit)
        }, 0)
        const leverage = deposit > 0 ? totalAllocation / deposit : 0

        return { totalAllocation, pointsUsed, leverage }
    }, [pools, deposit])

    const updateAllocation = (id: number, value: number) => {
        setPools((prev) =>
            prev.map((p) => (p.id === id ? { ...p, allocation: Math.max(0, Math.min(value, perPoolCap)) } : p))
        )
    }

    const pointsPercent = Math.min((stats.pointsUsed / maxBudget) * 100, 100)
    const isOverBudget = stats.pointsUsed > maxBudget

    return (
        <div className="rounded-xl border border-border bg-gradient-to-br from-background to-green-50/30 dark:to-green-900/10 p-6 my-8 not-prose">
            <div className="flex items-center gap-2 mb-6">
                <span className="text-2xl">📊</span>
                <h3 className="text-lg font-semibold text-foreground m-0">Risk Points Calculator</h3>
            </div>

            {/* Deposit Input */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Your Deposit (USDC)
                </label>
                <input
                    type="number"
                    value={deposit}
                    onChange={(e) => setDeposit(Math.max(1000, Number(e.target.value)))}
                    className="w-40 px-3 py-2 rounded-lg border border-border bg-background text-foreground font-mono text-sm"
                    aria-label="Deposit Amount"
                />
            </div>

            {/* Pool Allocations */}
            <div className="space-y-3">
                {pools.map((pool) => (
                    <div
                        key={pool.id}
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border/50"
                    >
                        <span className="text-sm">{pool.emoji}</span>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-foreground truncate">{pool.name}</span>
                                <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                                    {pool.rating}
                                </span>
                                <span className="text-xs text-muted-foreground">cost: {pool.riskCost}</span>
                            </div>
                        </div>
                        {pool.allocation >= perPoolCap && perPoolCap > 0 && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 font-medium whitespace-nowrap"
                            >35% cap</span>
                        )}
                        <input
                            type="range"
                            min={0}
                            max={perPoolCap}
                            step={1000}
                            value={pool.allocation}
                            onChange={(e) => updateAllocation(pool.id, Number(e.target.value))}
                            className="w-32 h-2 rounded-full appearance-none cursor-pointer accent-brand-500 bg-muted"
                            aria-label={`Allocation Slider for ${pool.name}`}
                        />
                        <input
                            type="number"
                            value={pool.allocation}
                            onChange={(e) => updateAllocation(pool.id, Number(e.target.value))}
                            className="w-24 px-2 py-1 rounded-md border border-border bg-background text-foreground text-xs font-mono text-right"
                            aria-label={`Allocation Value for ${pool.name}`}
                        />
                    </div>
                ))}
            </div>

            {/* Results */}
            <div className="mt-6 pt-6 border-t border-border">
                {/* Risk Points Bar */}
                <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-muted-foreground">Risk Points Used</span>
                        <span
                            className={`text-sm font-bold font-mono ${isOverBudget ? 'text-red-500' : 'text-foreground'
                                }`}
                        >
                            {stats.pointsUsed.toFixed(1)} / {maxBudget}
                        </span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-muted overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-300 ${isOverBudget
                                ? 'bg-red-500'
                                : stats.pointsUsed > maxBudget * 0.8
                                    ? 'bg-amber-500'
                                    : 'bg-brand-500'
                                }`}
                            style={{ width: `${Math.min(pointsPercent, 100)}%` }} // eslint-disable-line react-dom/no-unsafe-inline-style
                        />
                    </div>
                    {isOverBudget && (
                        <p className="text-xs text-red-500 mt-1">
                            ⚠️ Over budget! Reduce allocations or choose lower-risk pools.
                        </p>
                    )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-lg bg-brand-500/10 dark:bg-brand-500/20 p-4 text-center">
                        <div className="text-2xl font-bold text-brand-600 dark:text-brand-400 font-mono">
                            {stats.leverage.toFixed(1)}×
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">Leverage</div>
                    </div>
                    <div className="rounded-lg bg-muted p-4 text-center">
                        <div className="text-2xl font-bold text-foreground font-mono">
                            ${stats.totalAllocation.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">Total Coverage Backed</div>
                    </div>
                    <div className="rounded-lg bg-muted p-4 text-center">
                        <div className="text-2xl font-bold text-foreground font-mono">
                            {(maxBudget - stats.pointsUsed).toFixed(1)}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">Points Remaining</div>
                    </div>
                    <div className="rounded-lg bg-amber-500/10 dark:bg-amber-500/20 p-4 text-center">
                        <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 font-mono">
                            ${perPoolCap.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">Per-Pool Cap (35%)</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
