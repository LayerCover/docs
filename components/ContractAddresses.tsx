'use client'

import { Fragment, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { ExternalLink, Copy, Check, ChevronDown } from 'lucide-react'

interface Contract {
  name: string
  address: string
  abi?: string
}

interface NetworkData {
  name: string
  logo: string
  chainId: number
  explorer: string
  contracts: {
    core: Contract[]
    supporting: Contract[]
    yieldAdapters: Contract[]
    factories?: Contract[]
    implementations?: Contract[]
    libraries?: Contract[]
    oraclesAndData?: Contract[]
    testTokens?: Contract[]
    matching?: Contract[]
    operations?: Contract[]
  }
}


// Base Sepolia addresses — synced from deployments/base_sepolia/usdc.json
// Run: node scripts/sync-addresses.js  to refresh after deployment
const baseSepoliaAddresses: Record<string, string> = {
  PolicyManager: '0xbd0Cb34253c84201F746F0A9DF062d82c0823c56',
  PolicyNFT: '0x0Dd77E091BeA95793f6a853928ecF1C31606bE26',
  RiskManager: '0x132cD9EDb510dffaA81554753D0713cF546aDD77',
  PoolRegistry: '0xB65cE4662FFB20aE7Ddd7314B975F8A1b6dA4e59',
  CapitalPool: '0xe0324E62990AB2d89D8b883B201ED0BcD860AD7E',
  UnderwriterManager: '',
  RewardDistributor: '0x5c4BB0b5076C10d139930F05767570A7cfDcF1e7',
  LossDistributor: '',
  SharedAssetController: '0x30911b930A8d52D1A8D70fDd14fDB876a34F4944',
  ReinsuranceController: '0x30911b930A8d52D1A8D70fDd14fDB876a34F4944',
  WithdrawalQueue: '',
  RateEngine: '',
  ReferralManager: '0x7dcA6B6f8AaB90c79280153D0Aef03018D2740c7',
  GovernanceToken: '0x09139808A2Cf6B11B7e351Bf3E980776cA43d9F2',
  StakingContract: '',
  Committee: '',
  AaveAdapter: '0x81c9332abFd74Cef1163CB0d2a40eE95b5b6a867',
  CompoundAdapter: '0xc0ccF80d3767E69675c18a549d705D76C114B1Ee',
  IntentMatcher: '0x7865f2e07dFe0d4dC4345bF5DFFFAd757a901337',
  IntentOrderBook: '',
  SyndicateFactory: '0x5688ab791402f5449973A078711dB889FA1fcA3B',
  TrancheVaultFactory: '',
  GovernorVaultFactory: '',
  SyndicateImplementation: '0x21D8827717f0e51566786EC29dEDD6685a0Eb1e8',
  EscrowVaultImpl: '',
  GovernorVaultImplementation: '',
  PolicyManagerLifecycle: '',
  PolicyManagerPremium: '',
  PolicyManagerAdmin: '',
  JuniorTrancheVault: '',
  MezzanineTrancheVault: '',
  SeniorTrancheVault: '',
  SyndicateDurationLib: '0xB442c2f94e21454cCd0B542a9991193eD40Ca8D6',
  SyndicateIntentLib: '0x1b338766ef3e0E31e879403c90CD2458E3d0F894',
  SyndicateYieldOperationsLib: '',
  PriceOracle: '0xF9A0925B3558858B53E0990Fe64A12815a4023Ff',
  TestnetPriceFeed: '',
  MulticallReader: '0x518ae7741684a369953E05f1833222e92117528b',
  MulticallReaderV2: '0x518ae7741684a369953E05f1833222e92117528b',
  UserDataAggregator: '0x246d4E970A2B542BF70df7bf01D32A8c49E4076F',
  PoolDataAggregator: '0x7A0fa269c33BD9A104E742866745Abe9a82cC22F',
  DeploymentRegistry: '',
  InsuredWithdrawRouter: '',
  PayoutManager: '0xF28f014fc1a7681179A7f776948892dccd32Eaa2',
  PoolAllocationManager: '0xAdBEb602b8d05287bd93c2de51aa4F3faE2fC9a9',
  YieldStrategyManager: '0x980708f7aa1F6c61805Cc8e7374Ec1844d252297',
  ProtocolConfigurator: '0x3DBA694B78fc6d2043233E7234AcE2E3d8158Ba6',
}

const networks: NetworkData[] = [
  {
    name: 'Base Mainnet',
    logo: '/images/networks/base.png',
    chainId: 8453,
    explorer: 'https://basescan.org',
    contracts: {
      core: [
        { name: 'PolicyManager', address: '0x23394d1a487288431a19f13b01da8213a00edcbe', abi: 'PolicyManager.json' },
        { name: 'PolicyNFT', address: '0xceacc572f02f7a3e35fe4d31dd0cee36cf32d527', abi: 'PolicyNFT.json' },
        { name: 'RiskManager', address: '0x329dd27b6fdfb0509e9e337396188326cf1a5e0c', abi: 'RiskManager.json' },
        { name: 'PoolRegistry', address: '0xc749c0517081114c2d8b96be7265486ee522bc62', abi: 'PoolRegistry.json' },
        { name: 'CapitalPool', address: '0xc93a5986f6acd6c9ca69ad769a11260880815826', abi: 'CapitalPool.json' },
        { name: 'UnderwriterManager', address: '0xcfb174051a6a76121992c24afcc0df488d66390a', abi: 'UnderwriterManager.json' },
        { name: 'BackstopPool (CAT)', address: '0xdaca2428a17e9a2727c33f591d8afcff06a31a40', abi: 'BackstopPool.json' },
        { name: 'RewardDistributor', address: '0x7c2a15ed03dac7079361ba37af6fe61a3cc0daed', abi: 'RewardDistributor.json' },
        { name: 'LossDistributor', address: '0xf304fa655ee90a64af9272fde71c011873c67bd9', abi: 'LossDistributor.json' },
      ],
      supporting: [
        { name: 'ReferralManager', address: '0x6e42e667b5e22cb030fcbf32381d9ba3d72c08cb', abi: 'ReferralManager.json' },
        { name: 'GovernanceToken', address: '0xa5fb84678c3ecf16079ae434127a329ada2f41af', abi: 'GovernanceToken.json' },
        { name: 'Staking', address: '0xa83d3d4bd8a85dda350d03a90adc449a2b66fe29', abi: 'Staking.json' },
        { name: 'Timelock', address: '0x166d8f217657e6bfdcfc8da1076acfc028f0643b', abi: 'Timelock.json' },
        { name: 'Committee', address: '0xed720c6b0c4d5993177800f0b8b47234ee128208', abi: 'Committee.json' },
      ],
      yieldAdapters: [
        { name: 'AaveV3Adapter', address: '0xd2c796e3b4bcf8512cc8aabd948264fc045f24cb', abi: 'AaveV3Adapter.json' },
        { name: 'CompoundV3Adapter', address: '0xcf270e4989d46e0cd8616aecbc4f111e911e428b', abi: 'CompoundV3Adapter.json' },
      ],
      matching: [
        { name: 'IntentMatcher', address: '0x2212d187113971e878eee6a37f0da1908ad4147e', abi: 'IntentMatcher.json' },
        { name: 'IntentOrderBook', address: '0x2a193c4e59262605cb7a47930030a9c6e998309d', abi: 'IntentOrderBook.json' },
        { name: 'SyndicateVault (Default)', address: '0xf7bee18f1781389b3e42900b23a02ddb6084130e', abi: 'SyndicateVault.json' },
      ],
      operations: [
        { name: 'PayoutManager', address: '0xe3b110dbe3f6603b17588df11b15877cf17b0a03', abi: 'PayoutManager.json' },
        { name: 'PoolAllocationManager', address: '0xe0fd62c617b97d9741e3fb13ea358b0709ce6a5c', abi: 'PoolAllocationManager.json' },
        { name: 'YieldRouter', address: '0x6bff4d11f3ff00352d5a85466b6114421e319866', abi: 'YieldRouter.json' },
        { name: 'RiskAdminIntentConfig', address: '0xe1bf200de11b376a50508b65e5bcd7c2b243b2c4', abi: 'RiskAdminIntentConfig.json' },
        { name: 'Treasury Multisig', address: '0xf9e53b06b000f1eeb355a4a9024471f38977076b' },
      ],
    },
  },
  {
    name: 'Base Sepolia',
    logo: '/images/networks/base.png',
    chainId: 84532,
    explorer: 'https://sepolia.basescan.org',
    contracts: {
      core: [
        { name: 'PolicyManager', address: baseSepoliaAddresses.PolicyManager, abi: 'PolicyManager.json' },
        { name: 'PolicyNFT', address: baseSepoliaAddresses.PolicyNFT, abi: 'PolicyNFT.json' },
        { name: 'RiskManager', address: baseSepoliaAddresses.RiskManager, abi: 'RiskManager.json' },
        { name: 'PoolRegistry', address: baseSepoliaAddresses.PoolRegistry, abi: 'PoolRegistry.json' },
        { name: 'CapitalPool', address: baseSepoliaAddresses.CapitalPool, abi: 'CapitalPool.json' },
        { name: 'UnderwriterManager', address: baseSepoliaAddresses.UnderwriterManager, abi: 'UnderwriterManager.json' },
        { name: 'BackstopPool (CAT)', address: '0xdb486999b65c9E943B8a15c2dfa71D61D64148c0', abi: 'BackstopPool.json' },
        { name: 'RewardDistributor', address: baseSepoliaAddresses.RewardDistributor, abi: 'RewardDistributor.json' },
        { name: 'LossDistributor', address: baseSepoliaAddresses.LossDistributor, abi: 'LossDistributor.json' },
        { name: 'SharedAssetController', address: baseSepoliaAddresses.SharedAssetController, abi: 'SharedAssetController.json' },
        { name: 'ReinsuranceController', address: baseSepoliaAddresses.ReinsuranceController, abi: 'ReinsuranceController.json' },
        { name: 'WithdrawalQueue', address: baseSepoliaAddresses.WithdrawalQueue, abi: 'WithdrawalQueue.json' },
        { name: 'RateEngine', address: baseSepoliaAddresses.RateEngine, abi: 'RateEngine.json' },
      ],
      supporting: [
        { name: 'ReferralManager', address: baseSepoliaAddresses.ReferralManager, abi: 'ReferralManager.json' },
        { name: 'GovernanceToken', address: baseSepoliaAddresses.GovernanceToken, abi: 'GovernanceToken.json' },
        { name: 'Staking', address: baseSepoliaAddresses.StakingContract, abi: 'Staking.json' },
        { name: 'Committee', address: baseSepoliaAddresses.Committee, abi: 'Committee.json' },
      ],
      yieldAdapters: [
        { name: 'AaveV3Adapter', address: baseSepoliaAddresses.AaveAdapter, abi: 'AaveV3Adapter.json' },
        { name: 'CompoundV3Adapter', address: baseSepoliaAddresses.CompoundAdapter, abi: 'CompoundV3Adapter.json' },
      ],
      matching: [
        { name: 'IntentMatcher', address: baseSepoliaAddresses.IntentMatcher, abi: 'IntentMatcher.json' },
        { name: 'IntentOrderBook', address: baseSepoliaAddresses.IntentOrderBook, abi: 'IntentOrderBook.json' },
      ],
      factories: [
        { name: 'SyndicateFactory', address: baseSepoliaAddresses.SyndicateFactory, abi: 'SyndicateFactory.json' },
        { name: 'TrancheVaultFactory', address: baseSepoliaAddresses.TrancheVaultFactory, abi: 'TrancheVaultFactory.json' },
        { name: 'GovernorVaultFactory', address: baseSepoliaAddresses.GovernorVaultFactory, abi: 'GovernorVaultFactory.json' },
      ],
      implementations: [
        { name: 'SyndicateImplementation', address: baseSepoliaAddresses.SyndicateImplementation, abi: 'Syndicate.json' },
        { name: 'EscrowVaultImpl', address: baseSepoliaAddresses.EscrowVaultImpl, abi: 'EscrowVault.json' },
        { name: 'GovernorVaultImplementation', address: baseSepoliaAddresses.GovernorVaultImplementation, abi: 'GovernorVault.json' },
        { name: 'PolicyManagerLifecycle', address: baseSepoliaAddresses.PolicyManagerLifecycle, abi: 'PolicyManagerLifecycle.json' },
        { name: 'PolicyManagerPremium', address: baseSepoliaAddresses.PolicyManagerPremium, abi: 'PolicyManagerPremium.json' },
        { name: 'PolicyManagerAdmin', address: baseSepoliaAddresses.PolicyManagerAdmin, abi: 'PolicyManagerAdmin.json' },
        { name: 'JuniorTrancheVault', address: baseSepoliaAddresses.JuniorTrancheVault, abi: 'JuniorTrancheVault.json' },
        { name: 'MezzanineTrancheVault', address: baseSepoliaAddresses.MezzanineTrancheVault, abi: 'MezzanineTrancheVault.json' },
        { name: 'SeniorTrancheVault', address: baseSepoliaAddresses.SeniorTrancheVault, abi: 'SeniorTrancheVault.json' },
      ],
      libraries: [
        { name: 'SyndicateDurationLib', address: baseSepoliaAddresses.SyndicateDurationLib, abi: 'SyndicateDurationLib.json' },
        { name: 'SyndicateIntentLib', address: baseSepoliaAddresses.SyndicateIntentLib, abi: 'SyndicateIntentLib.json' },
        { name: 'SyndicateYieldOperationsLib', address: baseSepoliaAddresses.SyndicateYieldOperationsLib, abi: 'SyndicateYieldOperationsLib.json' },
      ],
      oraclesAndData: [
        { name: 'PriceOracle', address: baseSepoliaAddresses.PriceOracle, abi: 'PriceOracle.json' },
        { name: 'TestnetPriceFeed', address: baseSepoliaAddresses.TestnetPriceFeed, abi: 'TestnetPriceFeed.json' },
        { name: 'MulticallReader', address: baseSepoliaAddresses.MulticallReader, abi: 'MulticallReader.json' },
        { name: 'MulticallReaderV2', address: baseSepoliaAddresses.MulticallReaderV2, abi: 'MulticallReader.json' },
        { name: 'UserDataAggregator', address: baseSepoliaAddresses.UserDataAggregator, abi: 'UserDataAggregator.json' },
        { name: 'PoolDataAggregator', address: baseSepoliaAddresses.PoolDataAggregator, abi: 'PoolDataAggregator.json' },
        { name: 'DeploymentRegistry', address: baseSepoliaAddresses.DeploymentRegistry, abi: 'DeploymentRegistry.json' },
        { name: 'InsuredWithdrawRouter', address: baseSepoliaAddresses.InsuredWithdrawRouter, abi: 'InsuredWithdrawRouter.json' },
      ],
      operations: [
        { name: 'PayoutManager', address: baseSepoliaAddresses.PayoutManager, abi: 'PayoutManager.json' },
        { name: 'PoolAllocationManager', address: baseSepoliaAddresses.PoolAllocationManager, abi: 'PoolAllocationManager.json' },
        { name: 'YieldStrategyManager', address: baseSepoliaAddresses.YieldStrategyManager, abi: 'YieldStrategyManager.json' },
        { name: 'ProtocolConfigurator', address: baseSepoliaAddresses.ProtocolConfigurator, abi: 'ProtocolConfigurator.json' },
      ],
      testTokens: [
        { name: 'Test USDC', address: '0xcf3aafb1ebddc61f64463091cdb6f7e6287fe437', abi: 'ERC20.json' },
        { name: 'Test AAVE', address: '0x2577d99f175993e45567b971994d869a08b3fc96', abi: 'ERC20.json' },
      ],
    },
  },
]

const visibleNetworks = networks.filter((network) => network.chainId === 84532)
const selectableNetworks = visibleNetworks.length > 0 ? visibleNetworks : networks

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="p-1 hover:bg-muted rounded transition-colors"
      title="Copy address"
    >
      {copied ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <Copy className="h-4 w-4 text-muted-foreground" />
      )}
    </button>
  )
}

function ContractTable({
  contracts,
  explorer,
}: {
  contracts: Contract[]
  explorer: string
}) {
  // Filter out contracts with undefined addresses
  const validContracts = contracts.filter((contract) => contract.address)

  if (validContracts.length === 0) {
    return <p className="text-muted-foreground text-sm">No contracts deployed</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 font-semibold">Contract</th>
            <th className="text-left py-3 px-4 font-semibold">Address</th>
            <th className="text-left py-3 px-4 font-semibold">ABI</th>
          </tr>
        </thead>
        <tbody>
          {validContracts.map((contract) => (
            <tr key={contract.address} className="border-b border-border hover:bg-muted/50 transition-colors">
              <td className="py-3 px-4 font-medium">{contract.name}</td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <a
                    href={`${explorer}/address/${contract.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-mono text-xs flex items-center gap-1"
                  >
                    {contract.address.slice(0, 6)}...{contract.address.slice(-4)}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  <CopyButton text={contract.address} />
                </div>
              </td>
              <td className="py-3 px-4">
                {contract.abi ? (
                  <a
                    href={`https://github.com/layercover/monorepo/blob/main/packages/contracts/abis/${contract.abi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    {contract.abi}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  '-'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function ContractAddresses() {
  const [network, setNetwork] = useState<NetworkData>(selectableNetworks[0] ?? networks[0])

  return (
    <div className="space-y-6">
      {/* Network Selector */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">Network:</span>
        <Listbox value={network} onChange={setNetwork}>
          <div className="relative mt-1 w-72">
            <Listbox.Button className="flex w-full items-center gap-3 rounded-lg border border-border bg-background px-4 py-2 text-left shadow-sm transition-colors hover:border-primary/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40">
              <img src={network.logo} alt={`${network.name} logo`} className="h-7 w-7 rounded-md" />
              <div className="flex flex-1 flex-col">
                <span className="text-sm font-semibold leading-tight">{network.name}</span>
                <span className="text-xs text-muted-foreground">Chain ID: {network.chainId}</span>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Listbox.Options className="absolute z-20 mt-2 max-h-72 w-full overflow-auto rounded-lg border border-border bg-background p-1 text-sm shadow-lg focus:outline-none">
                {selectableNetworks.map((net) => (
                  <Listbox.Option
                    key={net.chainId}
                    value={net}
                    className={({ active }) =>
                      `flex cursor-pointer select-none items-center gap-3 rounded-md px-3 py-2 transition-colors ${active ? 'bg-primary/10 text-primary' : 'text-foreground'
                      }`
                    }
                  >
                    {({ selected }) => (
                      <>
                        <img src={net.logo} alt={`${net.name} logo`} className="h-6 w-6 rounded-md" />
                        <div className="flex flex-1 flex-col">
                          <span className="font-medium">{net.name}</span>
                          <span className="text-xs text-muted-foreground">Chain ID: {net.chainId}</span>
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

      {/* Core Contracts */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Core Contracts</h3>
        <ContractTable contracts={network.contracts.core} explorer={network.explorer} />
      </div>

      {/* Supporting Contracts */}
      {network.contracts.supporting.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Supporting Contracts</h3>
          <ContractTable contracts={network.contracts.supporting} explorer={network.explorer} />
        </div>
      )}

      {/* Yield Adapters */}
      {network.contracts.yieldAdapters.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Yield Adapters</h3>
          <ContractTable contracts={network.contracts.yieldAdapters} explorer={network.explorer} />
        </div>
      )}

      {/* Matching & Intent */}
      {network.contracts.matching && network.contracts.matching.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Intent & Matching</h3>
          <ContractTable contracts={network.contracts.matching} explorer={network.explorer} />
        </div>
      )}

      {/* Factories */}
      {network.contracts.factories && network.contracts.factories.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Factories</h3>
          <ContractTable contracts={network.contracts.factories} explorer={network.explorer} />
        </div>
      )}

      {/* Implementations */}
      {network.contracts.implementations && network.contracts.implementations.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Implementations</h3>
          <ContractTable contracts={network.contracts.implementations} explorer={network.explorer} />
        </div>
      )}

      {/* Libraries */}
      {network.contracts.libraries && network.contracts.libraries.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Libraries</h3>
          <ContractTable contracts={network.contracts.libraries} explorer={network.explorer} />
        </div>
      )}

      {/* Oracles & Data */}
      {network.contracts.oraclesAndData && network.contracts.oraclesAndData.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Oracles & Data</h3>
          <ContractTable contracts={network.contracts.oraclesAndData} explorer={network.explorer} />
        </div>
      )}

      {/* Operations & Utilities */}
      {network.contracts.operations && network.contracts.operations.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Operations & Utilities</h3>
          <ContractTable contracts={network.contracts.operations} explorer={network.explorer} />
        </div>
      )}

      {/* Test Tokens */}
      {network.contracts.testTokens && network.contracts.testTokens.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Test Tokens</h3>
          <ContractTable contracts={network.contracts.testTokens} explorer={network.explorer} />
        </div>
      )}
    </div>
  )
}
