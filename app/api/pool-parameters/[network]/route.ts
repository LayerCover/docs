import { NextResponse } from 'next/server'
import { createPublicClient, http, Address } from 'viem'
import { POOLS } from '../../../config/pools'
import { getCurator } from '../../../config/curators'

// Import deployed contract addresses from the canonical deployment artifacts
import usdcDeployment from '../../../../../contracts/deployments/base_sepolia/usdc.json'

export const revalidate = 60

async function readOptional<T>(
  client: ReturnType<typeof createPublicClient>,
  params: Parameters<typeof client.readContract>[0],
  fallback: T
): Promise<T> {
  try {
    return (await client.readContract(params)) as T
  } catch {
    // Expected for functions not present on the deployed contract — silently use fallback
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

// Build network config from the deployment artifact
const NETWORK_CONFIG = {
  'base-sepolia': {
    name: 'Base Sepolia',
    chainId: 84532,
    rpcUrl: process.env.BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org',
    addresses: {
      policyManager: (usdcDeployment as Record<string, string>).PolicyManager as Address,
      underwriterManager: (usdcDeployment as Record<string, string>).PoolAllocationManager as Address,
      poolAllocationManager: (usdcDeployment as Record<string, string>).PoolAllocationManager as Address,
      capitalPool: (usdcDeployment as Record<string, string>).CapitalPool as Address,
      poolRegistry: (usdcDeployment as Record<string, string>).PoolRegistry as Address,
      riskManager: (usdcDeployment as Record<string, string>).RiskManager as Address,
      riskAdmin: ((usdcDeployment as Record<string, string>).ProtocolConfigurator || '0x0000000000000000000000000000000000000000') as Address,
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
      coverCooldownSeconds: 0, // No cooldown by default
      catPremiumBps: 2000, // 20% CAT premium (PolicyManager.sol: line 251)
      reserveFactorBps: 0, // No reserve factor by default
      intentAdvantageBps: 0, // No intent advantage by default
      intentDepositWindowSeconds: 0, // No deposit window by default
    },
    capitalSettings: {
      withdrawalNoticeSeconds: 0, // Instant withdrawal by default
      deallocationNoticeSeconds: 0, // Instant deallocation by default
      maxAllocationsPerUnderwriter: 5, // (PoolAllocations.sol: line 105)
      totalRiskPoints: 20, // (PoolAllocations.sol: line 35)
      maxLeverageRatio: 20, // 20x leverage (PoolAllocations.sol: line 106)
    },
    salvageSettings: {
      sweepGracePeriodSeconds: 15552000, // 180 days (SalvageManager.sol: line 31)
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
    // Use readOptional for ALL calls — some functions may not exist on the deployed contract
    const [coverCooldown, catPremium, reserveFactor, intentAdvantage, withdrawalNotice, deallocationNotice, sweepGrace, totalRiskPoints, maxAllocations, maxLeverage, intentDepositWindow] = await Promise.all([
      readOptional(client, { address: config.addresses.policyManager, abi: policyManagerAbi, functionName: 'coverCooldownPeriod' }, BigInt(0)),
      readOptional(client, { address: config.addresses.policyManager, abi: policyManagerAbi, functionName: 'catPremiumBps' }, BigInt(2000)),
      readOptional(client, { address: config.addresses.policyManager, abi: policyManagerAbi, functionName: 'reserveFactor' }, BigInt(0)),
      readOptional(client, { address: config.addresses.policyManager, abi: policyManagerAbi, functionName: 'intentAdvantageBps' }, BigInt(0)),
      readOptional(client, { address: config.addresses.capitalPool, abi: capitalPoolAbi, functionName: 'underwriterNoticePeriod' }, BigInt(0)),
      readOptional(client, { address: config.addresses.poolAllocationManager, abi: poolAllocationManagerAbi, functionName: 'deallocationNoticePeriod' }, BigInt(0)),
      readOptional(client, { address: config.addresses.riskManager, abi: riskManagerAbi, functionName: 'SWEEP_GRACE_PERIOD' }, BigInt(15552000)),
      readOptional(client, { address: config.addresses.underwriterManager, abi: underwriterManagerAbi, functionName: 'TOTAL_RISK_POINTS' }, BigInt(20)),
      readOptional(client, { address: config.addresses.underwriterManager, abi: underwriterManagerAbi, functionName: 'maxAllocationsPerUnderwriter' }, BigInt(5)),
      readOptional(client, { address: config.addresses.underwriterManager, abi: underwriterManagerAbi, functionName: 'maxLeverageRatio' }, BigInt(20n * 10n ** 18n)),
      readOptional(client, { address: config.addresses.riskAdmin, abi: riskAdminAbi, functionName: 'intentDepositWindow' }, BigInt(0)),
    ])

    // Get pool configs for this chainId
    const chainPools = POOLS[config.chainId] || []

    let poolCount: number
    try {
      poolCount = Number(
        await client.readContract({
          address: config.addresses.poolRegistry,
          abi: poolRegistryAbi,
          functionName: 'getPoolCount',
        })
      )
    } catch {
      // If getPoolCount fails, fall back to the number of pools in static config
      poolCount = chainPools.length
    }

    const pools = [] as any[]
    for (let i = 0; i < poolCount; i++) {
      const poolId = BigInt(i)
      const poolConfig = chainPools.find((p) => p.poolId === i)
      const curator = poolConfig?.protocolId ? getCurator(poolConfig.protocolId) : undefined

      try {
        const [tokenAddress, totalCoverage, isPaused, feeRecipient, claimFeeBps, riskRating] = await client.readContract({
          address: config.addresses.poolRegistry,
          abi: poolRegistryAbi,
          functionName: 'getPoolStaticData',
          args: [poolId],
        })

        const rateModel = await readOptional(client, {
          address: config.addresses.poolRegistry,
          abi: poolRegistryAbi,
          functionName: 'getPoolRateModel',
          args: [poolId],
        }, { base: 0n, slope1: 0n, slope2: 0n, kink: 0n }) as { base: bigint; slope1: bigint; slope2: bigint; kink: bigint }

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

        pools.push({
          id: i,
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
      } catch (poolError: any) {
        // If on-chain read fails, still include the pool with static metadata
        console.warn(`Failed to read on-chain data for pool ${i}:`, poolError?.message)
        pools.push({
          id: i,
          token: poolConfig?.address || '',
          name: poolConfig?.metadata?.description || `Pool #${i}`,
          protocolName: curator?.displayName || curator?.name || '',
          logo: poolConfig?.metadata?.logo || '',
          protocolLogo: poolConfig?.metadata?.protocolLogo || '',
          underlyingToken: poolConfig?.underlyingToken || '',
          poolType: poolConfig?.type || '',
          totalCoverageSold: '0',
          claimFeeBps: 0,
          riskRating: 'N/A',
          isPaused: false,
          feeRecipient: '0x0000000000000000000000000000000000000000',
          isYieldPool: false,
          usesEscrow: false,
          mutexGroupId: 0,
        })
      }
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
