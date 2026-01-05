export interface Version {
  label: string
  path: string
  isLatest?: boolean
  description?: string
}

export const versions: Version[] = [
  {
    label: 'v2 (Latest)',
    path: 'v2',
    isLatest: true,
    description: 'Current stable documentation',
  },
]

export const defaultVersion = versions.find((v) => v.isLatest) || versions[0]

export function getVersionByPath(path: string): Version | undefined {
  return versions.find((v) => v.path === path)
}

export function isLatestVersion(path: string): boolean {
  const version = getVersionByPath(path)
  return version?.isLatest || false
}
