import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import {
  getAllDocs,
  getAllVersions,
  getDocBySlug,
  buildSidebar,
  extractHeadings,
  getPrevNext,
  type DocPage,
} from '@/lib/content/loader'
import { defaultVersion } from '@/lib/versions'
import { Sidebar } from '@/components/docs/Sidebar'
import { RightTOC } from '@/components/docs/RightTOC'
import { Breadcrumbs } from '@/components/docs/Breadcrumbs'
import { PrevNext } from '@/components/docs/PrevNext'
import { Header } from '@/components/docs/Header'
import { Footer } from '@/components/docs/Footer'
import { MDXContent } from '@/components/MDXContent'

interface PageProps {
  params: {
    slug?: string[]
  }
}

const DEFAULT_SLUG_CANDIDATES: string[][] = [
  ['getting-started'],
  ['introduction', 'protocol-overview'],
]

function resolveVersion(versionParam?: string) {
  const availableVersions = getAllVersions()
  const preferredVersion = defaultVersion?.path

  if (versionParam) {
    if (availableVersions.includes(versionParam)) {
      return versionParam
    }
    return null
  }

  if (preferredVersion && availableVersions.includes(preferredVersion)) {
    return preferredVersion
  }
  if (availableVersions.length > 0) {
    return availableVersions[0]
  }

  return preferredVersion || null
}

function resolveSlug(slugParam: string[] | undefined, docs: DocPage[]): string[] {
  if (slugParam && slugParam.length > 0) {
    return slugParam
  }

  for (const candidate of DEFAULT_SLUG_CANDIDATES) {
    if (docs.some((doc) => doc.slug.join('/') === candidate.join('/'))) {
      return candidate
    }
  }

  const sortedDocs = [...docs].sort((a, b) => {
    const orderA = a.frontmatter.order ?? 999
    const orderB = b.frontmatter.order ?? 999
    if (orderA !== orderB) {
      return orderA - orderB
    }
    return a.slug.join('/').localeCompare(b.slug.join('/'))
  })

  return sortedDocs[0]?.slug || []
}

function splitVersionFromSlug(slugParam?: string[]) {
  const segments = (slugParam || []).filter((segment) => segment && segment.length > 0)
  const availableVersions = new Set(getAllVersions())

  if (segments.length > 0 && availableVersions.has(segments[0])) {
    return {
      versionParam: segments[0],
      slugSegments: segments.slice(1),
    }
  }

  return {
    versionParam: undefined,
    slugSegments: segments.length > 0 ? segments : undefined,
  }
}

export async function generateStaticParams() {
  const versions = getAllVersions()
  const seen = new Set<string>()
  const params: { slug?: string[] }[] = []

  const addParam = (slug: string[]) => {
    if (slug.length === 0) return
    const key = slug.join('/')
    if (seen.has(key)) return
    seen.add(key)
    params.push({ slug })
  }

  for (const version of versions) {
    const docs = getAllDocs(version, 'en')
    for (const doc of docs) {
      addParam(doc.slug)
      addParam([version, ...doc.slug])
    }

    if (docs.length > 0) {
      addParam([version])
    }
  }

  return params
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { versionParam, slugSegments } = splitVersionFromSlug(params.slug)
  const version = resolveVersion(versionParam)
  if (!version) {
    return {}
  }
  const docs = getAllDocs(version, 'en')
  const slug = resolveSlug(slugSegments, docs)
  const doc = getDocBySlug(version, 'en', slug)

  if (!doc) {
    return {}
  }

  return {
    title: doc.frontmatter.title,
    description: doc.frontmatter.description,
  }
}

export default async function DocPage({ params }: PageProps) {
  const { versionParam, slugSegments } = splitVersionFromSlug(params.slug)
  const version = resolveVersion(versionParam)
  if (!version) {
    notFound()
  }
  const docs = getAllDocs(version, 'en')

  if (docs.length === 0) {
    notFound()
  }

  const slug = resolveSlug(slugSegments, docs)
  const doc = getDocBySlug(version, 'en', slug)

  if (!doc) {
    notFound()
  }

  const sidebar = buildSidebar(docs)
  const headings = extractHeadings(doc.content)
  const { prev, next } = getPrevNext(docs, doc.slug)
  const hasCustomNextSteps = doc.content.includes('## Next Steps')

  return (
    <div className="min-h-screen">
      <Header sidebarItems={sidebar} />
      <div className="container mx-auto px-4 lg:px-8">
        <div className="lg:flex lg:gap-8">
          <Sidebar items={sidebar} />

          <main className="flex-1 min-w-0 py-8 lg:py-12">
            <Breadcrumbs slug={doc.slug} doc={doc} />

            <article className="prose prose-slate dark:prose-invert max-w-none">
              <h1 className="text-2xl sm:text-4xl font-bold tracking-tight mb-4">
                {doc.frontmatter.title}
              </h1>
              {doc.frontmatter.description && (
                <p className="text-base sm:text-xl text-muted-foreground mb-8">
                  {doc.frontmatter.description}
                </p>
              )}

              <MDXContent content={doc.content} />
            </article>

            {!hasCustomNextSteps && <PrevNext prev={prev} next={next} />}
          </main>

          {doc.frontmatter.toc !== false && headings.length > 0 && (
            <RightTOC headings={headings} />
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
