import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface DocFrontmatter {
  title: string
  description?: string
  order?: number
  sidebar?: string
  tags?: string[]
  toc?: boolean
  draft?: boolean
  slug?: string | string[]
}

export interface DocPage {
  slug: string[]
  frontmatter: DocFrontmatter
  content: string
  version: string
  locale: string
}

export interface SidebarItem {
  title: string
  href?: string
  order: number
  children?: SidebarItem[]
}

const CONTENT_DIR = path.join(process.cwd(), 'content')

function buildDocHref(doc: DocPage): string {
  const slugPath = doc.slug.join('/')
  return slugPath ? `/${slugPath}` : '/'
}

function normalizeSlug(slug?: string | string[]): string[] | null {
  if (!slug) {
    return null
  }

  if (Array.isArray(slug)) {
    return slug
      .map((part) => `${part}`.trim())
      .filter((part) => part.length > 0)
  }

  if (typeof slug === 'string') {
    return slug
      .split('/')
      .map((part) => part.trim())
      .filter((part) => part.length > 0)
  }

  return null
}

export function getAllVersions(): string[] {
  try {
    return fs.readdirSync(CONTENT_DIR).filter((dir) => {
      const stat = fs.statSync(path.join(CONTENT_DIR, dir))
      return stat.isDirectory() && !dir.startsWith('.')
    })
  } catch {
    return []
  }
}

export function getAllLocales(version: string): string[] {
  try {
    const versionDir = path.join(CONTENT_DIR, version)
    return fs.readdirSync(versionDir).filter((dir) => {
      const stat = fs.statSync(path.join(versionDir, dir))
      return stat.isDirectory() && !dir.startsWith('.')
    })
  } catch {
    return ['en']
  }
}

export function getAllDocs(version: string, locale: string): DocPage[] {
  const docsDir = path.join(CONTENT_DIR, version, locale)

  if (!fs.existsSync(docsDir)) {
    return []
  }

  const docs: DocPage[] = []

  function readDir(dir: string, slugParts: string[] = []) {
    const files = fs.readdirSync(dir)

    for (const file of files) {
      const filePath = path.join(dir, file)
      const stat = fs.statSync(filePath)

      if (stat.isDirectory()) {
        readDir(filePath, [...slugParts, file])
      } else if (file.endsWith('.mdx') || file.endsWith('.md')) {
        const slug = file.replace(/\.mdx?$/, '')
        const fileContent = fs.readFileSync(filePath, 'utf-8')
        const { data, content } = matter(fileContent)

        // Skip drafts to hide unpublished sections
        if (data.draft) {
          continue
        }

        const frontmatter = data as DocFrontmatter
        const defaultSlug = [...slugParts, slug === 'index' ? '' : slug].filter(Boolean)
        const overrideSlug = normalizeSlug(frontmatter.slug)
        const finalSlug =
          overrideSlug && overrideSlug.length > 0 ? overrideSlug : defaultSlug

        docs.push({
          slug: finalSlug,
          frontmatter,
          content,
          version,
          locale,
        })
      }
    }
  }

  readDir(docsDir)
  return docs
}

export function getDocBySlug(
  version: string,
  locale: string,
  slug: string[]
): DocPage | null {
  const docs = getAllDocs(version, locale)
  return docs.find((doc) => doc.slug.join('/') === slug.join('/')) || null
}

export function buildSidebar(docs: DocPage[]): SidebarItem[] {
  const tree: SidebarItem[] = []
  const itemMap = new Map<string, SidebarItem>()

  // Sort docs so that top-level pages are processed before nested ones,
  // then by explicit order value, and finally by slug for stability.
  const sortedDocs = [...docs].sort((a, b) => {
    const depthDiff = a.slug.length - b.slug.length
    if (depthDiff !== 0) {
      return depthDiff
    }

    const orderA = a.frontmatter.order ?? 999
    const orderB = b.frontmatter.order ?? 999
    if (orderA !== orderB) {
      return orderA - orderB
    }

    return a.slug.join('/').localeCompare(b.slug.join('/'))
  })

  for (const doc of sortedDocs) {
    const { slug, frontmatter } = doc
    const title = frontmatter.sidebar || frontmatter.title
    const href = buildDocHref(doc)

    if (slug.length <= 1) {
      // Top-level item
      const item: SidebarItem = {
        title,
        href,
        order: frontmatter.order ?? 999,
      }
      tree.push(item)
      itemMap.set(slug[0], item)
    } else {
      // Nested item
      const parentSlug = slug.slice(0, -1).join('/')
      const parent = itemMap.get(parentSlug) || itemMap.get(slug[0])

      if (parent) {
        if (!parent.children) {
          parent.children = []
        }

        const item: SidebarItem = {
          title,
          href,
          order: frontmatter.order ?? 999,
        }
        parent.children.push(item)
        itemMap.set(slug.join('/'), item)
      }
    }
  }

  // Sort children recursively
  function sortChildren(items: SidebarItem[]) {
    items.sort((a, b) => a.order - b.order)
    for (const item of items) {
      if (item.children) {
        sortChildren(item.children)
      }
    }
  }

  sortChildren(tree)
  return tree
}

export function extractHeadings(content: string): { id: string; text: string; level: number }[] {
  const headingRegex = /^(#{2,4})\s+(.+)$/gm
  const headings: { id: string; text: string; level: number }[] = []
  let match

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length
    const text = match[2].trim()
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')

    headings.push({ id, text, level })
  }

  return headings
}

export function getPrevNext(
  docs: DocPage[],
  currentSlug: string[]
): { prev: DocPage | null; next: DocPage | null } {
  const sortedDocs = [...docs].sort((a, b) => {
    const orderA = a.frontmatter.order ?? 999
    const orderB = b.frontmatter.order ?? 999
    return orderA - orderB
  })

  const currentIndex = sortedDocs.findIndex(
    (doc) => doc.slug.join('/') === currentSlug.join('/')
  )

  if (currentIndex === -1) {
    return { prev: null, next: null }
  }

  return {
    prev: currentIndex > 0 ? sortedDocs[currentIndex - 1] : null,
    next: currentIndex < sortedDocs.length - 1 ? sortedDocs[currentIndex + 1] : null,
  }
}
