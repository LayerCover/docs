/**
 * Centralized Curator/Vault Manager Configuration
 *
 * This is the single source of truth for all curator metadata.
 * Curators manage MetaMorpho vaults and provide risk management services.
 */

export interface CuratorMetadata {
  id: number;
  name: string;
  displayName: string;
  logo: string;
  description: string;
  type: 'protocol' | 'curator';
  category?: 'defi-protocol' | 'institutional' | 'specialist';
  website?: string;
  twitter?: string;
}

/**
 * All curators in the system
 * Includes both DeFi protocols (Aave, Compound, etc.) and specialized curators
 */
export const CURATORS: Record<number, CuratorMetadata> = {
  // None/Default
  0: {
    id: 0,
    name: 'None',
    displayName: 'None',
    logo: '',
    description: 'No curator',
    type: 'protocol',
  },

  // DeFi Protocol Curators (show under "Protocols" tab)
  1: {
    id: 1,
    name: 'Aave',
    displayName: 'Aave V3',
    logo: '/images/protocols/aave.png',
    description: 'Leading decentralized lending protocol',
    type: 'protocol',
    category: 'defi-protocol',
    website: 'https://aave.com',
    twitter: '@aave',
  },
  2: {
    id: 2,
    name: 'Compound',
    displayName: 'Compound',
    logo: '/images/protocols/compound.png',
    description: 'Autonomous money market protocol',
    type: 'protocol',
    category: 'defi-protocol',
    website: 'https://compound.finance',
    twitter: '@compoundfinance',
  },
  3: {
    id: 3,
    name: 'Morpho',
    displayName: 'Morpho',
    logo: '/images/protocols/morpho.png',
    description: 'Optimized lending protocol',
    type: 'protocol',
    category: 'defi-protocol',
    website: 'https://morpho.org',
    twitter: '@MorphoLabs',
  },
  4: {
    id: 4,
    name: 'Euler',
    displayName: 'Euler',
    logo: '/images/protocols/euler.png',
    description: 'Permissionless lending protocol',
    type: 'protocol',
    category: 'defi-protocol',
    website: 'https://www.euler.finance',
    twitter: '@eulerfinance',
  },

  // Specialized Vault Curators (show under "Vaults" tab)
  5: {
    id: 5,
    name: 'Steakhouse',
    displayName: 'Steakhouse Financial',
    logo: '/images/syndicates/steakhouse-financial.png',
    description: 'Institutional treasury management',
    type: 'curator',
    category: 'institutional',
    website: 'https://steakhouse.financial',
  },
  6: {
    id: 6,
    name: 'Gauntlet',
    displayName: 'Gauntlet',
    logo: '/images/syndicates/gauntlet.png',
    description: 'Financial modeling and risk management',
    type: 'curator',
    category: 'institutional',
    website: 'https://gauntlet.network',
    twitter: '@Gauntlet_xyz',
  },
  7: {
    id: 7,
    name: 'Core',
    displayName: 'Core',
    logo: '/images/protocols/core.png',
    description: 'DeFi infrastructure curator',
    type: 'curator',
    category: 'specialist',
  },
  8: {
    id: 8,
    name: 'Syrup',
    displayName: 'Syrup',
    logo: '/images/protocols/syrup.png',
    description: 'Yield optimization curator',
    type: 'curator',
    category: 'specialist',
  },
  9: {
    id: 9,
    name: 'Coinshift',
    displayName: 'Coinshift',
    logo: '/images/syndicates/coinshift.png',
    description: 'Treasury management platform',
    type: 'curator',
    category: 'institutional',
    website: 'https://coinshift.xyz',
    twitter: '@coinshift_xyz',
  },
  10: {
    id: 10,
    name: 'Re7 Labs',
    displayName: 'Re7 Labs',
    logo: '/images/syndicates/re7-labs.png',
    description: 'Vault management and optimization',
    type: 'curator',
    category: 'specialist',
    website: 'https://re7.capital',
  },
  11: {
    id: 11,
    name: 'MEV Capital',
    displayName: 'MEV Capital',
    logo: '/images/syndicates/mev-capital.png',
    description: 'MEV-focused vault management',
    type: 'curator',
    category: 'specialist',
  },
  12: {
    id: 12,
    name: 'Block Analitica',
    displayName: 'Block Analitica',
    logo: '/images/syndicates/block-analitica.png',
    description: 'Analytics-driven vault management',
    type: 'curator',
    category: 'specialist',
  },
  13: {
    id: 13,
    name: 'B.Protocol',
    displayName: 'B.Protocol',
    logo: '/images/syndicates/b.png',
    description: 'Backstop protocol vault curator',
    type: 'curator',
    category: 'specialist',
  },
};

/**
 * Get curator by ID
 */
export function getCurator(id: number | undefined | null): CuratorMetadata | undefined {
  if (id === undefined || id === null) return undefined;
  return CURATORS[id];
}

/**
 * Get curator name by ID
 */
export function getCuratorName(curatorId: number | undefined | null): string {
  if (curatorId === undefined || curatorId === null) return 'Unknown';
  return CURATORS[curatorId]?.name || 'Unknown';
}

/**
 * Get curator display name by ID
 */
export function getCuratorDisplayName(curatorId: number | undefined | null): string {
  if (curatorId === undefined || curatorId === null) return 'Unknown';
  return CURATORS[curatorId]?.displayName || CURATORS[curatorId]?.name || 'Unknown';
}

/**
 * Get curator logo by ID
 */
export function getCuratorLogo(id: number | undefined | null): string {
  if (id === undefined || id === null) return '/placeholder-logo.png';
  return CURATORS[id]?.logo || '/placeholder-logo.png';
}

/**
 * Get curator description by ID
 */
export function getCuratorDescription(id: number | undefined | null): string {
  if (id === undefined || id === null) return 'Unknown';
  return CURATORS[id]?.description || 'Unknown';
}

/**
 * Get all curators as an array
 */
export function getAllCurators(): CuratorMetadata[] {
  return Object.values(CURATORS);
}

/**
 * Get curators by type
 */
export function getCuratorsByType(type: 'protocol' | 'curator'): CuratorMetadata[] {
  return getAllCurators().filter((c) => c.type === type);
}

/**
 * Get protocol curators (Aave, Compound, Morpho, Euler)
 */
export function getProtocolCurators(): CuratorMetadata[] {
  return getCuratorsByType('protocol');
}

/**
 * Get specialized vault curators (Steakhouse, Gauntlet, etc.)
 */
export function getVaultCurators(): CuratorMetadata[] {
  return getCuratorsByType('curator');
}

/**
 * Curator names mapping for backward compatibility
 */
export const CURATOR_NAMES: Record<number, string> = Object.entries(CURATORS).reduce(
  (acc, [id, curator]) => {
    acc[Number(id)] = curator.name;
    return acc;
  },
  {} as Record<number, string>
);

/**
 * Curator display names mapping
 */
export const CURATOR_DISPLAY_NAMES: Record<number, string> = Object.entries(CURATORS).reduce(
  (acc, [id, curator]) => {
    acc[Number(id)] = curator.displayName;
    return acc;
  },
  {} as Record<number, string>
);
