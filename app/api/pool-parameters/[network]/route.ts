import { NextResponse } from 'next/server'
import { createPublicClient, http, Address } from 'viem'
import baseSepoliaSingletons from '../../../../data/deployments/base_sepolia/singletons.json'
import baseSepoliaInstance from '../../../../data/deployments/base_sepolia/instances/usdc.json'
import { POOLS } from '../../../config/pools'
import { getCurator } from '../../../config/curators'

export const revalidate = 60

async function readOptional<T>(
  client: ReturnType<typeof createPublicClient>,
  params: Parameters<typeof client.readContract>[0],
  fallback: T
): Promise<T> {
  try {
    return (await client.readContract(params)) as T
  } catch (error) {
    console.warn(`Optional read failed for ${String(params.functionName)}:`, error)
    return fallback
  }
}

const policyManagerAbi = [
  {
    type: 'function',
    name: 'coverCooldownPeriod',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint96' }],
  },
  {
    type: 'function',
    name: 'catPremiumBps',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint16' }],
  },
  {
    type: 'function',
    name: 'reserveFactor',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint16' }],
  },
  {
    type: 'function',
    name: 'intentAdvantageBps',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
] as const

const capitalPoolAbi = [
  {
    type: 'function',
    name: 'underwriterNoticePeriod',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
] as const

const poolAllocationManagerAbi = [
  {
    type: 'function',
    name: 'deallocationNoticePeriod',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint96' }],
  },
] as const

const riskManagerAbi = [
  {
    type: 'function',
    name: 'SWEEP_GRACE_PERIOD',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
] as const

const underwriterManagerAbi = [
  {
    type: 'function',
    name: 'TOTAL_RISK_POINTS',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'maxAllocationsPerUnderwriter',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint96' }],
  },
  {
    type: 'function',
    name: 'maxLeverageRatio',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'poolInfo',
    stateMutability: 'view',
    inputs: [{ type: 'uint256' }],
    outputs: [
      { type: 'uint256', name: 'totalCapitalPledged' },
      { type: 'uint256', name: 'capitalPendingWithdrawal' },
      { type: 'uint256', name: 'capitalAllocatedToIntents' },
      { type: 'uint256', name: 'mutexGroupId' },
    ],
  },
] as const

const riskAdminAbi = [
  {
    type: 'function',
    name: 'intentDepositWindow',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
] as const

const poolRegistryAbi = [
  {
    type: 'function',
    name: 'getPoolCount',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'getPoolStaticData',
    stateMutability: 'view',
    inputs: [{ type: 'uint256' }],
    outputs: [
      { type: 'address' },
      { type: 'uint256' },
      { type: 'bool' },
      { type: 'address' },
      { type: 'uint256' },
      { type: 'uint8' },
    ],
  },
  {
    type: 'function',
    name: 'getPoolRateModel',
    stateMutability: 'view',
    inputs: [{ type: 'uint256' }],
    outputs: [
      {
        type: 'tuple',
        components: [
          { type: 'uint256', name: 'base' },
          { type: 'uint256', name: 'slope1' },
          { type: 'uint256', name: 'slope2' },
          { type: 'uint256', name: 'kink' },
        ],
      },
    ],
  },
  {
    type: 'function',
    name: 'isYieldRewardPool',
    stateMutability: 'view',
    inputs: [{ type: 'uint256' }],
    outputs: [{ type: 'bool' }],
  },
  {
    type: 'function',
    name: 'poolUsesEscrow',
    stateMutability: 'view',
    inputs: [{ type: 'uint256' }],
    outputs: [{ type: 'bool' }],
  },
] as const

const riskRatingLabels = ['AAA', 'AA', 'A', 'BBB', 'BB', 'B', 'C']

const NETWORK_CONFIG = {
  'base-sepolia': {
    name: 'Base Sepolia',
    chainId: Number(baseSepoliaSingletons.chainId),
    rpcUrl: baseSepoliaSingletons.rpcUrl as string,
    addresses: {
      policyManager: baseSepoliaInstance.contracts.core.PolicyManager.address as Address,
      underwriterManager: baseSepoliaInstance.contracts.core.UnderwriterManager.address as Address,
      poolAllocationManager: baseSepoliaInstance.contracts.core.PoolAllocationManager.address as Address,
      capitalPool: baseSepoliaInstance.contracts.pools.CapitalPool.address as Address,
      poolRegistry: baseSepoliaInstance.contracts.pools.PoolRegistry.address as Address,
      riskManager: baseSepoliaInstance.contracts.core.RiskManager.address as Address,
      riskAdmin: baseSepoliaSingletons.contracts.utilities.ProtocolConfigurator.address as Address,
    },
  },
} as const

type NetworkKey = keyof typeof NETWORK_CONFIG

function buildFallbackResponse(networkKey: NetworkKey) {
  const config = NETWORK_CONFIG[networkKey]
  const chainPools = POOLS[config.chainId] || []

  return {
    network: {
      key: networkKey,
      name: config.name,
      chainId: config.chainId,
    },
    fetchedAt: new Date().toISOString(),
    fallback: true,
    policySettings: {
      coverCooldownSeconds: 0,
      catPremiumBps: 0,
      reserveFactorBps: 0,
      intentAdvantageBps: 0,
      intentDepositWindowSeconds: 0,
    },
    capitalSettings: {
      withdrawalNoticeSeconds: 0,
      deallocationNoticeSeconds: 0,
      maxAllocationsPerUnderwriter: 0,
      totalRiskPoints: 0,
      maxLeverageRatio: 0,
    },
    salvageSettings: {
      sweepGracePeriodSeconds: 0,
    },
    pools: chainPools.map((pool) => {
      const curator = pool.protocolId ? getCurator(pool.protocolId) : undefined
      return {
        id: pool.poolId,
        token: pool.address,
        name: pool.metadata?.description || `Pool #${pool.poolId}`,
        protocolName: curator?.displayName || curator?.name || '',
        logo: pool.metadata?.logo || '',
        protocolLogo: pool.metadata?.protocolLogo || '',
        underlyingToken: pool.underlyingToken || '',
        poolType: pool.type || '',
        totalCoverageSold: '0',
        claimFeeBps: 0,
        riskRating: 'N/A',
        isPaused: false,
        feeRecipient: '0x0000000000000000000000000000000000000000',
        rateModel: {
          base: '0',
          slope1: '0',
          slope2: '0',
          kink: '0',
        },
        isYieldPool: false,
        usesEscrow: false,
        mutexGroupId: 0,
      }
    }),
  }
}

export async function GET(_request: Request, { params }: { params: { network: string } }) {
  const networkKey = params.network as NetworkKey

  if (!NETWORK_CONFIG[networkKey]) {
    return NextResponse.json({ message: `Unsupported network: ${params.network}` }, { status: 404 })
  }

  const config = NETWORK_CONFIG[networkKey]

  const client = createPublicClient({
    chain: {
      id: config.chainId,
      name: config.name,
      nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
      rpcUrls: {
        default: { http: [config.rpcUrl] },
        public: { http: [config.rpcUrl] },
      },
    },
    transport: http(config.rpcUrl),
  })

  try {
    const [coverCooldown, catPremium, reserveFactor, intentAdvantage, withdrawalNotice, deallocationNotice, sweepGrace, totalRiskPoints, maxAllocations, maxLeverage, intentDepositWindow] = await Promise.all([
      client.readContract({ address: config.addresses.policyManager, abi: policyManagerAbi, functionName: 'coverCooldownPeriod' }),
      client.readContract({ address: config.addresses.policyManager, abi: policyManagerAbi, functionName: 'catPremiumBps' }),
      client.readContract({ address: config.addresses.policyManager, abi: policyManagerAbi, functionName: 'reserveFactor' }),
      readOptional(client, { address: config.addresses.policyManager, abi: policyManagerAbi, functionName: 'intentAdvantageBps' }, BigInt(0)),
      client.readContract({ address: config.addresses.capitalPool, abi: capitalPoolAbi, functionName: 'underwriterNoticePeriod' }),
      readOptional(client, { address: config.addresses.poolAllocationManager, abi: poolAllocationManagerAbi, functionName: 'deallocationNoticePeriod' }, 0n),
      client.readContract({ address: config.addresses.riskManager, abi: riskManagerAbi, functionName: 'SWEEP_GRACE_PERIOD' }),
      client.readContract({ address: config.addresses.underwriterManager, abi: underwriterManagerAbi, functionName: 'TOTAL_RISK_POINTS' }),
      client.readContract({ address: config.addresses.underwriterManager, abi: underwriterManagerAbi, functionName: 'maxAllocationsPerUnderwriter' }),
      client.readContract({ address: config.addresses.underwriterManager, abi: underwriterManagerAbi, functionName: 'maxLeverageRatio' }),
      config.addresses.riskAdmin
        ? readOptional(client, { address: config.addresses.riskAdmin, abi: riskAdminAbi, functionName: 'intentDepositWindow' }, BigInt(0))
        : Promise.resolve(BigInt(0)),
    ])

    const poolCount = Number(
      await client.readContract({
        address: config.addresses.poolRegistry,
        abi: poolRegistryAbi,
        functionName: 'getPoolCount',
      })
    )

    // Get pool configs for this chainId
    const chainPools = POOLS[config.chainId] || []

    const pools = [] as any[]
    for (let i = 0; i < poolCount; i++) {
      const poolId = BigInt(i)
      const [tokenAddress, totalCoverage, isPaused, feeRecipient, claimFeeBps, riskRating] = await client.readContract({
        address: config.addresses.poolRegistry,
        abi: poolRegistryAbi,
        functionName: 'getPoolStaticData',
        args: [poolId],
      })

      const rateModel = await client.readContract({
        address: config.addresses.poolRegistry,
        abi: poolRegistryAbi,
        functionName: 'getPoolRateModel',
        args: [poolId],
      }) as { base: bigint; slope1: bigint; slope2: bigint; kink: bigint }

      const [yieldPool, usesEscrow, poolInfoData] = await Promise.all([
        client
          .readContract({
            address: config.addresses.poolRegistry,
            abi: poolRegistryAbi,
            functionName: 'isYieldRewardPool',
            args: [poolId],
          })
          .catch(() => false),
        client
          .readContract({
            address: config.addresses.poolRegistry,
            abi: poolRegistryAbi,
            functionName: 'poolUsesEscrow',
            args: [poolId],
          })
          .catch(() => false),
        client
          .readContract({
            address: config.addresses.underwriterManager,
            abi: underwriterManagerAbi,
            functionName: 'poolInfo',
            args: [poolId],
          })
          .catch(() => [0n, 0n, 0n, 0n] as const),
      ])

      // Find pool metadata from config
      const poolConfig = chainPools.find((p) => p.poolId === Number(poolId))
      const curator = poolConfig?.protocolId ? getCurator(poolConfig.protocolId) : undefined

      pools.push({
        id: Number(poolId),
        token: tokenAddress,
        name: poolConfig?.metadata?.description || `Pool #${poolId}`,
        protocolName: curator?.displayName || curator?.name || '',
        logo: poolConfig?.metadata?.logo || '',
        protocolLogo: poolConfig?.metadata?.protocolLogo || '',
        underlyingToken: poolConfig?.underlyingToken || '',
        poolType: poolConfig?.type || '',
        totalCoverageSold: totalCoverage.toString(),
        claimFeeBps: Number(claimFeeBps),
        riskRating: riskRatingLabels[Number(riskRating)] || 'Unknown',
        isPaused,
        feeRecipient,
        rateModel: {
          base: rateModel.base.toString(),
          slope1: rateModel.slope1.toString(),
          slope2: rateModel.slope2.toString(),
          kink: rateModel.kink.toString(),
        },
        isYieldPool: yieldPool,
        usesEscrow,
        mutexGroupId: Number(poolInfoData[3]),
      })
    }

    const response = {
      network: {
        key: networkKey,
        name: config.name,
        chainId: config.chainId,
      },
      fetchedAt: new Date().toISOString(),
      policySettings: {
        coverCooldownSeconds: Number(coverCooldown),
        catPremiumBps: Number(catPremium),
        reserveFactorBps: Number(reserveFactor),
        intentAdvantageBps: Number(intentAdvantage),
        intentDepositWindowSeconds: Number(intentDepositWindow || 0n),
      },
      capitalSettings: {
        withdrawalNoticeSeconds: Number(withdrawalNotice),
        deallocationNoticeSeconds: Number(deallocationNotice),
        maxAllocationsPerUnderwriter: Number(maxAllocations),
        totalRiskPoints: Number(totalRiskPoints),
        maxLeverageRatio: Number(maxLeverage) / 1e18,
      },
      salvageSettings: {
        sweepGracePeriodSeconds: Number(sweepGrace),
      },
      pools,
    }

    return NextResponse.json(response)
  } catch (error: any) {
    console.error('Failed to load pool parameters, falling back to static config', error)
    const fallback = buildFallbackResponse(networkKey)
    return NextResponse.json(fallback, { status: 200 })
  }
}
