export interface PoolConfig {
  poolId: number;
  address: `0x${string}`;
  protocolId: number;
  underlyingToken: string; // symbol or address
  metadata?: {
    logo?: string;           // stablecoin logo
    protocolLogo?: string;   // protocol logo (if any)
    description?: string;    // pool description
    [key: string]: unknown;
  };
  type: string;
}

export type ChainPoolMap = Record<number, PoolConfig[]>;

const NONE = 0;
const AAVE = 1;
const COMPOUND = 2;
const MORPHO = 3;
const EULER = 4;
const STEAKHOUSE = 5;
const GAUNTLET = 6;
const CORE = 7;
const SYRUP = 8;
const COINSHIFT = 9;
const RE7LABS = 10;
const MEVCAPITAL = 11;
const BLOCKANALITICA = 12;
const BPROTOCOL = 13;

export const POOLS: ChainPoolMap = {
  8453: [],
  84532: [
    // Pool 0: USDC Stablecoin
    {
      poolId: 0,
      address: '0xdb17b0db251013464c6f9e2477ba79bce5d8dce3',
      protocolId: NONE,
      underlyingToken: 'USDC',
      metadata: {
        logo: '/images/stablecoins/usdc.png',
        description: 'Stablecoin'
      },
      type: 'stablecoin',
    },
    // Pools 1-4: USDC Protocol Vaults (show under Protocols tab)
    {
      poolId: 1,
      address: '0x570f655f223f75dfcdf3d8a47a8784a70bb2b1ce',
      protocolId: AAVE,
      underlyingToken: 'USDC',
      metadata: {
        logo: '/images/stablecoins/usdc.png',
        protocolLogo: '/images/protocols/aave.png',
        description: 'Aave USDC Vault',
      },
      type: 'protocol',
    },
    {
      poolId: 2,
      address: '0x5c1ba656d337b4fe75f46d66b24ac8944bf39fd2',
      protocolId: COMPOUND,
      underlyingToken: 'USDC',
      metadata: {
        logo: '/images/stablecoins/usdc.png',
        protocolLogo: '/images/protocols/compound.png',
        description: 'Compound USDC Vault',
      },
      type: 'protocol',
    },
    {
      poolId: 3,
      address: '0x0e59afcbd954df8f3c7797e1abd8913aef0cf42b',
      protocolId: MORPHO,
      underlyingToken: 'USDC',
      metadata: {
        logo: '/images/stablecoins/usdc.png',
        protocolLogo: '/images/protocols/morpho.png',
        description: 'Morpho USDC Vault',
      },
      type: 'protocol',
    },
    {
      poolId: 4,
      address: '0xab5b43766487d7815e41723c3b69e3c28c7ee8ad',
      protocolId: EULER,
      underlyingToken: 'USDC',
      metadata: {
        logo: '/images/stablecoins/usdc.png',
        protocolLogo: '/images/protocols/euler.png',
        description: 'Euler USDC Vault',
      },
      type: 'protocol',
    },
    // Pools 5-9: USDC Curator Vaults (show under Vaults tab)
    {
      poolId: 5,
      address: '0x6ed79aa1bab5770fc4346ec041a7d3092db171f4',
      protocolId: STEAKHOUSE,
      underlyingToken: 'USDC',
      metadata: {
        logo: '/images/stablecoins/usdc.png',
        protocolLogo: '/images/syndicates/steakhouse-financial.png',
        description: 'Steakhouse USDC Vault',
      },
      type: 'vault',
    },
    {
      poolId: 6,
      address: '0xae04553426288e38290ae1db2ed768bc04040995',
      protocolId: GAUNTLET,
      underlyingToken: 'USDC',
      metadata: {
        logo: '/images/stablecoins/usdc.png',
        protocolLogo: '/images/syndicates/gauntlet.png',
        description: 'Gauntlet USDC Vault',
      },
      type: 'vault',
    },
    {
      poolId: 7,
      address: '0x5528365342e2f682471caeac81cab57edac8403',
      protocolId: MEVCAPITAL,
      underlyingToken: 'USDC',
      metadata: {
        logo: '/images/stablecoins/usdc.png',
        protocolLogo: '/images/syndicates/mev-capital.png',
        description: 'MEV Capital USDC Vault',
      },
      type: 'vault',
    },
    {
      poolId: 8,
      address: '0x8aa6ddac9ff39f850ac8a581e6a4c417e9734fc8',
      protocolId: BLOCKANALITICA,
      underlyingToken: 'USDC',
      metadata: {
        logo: '/images/stablecoins/usdc.png',
        protocolLogo: '/images/syndicates/block-analitica.png',
        description: 'Block Analitica USDC Vault',
      },
      type: 'vault',
    },
    {
      poolId: 9,
      address: '0xfb0cf25f47b51b39896fbf0726fc78f596f8ec34',
      protocolId: BPROTOCOL,
      underlyingToken: 'USDC',
      metadata: {
        logo: '/images/stablecoins/usdc.png',
        protocolLogo: '/images/syndicates/b.png',
        description: 'B.Protocol USDC Vault',
      },
      type: 'vault',
    },
    // Pool 10: Re7 Labs USDT Vault
    {
      poolId: 10,
      address: '0x50dae2b877a71330dcfd1dcdafb087376526538d',
      protocolId: RE7LABS,
      underlyingToken: 'USDT',
      metadata: {
        logo: '/images/stablecoins/usdt.png',
        protocolLogo: '/images/syndicates/re7-labs.png',
        description: 'Re7 Labs USDT Vault',
      },
      type: 'vault',
    },
    // Pool 11: DAI Stablecoin
    {
      poolId: 11,
      address: '0xdd758ad67dc25914b17da6602a190e266a0b0772',
      protocolId: NONE,
      underlyingToken: 'DAI',
      metadata: {
        logo: '/images/stablecoins/dai.svg',
        description: 'Stablecoin'
      },
      type: 'stablecoin',
    },
    // Pools 12-15: DAI Protocol Vaults (show under Protocols tab)
    {
      poolId: 12,
      address: '0x039433c1ef9587f6d344bbd7715e44fb879b0f6b',
      protocolId: AAVE,
      underlyingToken: 'DAI',
      metadata: {
        logo: '/images/stablecoins/dai.svg',
        protocolLogo: '/images/protocols/aave.png',
        description: 'Aave DAI Vault',
      },
      type: 'protocol',
    },
    {
      poolId: 13,
      address: '0xaab5535aa81bacd3342f5edb25f4e4439d0debc0',
      protocolId: COMPOUND,
      underlyingToken: 'DAI',
      metadata: {
        logo: '/images/stablecoins/dai.svg',
        protocolLogo: '/images/protocols/compound.png',
        description: 'Compound DAI Vault',
      },
      type: 'protocol',
    },
    {
      poolId: 14,
      address: '0xce750f44b5379adfe8b31365b8de195137654284',
      protocolId: MORPHO,
      underlyingToken: 'DAI',
      metadata: {
        logo: '/images/stablecoins/dai.svg',
        protocolLogo: '/images/protocols/morpho.png',
        description: 'Morpho DAI Vault',
      },
      type: 'protocol',
    },
    {
      poolId: 15,
      address: '0x00cb41ef34a971536ea299b0dc0eb323ad2ecefb',
      protocolId: EULER,
      underlyingToken: 'DAI',
      metadata: {
        logo: '/images/stablecoins/dai.svg',
        protocolLogo: '/images/protocols/euler.png',
        description: 'Euler DAI Vault',
      },
      type: 'protocol',
    },
    // Pools 16-20: DAI & USDC Curator Vaults (show under Vaults tab)
    {
      poolId: 16,
      address: '0xb715d91deb4f6f139a75bc21ea132b89905f8e50',
      protocolId: STEAKHOUSE,
      underlyingToken: 'DAI',
      metadata: {
        logo: '/images/stablecoins/dai.svg',
        protocolLogo: '/images/syndicates/steakhouse-financial.png',
        description: 'Steakhouse DAI Vault',
      },
      type: 'vault',
    },
    {
      poolId: 17,
      address: '0x21780543746f2f2047ec12c8900fce5334f3a8da',
      protocolId: GAUNTLET,
      underlyingToken: 'DAI',
      metadata: {
        logo: '/images/stablecoins/dai.svg',
        protocolLogo: '/images/syndicates/gauntlet.png',
        description: 'Gauntlet DAI Vault',
      },
      type: 'vault',
    },
    {
      poolId: 18,
      address: '0xa5bd4a087fb7e88cfc973116daca5925ef23215f',
      protocolId: MEVCAPITAL,
      underlyingToken: 'DAI',
      metadata: {
        logo: '/images/stablecoins/dai.svg',
        protocolLogo: '/images/syndicates/mev-capital.png',
        description: 'MEV Capital DAI Vault',
      },
      type: 'vault',
    },
    {
      poolId: 19,
      address: '0x47b9e3ac7a3d880ecefefc5061f2b4845cb04804',
      protocolId: BLOCKANALITICA,
      underlyingToken: 'DAI',
      metadata: {
        logo: '/images/stablecoins/dai.svg',
        protocolLogo: '/images/syndicates/block-analitica.png',
        description: 'Block Analitica DAI Vault',
      },
      type: 'vault',
    },
    {
      poolId: 20,
      address: '0x3e54e76f1c70a8d29008fc341773addac6c8c011',
      protocolId: GAUNTLET,
      underlyingToken: 'USDC',
      metadata: {
        logo: '/images/stablecoins/usdc.png',
        protocolLogo: '/images/syndicates/gauntlet.png',
        description: 'Gauntlet USDC Vault',
      },
      type: 'vault',
    },
    // Pool 21: Re7 Labs DAI Vault
    {
      poolId: 21,
      address: '0xbd6449a1ef9344c1b2e86c7d866bbcbd293a6adf',
      protocolId: RE7LABS,
      underlyingToken: 'DAI',
      metadata: {
        logo: '/images/stablecoins/dai.svg',
        protocolLogo: '/images/syndicates/re7-labs.png',
        description: 'Re7 Labs DAI Vault',
      },
      type: 'vault',
    },
    // Pool 22: USDT Stablecoin
    {
      poolId: 22,
      address: '0x474c479bec727d24f833365db2a929bd55acc7ea',
      protocolId: NONE,
      underlyingToken: 'USDT',
      metadata: {
        logo: '/images/stablecoins/usdt.png',
        description: 'Stablecoin'
      },
      type: 'stablecoin',
    },
    // Pools 23-26: USDT Protocol Vaults (show under Protocols tab)
    {
      poolId: 23,
      address: '0x1e1068cba4dc3c8cd04785a44b3da8def2a99d45',
      protocolId: AAVE,
      underlyingToken: 'USDT',
      metadata: {
        logo: '/images/stablecoins/usdt.png',
        protocolLogo: '/images/protocols/aave.png',
        description: 'Aave USDT Vault',
      },
      type: 'protocol',
    },
    {
      poolId: 24,
      address: '0x44b12f64403d285404c032270eee548ac93756cd',
      protocolId: COMPOUND,
      underlyingToken: 'USDT',
      metadata: {
        logo: '/images/stablecoins/usdt.png',
        protocolLogo: '/images/protocols/compound.png',
        description: 'Compound USDT Vault',
      },
      type: 'protocol',
    },
    {
      poolId: 25,
      address: '0x8593c78c290b30ef84c20e3200e2377373f9da70',
      protocolId: MORPHO,
      underlyingToken: 'USDT',
      metadata: {
        logo: '/images/stablecoins/usdt.png',
        protocolLogo: '/images/protocols/morpho.png',
        description: 'Morpho USDT Vault',
      },
      type: 'protocol',
    },
    {
      poolId: 26,
      address: '0x61b23e0262b61f4bd58418beff471254c470462e',
      protocolId: EULER,
      underlyingToken: 'USDT',
      metadata: {
        logo: '/images/stablecoins/usdt.png',
        protocolLogo: '/images/protocols/euler.png',
        description: 'Euler USDT Vault',
      },
      type: 'protocol',
    },
    // Pools 27-32: USDT Curator Vaults (show under Vaults tab)
    {
      poolId: 27,
      address: '0xdd64812bb9b011382d59963cf33e395876083f28',
      protocolId: STEAKHOUSE,
      underlyingToken: 'USDT',
      metadata: {
        logo: '/images/stablecoins/usdt.png',
        protocolLogo: '/images/syndicates/steakhouse-financial.png',
        description: 'Steakhouse USDT Vault',
      },
      type: 'vault',
    },
    {
      poolId: 28,
      address: '0xb781266f30d2ab47e7bc4daf2f15ef9d30e4b6af',
      protocolId: GAUNTLET,
      underlyingToken: 'USDT',
      metadata: {
        logo: '/images/stablecoins/usdt.png',
        protocolLogo: '/images/syndicates/gauntlet.png',
        description: 'Gauntlet USDT Vault',
      },
      type: 'vault',
    },
    {
      poolId: 29,
      address: '0x49ee1d8f80a0b9bf218b3929107033549a14247a',
      protocolId: MEVCAPITAL,
      underlyingToken: 'USDT',
      metadata: {
        logo: '/images/stablecoins/usdt.png',
        protocolLogo: '/images/syndicates/mev-capital.png',
        description: 'MEV Capital USDT Vault',
      },
      type: 'vault',
    },
    {
      poolId: 30,
      address: '0x55503c76b43fdf15a50b942a499517fe79517d4c',
      protocolId: BLOCKANALITICA,
      underlyingToken: 'USDT',
      metadata: {
        logo: '/images/stablecoins/usdt.png',
        protocolLogo: '/images/syndicates/block-analitica.png',
        description: 'Block Analitica USDT Vault',
      },
      type: 'vault',
    },
    {
      poolId: 31,
      address: '0x37b5d9d4a2b75b35666184ebf8c66b789dde92b2',
      protocolId: BPROTOCOL,
      underlyingToken: 'USDT',
      metadata: {
        logo: '/images/stablecoins/usdt.png',
        protocolLogo: '/images/syndicates/b.png',
        description: 'B.Protocol USDT Vault',
      },
      type: 'vault',
    },
    {
      poolId: 32,
      address: '0xb3771389328e1cfd854a77598aab075b976faa7b',
      protocolId: RE7LABS,
      underlyingToken: 'USDT',
      metadata: {
        logo: '/images/stablecoins/usdt.png',
        protocolLogo: '/images/syndicates/re7-labs.png',
        description: 'Re7 Labs USDT Vault',
      },
      type: 'vault',
    },
    // Pools 33-36: Stablecoins
    {
      poolId: 33,
      address: '0xb57594b125e5cb06b68e8e01c03ba4a9e3213ae8',
      protocolId: NONE,
      underlyingToken: 'PYUSD',
      metadata: {
        logo: '/images/stablecoins/pyusd.png',
        description: 'Stablecoin'
      },
      type: 'stablecoin',
    },
    {
      poolId: 34,
      address: '0x6462c85757ec6465a043318a44148d2b4c82c4b3',
      protocolId: NONE,
      underlyingToken: 'FDUSD',
      metadata: {
        logo: '/images/stablecoins/fdusd.png',
        description: 'Stablecoin'
      },
      type: 'stablecoin',
    },
    {
      poolId: 35,
      address: '0x5e97079dd55fd3f81d3f1cefc256e93310532dbb',
      protocolId: NONE,
      underlyingToken: 'USD1',
      metadata: {
        logo: '/images/stablecoins/usd1.png',
        description: 'Stablecoin'
      },
      type: 'stablecoin',
    },
    {
      poolId: 36,
      address: '0x6b3483395164ab5abdb0b6a1a2c0ff8d401c761a',
      protocolId: NONE,
      underlyingToken: 'USDE',
      metadata: {
        logo: '/images/stablecoins/usde.png',
        description: 'Stablecoin'
      },
      type: 'stablecoin',
    },
  ],
  80002: [],
  11155111: [],
  43113: [], // Avalanche Fuji
  97: [], // BNB Testnet
  4002: [], // Fantom Testnet
};

export default POOLS;
