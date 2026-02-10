'use client'

import { Fragment, useEffect, useMemo, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { Check, ChevronDown, RefreshCcw } from 'lucide-react'
import { cn } from '@/lib/utils'



interface PoolInfo {
  id: number
  token: string
  name: string
  protocolName: string
  logo: string
  protocolLogo: string
  underlyingToken: string
  poolType: string
  totalCoverageSold: string
  claimFeeBps: number
  riskRating: string
  isPaused: boolean
  feeRecipient: string

  isYieldPool: boolean
  usesEscrow: boolean
  mutexGroupId: number
}

interface PoolParametersResponse {
  network: {
    key: string
    name: string
    chainId: number
  }
  fetchedAt: string
  fallback?: boolean
  policySettings: {
    coverCooldownSeconds: number
    catPremiumBps: number
    reserveFactorBps: number
    intentAdvantageBps: number
    intentDepositWindowSeconds: number
  }
  capitalSettings: {
    withdrawalNoticeSeconds: number
    deallocationNoticeSeconds: number
    maxAllocationsPerUnderwriter: number
    totalRiskPoints: number
    maxLeverageRatio: number
  }
  salvageSettings: {
    sweepGracePeriodSeconds: number
  }
  pools: PoolInfo[]
}

interface NetworkOption {
  id: string
  name: string
  chainId?: number
  logo: string
  available: boolean
  description?: string
}

const NETWORKS: NetworkOption[] = [
  {
    id: 'base-sepolia',
    name: 'Base Sepolia',
    chainId: 84532,
    logo: '/images/networks/base.png',
    available: true,
    description: 'Test deployment (USDC underwriting instance)',
  },
  {
    id: 'base-mainnet',
    name: 'Base Mainnet',
    chainId: 8453,
    logo: '/images/networks/base.png',
    available: false,
    description: 'Mainnet parameters coming soon',
  },
]
const AVAILABLE_NETWORKS = NETWORKS.filter((network) => network.id === 'base-sepolia')

function secondsToHuman(seconds: number): string {
  if (!seconds) return '0s'
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const parts = []
  if (days) parts.push(`${days}d`)
  if (hours) parts.push(`${hours}h`)
  if (minutes && !days) parts.push(`${minutes}m`)
  if (!parts.length) parts.push(`${seconds}s`)
  return parts.join(' ')
}

function formatBps(bps: number): string {
  return `${(bps / 100).toFixed(2)}%`
}

function formatStableAmount(value: string): string {
  try {
    const asNumber = Number(value) / 1e6
    if (asNumber >= 1_000_000) return `${(asNumber / 1_000_000).toFixed(2)}M`
    if (asNumber >= 1_000) return `${(asNumber / 1_000).toFixed(2)}K`
    return asNumber.toFixed(2)
  } catch {
    return value
  }
}

export function PoolParameters() {
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkOption>(AVAILABLE_NETWORKS[0] ?? NETWORKS[0])
  const [data, setData] = useState<PoolParametersResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const loadData = async (network: NetworkOption) => {
    if (!network.available) {
      setData(null)
      setError('Live data is not yet available for this network.')
      return
    }

    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/pool-parameters/${network.id}`)
      if (!response.ok) {
        const payload = await response.json().catch(() => null)
        throw new Error(payload?.message || 'Unable to fetch parameters')
      }
      const payload: PoolParametersResponse = await response.json()
      setData(payload)
    } catch (err: any) {
      console.error(err)
      setData(null)
      setError(err?.message || 'Failed to load live parameters')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData(selectedNetwork)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNetwork.id])

  const fetchedAtLabel = useMemo(() => {
    if (!data?.fetchedAt) return null
    try {
      const date = new Date(data.fetchedAt)
      return date.toLocaleString()
    } catch {
      return data.fetchedAt
    }
  }, [data?.fetchedAt])

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold">Live Pool Parameters</h2>
          <p className="text-sm text-muted-foreground">
            These values are queried directly from the currently deployed LayerCover contracts.
          </p>
        </div>

        <Listbox value={selectedNetwork} onChange={setSelectedNetwork}>
          <div className="relative w-full sm:w-72">
            <Listbox.Button className="flex w-full items-center gap-3 rounded-lg border border-border bg-background px-4 py-3 text-left shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40">
              <img src={selectedNetwork.logo} alt={selectedNetwork.name} className="h-7 w-7 rounded-md" />
              <div className="flex flex-1 flex-col">
                <span className="text-sm font-semibold leading-tight">{selectedNetwork.name}</span>
                {selectedNetwork.chainId && (
                  <span className="text-xs text-muted-foreground">Chain ID: {selectedNetwork.chainId}</span>
                )}
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Listbox.Options className="absolute right-0 z-20 mt-2 max-h-72 w-full overflow-auto rounded-lg border border-border bg-background p-1 text-sm shadow-xl focus:outline-none">
                {AVAILABLE_NETWORKS.map((network) => (
                  <Listbox.Option
                    key={network.id}
                    value={network}
                    className={({ active }) =>
                      `flex cursor-pointer select-none items-center gap-3 rounded-md px-3 py-2.5 transition-colors ${active ? 'bg-primary/10 text-primary' : 'text-foreground'
                      }`
                    }
                  >
                    {({ selected }) => (
                      <>
                        <img src={network.logo} alt={network.name} className="h-7 w-7 rounded-md" />
                        <div className="flex flex-1 flex-col">
                          <span className="text-sm font-medium">{network.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {network.available ? 'Live data' : 'Coming soon'}
                          </span>
                        </div>
                        {selected && <Check className="h-4 w-4 text-primary" />}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
      </div>

      {selectedNetwork.description && (
        <p className="text-sm text-muted-foreground">{selectedNetwork.description}</p>
      )}

      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <button
          type="button"
          onClick={() => loadData(selectedNetwork)}
          disabled={loading || !selectedNetwork.available}
          className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground shadow-sm transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCcw className={cn('h-3.5 w-3.5', loading && 'animate-spin')} />
          Refresh
        </button>
        {fetchedAtLabel && <span>Last refreshed: {fetchedAtLabel}</span>}
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {!error && data?.fallback && (
        <div className="rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
          Live RPC calls are blocked in this environment. Showing the latest static pool configuration instead.
        </div>
      )}

      {loading && (
        <div className="grid gap-4 sm:grid-cols-2">
          {[...Array(4)].map((_, idx) => (
            <div key={idx} className="h-36 animate-pulse rounded-lg border border-border bg-muted/40" />
          ))}
        </div>
      )}

      {!loading && data && (
        <div className="space-y-10">
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-muted-foreground">Policy Settings</h3>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <dt>Cover cooldown</dt>
                  <dd className="font-medium">{secondsToHuman(data.policySettings.coverCooldownSeconds)}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt>Backstop pool share</dt>
                  <dd className="font-medium">{formatBps(data.policySettings.catPremiumBps)}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt>Reserve factor</dt>
                  <dd className="font-medium">{formatBps(data.policySettings.reserveFactorBps)}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt>Intent advantage</dt>
                  <dd className="font-medium">{formatBps(data.policySettings.intentAdvantageBps)}</dd>
                </div>
                {data.policySettings.intentDepositWindowSeconds > 0 && (
                  <div className="flex items-center justify-between">
                    <dt>Intent deposit window</dt>
                    <dd className="font-medium">
                      {secondsToHuman(data.policySettings.intentDepositWindowSeconds)}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-muted-foreground">Capital & Underwriting</h3>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <dt>Max pools / underwriter</dt>
                  <dd className="font-medium">{data.capitalSettings.maxAllocationsPerUnderwriter}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt>Total risk points</dt>
                  <dd className="font-medium">{data.capitalSettings.totalRiskPoints}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt>Max leverage ratio</dt>
                  <dd className="font-medium">{data.capitalSettings.maxLeverageRatio.toFixed(2)}x</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-muted-foreground">Salvage & Recovery</h3>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <dt>Salvage sweep grace</dt>
                  <dd className="font-medium">
                    {secondsToHuman(data.salvageSettings.sweepGracePeriodSeconds)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <h3 className="text-lg font-semibold">Registered Pools</h3>
              <p className="text-sm text-muted-foreground">
                Coverage sold is shown in the underlying asset denomination.
                The Governance column shows pause status, mutex group assignments for correlation risk management, yield settings, and custody models.
              </p>
            </div>

            {data.pools.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border bg-muted/30 px-4 py-10 text-center text-sm text-muted-foreground">
                No pools are registered on this deployment yet.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="min-w-full divide-y divide-border text-sm">
                  <thead className="bg-muted/40">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Pool</th>
                      <th className="px-4 py-3 text-left font-semibold">Risk</th>
                      <th className="px-4 py-3 text-left font-semibold">Claim Fee</th>
                      <th className="px-4 py-3 text-left font-semibold">Coverage Sold</th>

                      <th className="px-4 py-3 text-left font-semibold hidden sm:table-cell">Governance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/80">
                    {data.pools.map((pool) => (
                      <tr key={pool.id} className="hover:bg-muted/30">
                        <td className="px-4 py-3 align-middle">
                          <div className="flex items-center gap-3">
                            {/* Display protocol logo or stablecoin logo */}
                            {(pool.protocolLogo || pool.logo) && (
                              <div className="flex-shrink-0">
                                <img
                                  src={pool.protocolLogo || pool.logo}
                                  alt={pool.name}
                                  className="h-8 w-8 rounded-full object-cover bg-white p-0.5"
                                />
                              </div>
                            )}
                            <div className="flex flex-col gap-0.5">
                              <span className="font-medium text-sm">
                                {pool.protocolName && pool.underlyingToken
                                  ? `${pool.protocolName} • ${pool.underlyingToken}`
                                  : pool.name}
                              </span>
                              <span className="text-xs text-muted-foreground">Pool #{pool.id}</span>
                              {pool.feeRecipient !== '0x0000000000000000000000000000000000000000' && (
                                <span className="font-mono text-[11px] text-muted-foreground">
                                  Fee: {pool.feeRecipient.slice(0, 6)}...{pool.feeRecipient.slice(-4)}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 align-middle">
                          <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                            {pool.riskRating}
                          </span>
                        </td>
                        <td className="px-4 py-3 align-middle text-sm">{formatBps(pool.claimFeeBps)}</td>
                        <td className="px-4 py-3 align-middle text-sm">${formatStableAmount(pool.totalCoverageSold)}</td>

                        <td className="px-4 py-3 align-middle hidden sm:table-cell">
                          <div className="flex flex-col gap-1 text-xs">
                            {pool.isPaused && (
                              <span className="inline-flex items-center gap-1 text-destructive font-medium">
                                Paused
                              </span>
                            )}
                            {pool.mutexGroupId > 0 && (
                              <span className="text-muted-foreground">
                                Mutex Group: {pool.mutexGroupId}
                              </span>
                            )}
                            {pool.isYieldPool && (
                              <span className="text-muted-foreground">Yield-enabled</span>
                            )}
                            {pool.usesEscrow && (
                              <span className="text-muted-foreground">Escrow custody</span>
                            )}
                            {!pool.isPaused && !pool.isYieldPool && !pool.usesEscrow && pool.mutexGroupId === 0 && (
                              <span className="text-muted-foreground">Standard</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
