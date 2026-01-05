import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeRaw from 'rehype-raw'
import { cn } from '@/lib/utils'
import { Mermaid } from './Mermaid'
import { CodeBlock } from './CodeBlock'
import { FAQAccordion } from './FAQAccordion'
import { ContractAddresses } from './ContractAddresses'
import { PoolParameters } from './PoolParameters'
import LayerCoverAnimation from './LayerCoverAnimation'
import { ThemedImage } from './ThemedImage'
import { Callout } from './Callout'
import { ExternalLinks } from './ExternalLinks'
import { ResponsiveIframe } from './ResponsiveIframe'
import { GlossaryLink, GlossaryTerm } from './GlossaryLink'

interface FAQ {
  question: string
  answer: string
}

interface ExternalLinkItem {
  title: string
  url: string
  description: string
  icon?: string
}

interface ExternalLinkSection {
  title: string
  links: ExternalLinkItem[]
}

function normalizeDocsHref(href?: string) {
  if (!href || typeof href !== 'string') {
    return href
  }

  if (href.startsWith('/v')) {
    const trimmed = href.replace(/^\/v\d+(?=\/|$)/, '')
    return trimmed.length > 0 ? trimmed : '/'
  }

  const absoluteMatch = href.match(/^(https?:\/\/[^/]+)\/v\d+(\/.*)?$/)
  if (absoluteMatch) {
    const [, origin, rest] = absoluteMatch
    return `${origin}${rest || ''}`
  }

  return href
}

function parseFAQs(content: string): { beforeFAQ: string; faqs: FAQ[]; afterFAQ: string } {
  // Match FAQ section header and content after it
  const faqHeaderRegex = /^## Frequently Asked Questions\s*$/m
  const match = content.match(faqHeaderRegex)

  if (!match || match.index === undefined) {
    return { beforeFAQ: content, faqs: [], afterFAQ: '' }
  }

  const beforeFAQ = content.substring(0, match.index)
  const afterFAQStart = content.substring(match.index + match[0].length)

  // Find the next ## heading or end of content
  const nextSectionMatch = afterFAQStart.match(/\n## [^#]/m)
  const faqContent = nextSectionMatch && nextSectionMatch.index !== undefined
    ? afterFAQStart.substring(0, nextSectionMatch.index)
    : afterFAQStart
  const afterFAQ = nextSectionMatch && nextSectionMatch.index !== undefined
    ? afterFAQStart.substring(nextSectionMatch.index)
    : ''

  // Parse Q&A pairs
  const faqs: FAQ[] = []
  const qaRegex = /\*\*Q: (.+?)\*\*\s*\n\s*A: (.+?)(?=\n\s*\n|\n\s*\*\*Q:|$)/gs
  let qaMatch

  while ((qaMatch = qaRegex.exec(faqContent)) !== null) {
    faqs.push({
      question: qaMatch[1].trim(),
      answer: qaMatch[2].trim()
    })
  }

  return { beforeFAQ, faqs, afterFAQ }
}

const markdownComponents = {
  h2: ({ node, ...props }: any) => (
    <h2
      id={props.children?.toString().toLowerCase().replace(/\s+/g, '-')}
      className="scroll-mt-20"
      {...props}
    />
  ),
  h3: ({ node, ...props }: any) => (
    <h3
      id={props.children?.toString().toLowerCase().replace(/\s+/g, '-')}
      className="scroll-mt-20"
      {...props}
    />
  ),
  h4: ({ node, ...props }: any) => (
    <h4
      id={props.children?.toString().toLowerCase().replace(/\s+/g, '-')}
      className="scroll-mt-20"
      {...props}
    />
  ),
  a: ({ node, href, ...props }: any) => (
    <a
      className="text-brand-600 dark:text-brand-400 hover:underline"
      {...props}
      href={normalizeDocsHref(href)}
    />
  ),
  code: ({ node, inline, className, children, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || '')
    const language = match ? match[1] : ''

    // Render mermaid diagrams
    if (language === 'mermaid' && !inline) {
      return <Mermaid chart={String(children).replace(/\n$/, '')} />
    }

    if (inline) {
      return (
        <code
          className="px-1.5 py-0.5 rounded-md bg-primary/10 border border-primary/20 text-sm font-mono text-primary dark:text-primary"
          {...props}
        >
          {children}
        </code>
      )
    }

    // Syntax highlighted code block
    if (language) {
      return (
        <CodeBlock language={language}>
          {String(children).replace(/\n$/, '')}
        </CodeBlock>
      )
    }

    return (
      <code
        className={cn('block bg-muted p-4 rounded-lg text-sm font-mono overflow-x-auto text-foreground', className)}
        {...props}
      >
        {children}
      </code>
    )
  },
  pre: ({ node, ...props }: any) => (
    <pre
      className="overflow-x-auto rounded-lg bg-muted p-4 text-sm my-6 text-foreground"
      {...props}
    />
  ),
  ul: ({ node, ...props }: any) => (
    <ul className="list-disc list-inside space-y-2 my-4 text-foreground" {...props} />
  ),
  ol: ({ node, ...props }: any) => (
    <ol className="list-decimal list-inside space-y-2 my-4 text-foreground" {...props} />
  ),
  li: ({ node, ...props }: any) => (
    <li className="ml-4 text-foreground" {...props} />
  ),
  blockquote: ({ node, ...props }: any) => (
    <blockquote
      className="border-l-4 border-brand-500 pl-4 italic my-4 text-muted-foreground"
      {...props}
    />
  ),
}

const remarkPluginList = [remarkGfm, remarkMath]
const rehypePluginList = [rehypeRaw, rehypeKatex]
type CalloutType = 'info' | 'warning' | 'success' | 'error'
const calloutTypes = new Set<CalloutType>(['info', 'warning', 'success', 'error'])

export function MDXContent({ content }: { content: string }) {
  const externalLinksUsagePattern =
    /<ExternalLinks\s+[^>]*sections=\{\s*([A-Za-z0-9_$]+)\s*\}[^>]*\/>/g
  const externalLinksVarNames = new Set<string>()
  let externalLinksUsageMatch: RegExpExecArray | null
  while ((externalLinksUsageMatch = externalLinksUsagePattern.exec(content)) !== null) {
    externalLinksVarNames.add(externalLinksUsageMatch[1])
  }

  // Check if content includes custom components
  const hasContractAddresses = content.includes('<ContractAddresses />')
  const hasPoolParameters = content.includes('<PoolParameters />')
  const hasLayerCoverAnimation = content.includes('<LayerCoverAnimation')
  const hasThemedImage = content.includes('<ThemedImage')
  const hasResponsiveIframe = content.includes('<ResponsiveIframe')
  const hasCallout = content.includes('<Callout')

  // Replace component placeholders with markers
  const externalLinksData: Record<string, ExternalLinkSection[]> = {}

  let processedContent = content
  if (hasContractAddresses) {
    processedContent = content.replace(
      /import \{ ContractAddresses \} from ['"]@\/components\/ContractAddresses['"]\s*\n?\s*<ContractAddresses \/>/g,
      '<!-- CONTRACT_ADDRESSES -->'
    )
  }

  if (hasPoolParameters) {
    processedContent = processedContent.replace(
      /import \{ PoolParameters \} from ['"]@\/components\/PoolParameters['"]\s*\n?\s*<PoolParameters \/>/g,
      '<!-- POOL_PARAMETERS -->'
    )
  }

  // Store ThemedImage props for later rendering
  const themedImages: Array<{
    lightSrc: string
    darkSrc: string
    alt: string
    className?: string
  }> = []

  if (hasLayerCoverAnimation) {
    processedContent = processedContent.replace(
      /import LayerCoverAnimation from ['"]@\/components\/LayerCoverAnimation['"]\s*\n?/g,
      ''
    )

    processedContent = processedContent.replace(
      /<LayerCoverAnimation\s*\/>/g,
      '<!-- LAYERCOVER_ANIMATION -->'
    )
  }

  if (hasThemedImage) {
    // Extract ThemedImage components and their props
    const themedImageRegex = /<ThemedImage\s+lightSrc="([^"]+)"\s+darkSrc="([^"]+)"\s+alt="([^"]+)"(?:\s+className="([^"]+)")?\s*\/>/g
    let match
    while ((match = themedImageRegex.exec(processedContent)) !== null) {
      themedImages.push({
        lightSrc: match[1],
        darkSrc: match[2],
        alt: match[3],
        className: match[4]
      })
    }

    // Remove import statement
    processedContent = processedContent.replace(
      /import \{ ThemedImage \} from ['"]@\/components\/ThemedImage['"]\s*\n?\s*/g,
      ''
    )

    // Replace ThemedImage components with placeholders
    let counter = 0
    processedContent = processedContent.replace(
      /<ThemedImage[^>]+\/>/g,
      () => `<!-- THEMED_IMAGE_${counter++} -->`
    )
  }

  // Store ResponsiveIframe props
  const responsiveIframes: Array<{
    src: string
    title: string
    className?: string
    initialHeight?: number
  }> = []

  const callouts: Array<{
    type?: string
    emoji?: string
    content: string
  }> = []

  if (hasResponsiveIframe) {
    const regex = /<ResponsiveIframe\s+src="([^"]+)"\s+title="([^"]+)"(?:\s+className="([^"]+)")?(?:\s+initialHeight=\{?(\d+)\}?)?\s*\/>/g
    let match
    while ((match = regex.exec(processedContent)) !== null) {
      responsiveIframes.push({
        src: match[1],
        title: match[2],
        className: match[3],
        initialHeight: match[4] ? parseInt(match[4], 10) : undefined
      })
    }

    processedContent = processedContent.replace(
      /import \{ ResponsiveIframe \} from ['"]@\/components\/ResponsiveIframe['"]\s*\n?\s*/g,
      ''
    )

    let counter = 0
    processedContent = processedContent.replace(
      /<ResponsiveIframe[^>]+\/>/g,
      () => `<!-- RESPONSIVE_IFRAME_${counter++} -->`
    )
  }

  if (hasCallout) {
    processedContent = processedContent.replace(
      /import \{ Callout \} from ['"]@\/components\/Callout['"]\s*\n?\s*/g,
      ''
    )

    const calloutRegex = /<Callout\s+([^>]*)>([\s\S]*?)<\/Callout>/g
    let calloutMatch
    while ((calloutMatch = calloutRegex.exec(processedContent)) !== null) {
      const attrs = calloutMatch[1] || ''
      const body = calloutMatch[2] || ''
      const typeMatch = attrs.match(/type="([^"]+)"/)
      const emojiMatch = attrs.match(/emoji="([^"]+)"/)
      callouts.push({
        type: typeMatch ? typeMatch[1] : undefined,
        emoji: emojiMatch ? emojiMatch[1] : undefined,
        content: body.trim(),
      })
    }

    let counter = 0
    processedContent = processedContent.replace(
      calloutRegex,
      () => `<!-- CALLOUT_${counter++} -->`
    )
  }

  // Process GlossaryLink components - convert to styled anchor tags
  const hasGlossaryLink = processedContent.includes('<GlossaryLink')
  if (hasGlossaryLink) {
    // Remove import statement
    processedContent = processedContent.replace(
      /import \{ GlossaryLink(?:, GlossaryTerm)? \} from ['"]@\/components\/GlossaryLink['"]\s*\n?/g,
      ''
    )

    // Convert self-closing GlossaryLink to anchor: <GlossaryLink term="salvage" />
    processedContent = processedContent.replace(
      /<GlossaryLink\s+term="([^"]+)"\s*\/>/g,
      '<a href="/resources/glossary" class="text-primary underline decoration-dotted underline-offset-2 hover:decoration-solid" title="See glossary: $1">$1</a>'
    )

    // Convert GlossaryLink with children: <GlossaryLink term="X">display text</GlossaryLink>
    processedContent = processedContent.replace(
      /<GlossaryLink\s+term="([^"]+)">([\s\S]*?)<\/GlossaryLink>/g,
      '<a href="/resources/glossary" class="text-primary underline decoration-dotted underline-offset-2 hover:decoration-solid" title="See glossary: $1">$2</a>'
    )
  }

  if (externalLinksVarNames.size > 0) {
    processedContent = processedContent.replace(
      /import \{ ExternalLinks \} from ['"]@\/components\/ExternalLinks['"]\s*\n?/g,
      ''
    )

    const exportBlocks: ExportedArrayBlock[] = []

    for (const varName of externalLinksVarNames) {
      const block = extractExportedArrayBlock(processedContent, varName)
      if (!block) {
        continue
      }

      const parsedSections = parseExternalLinkSections(block.literal)
      if (!parsedSections) {
        continue
      }

      externalLinksData[varName] = parsedSections
      exportBlocks.push(block)
    }

    exportBlocks
      .sort((a, b) => b.start - a.start)
      .forEach((block) => {
        processedContent =
          processedContent.slice(0, block.start) + processedContent.slice(block.end)
      })

    const externalLinksPlaceholderPattern = new RegExp(
      externalLinksUsagePattern.source,
      'g'
    )

    processedContent = processedContent.replace(
      externalLinksPlaceholderPattern,
      (match, varName: string) =>
        externalLinksData[varName]
          ? `<!-- EXTERNAL_LINKS_${varName} -->`
          : match
    )
  }

  const { beforeFAQ, faqs, afterFAQ } = parseFAQs(processedContent)
  const hasFAQs = faqs.length > 0

  const placeholderRegex =
    /(<!-- CONTRACT_ADDRESSES -->|<!-- POOL_PARAMETERS -->|<!-- THEMED_IMAGE_\d+ -->|<!-- RESPONSIVE_IFRAME_\d+ -->|<!-- LAYERCOVER_ANIMATION -->|<!-- EXTERNAL_LINKS_[A-Za-z0-9_$]+ -->|<!-- CALLOUT_\d+ -->)/
  const introductionSegments = beforeFAQ.split(placeholderRegex).filter((segment) => segment !== '')

  return (
    <>
      {introductionSegments.length > 0 ? (
        introductionSegments.map((segment, index) => {
          if (segment === '<!-- CONTRACT_ADDRESSES -->') {
            return (
              <div key={`contract-addresses-${index}`} className="my-8">
                <ContractAddresses />
              </div>
            )
          }

          if (segment === '<!-- POOL_PARAMETERS -->') {
            return (
              <div key={`pool-parameters-${index}`} className="my-8">
                <PoolParameters />
              </div>
            )
          }

          if (segment === '<!-- LAYERCOVER_ANIMATION -->') {
            return (
              <div key={`layercover-animation-${index}`} className="my-12">
                <LayerCoverAnimation />
              </div>
            )
          }

          const externalLinksMatch = segment.match(/<!-- EXTERNAL_LINKS_([A-Za-z0-9_$]+) -->/)
          if (externalLinksMatch) {
            const key = externalLinksMatch[1]
            const sections = externalLinksData[key]
            if (sections) {
              return (
                <div key={`external-links-${index}`} className="my-8 not-prose">
                  <ExternalLinks sections={sections} />
                </div>
              )
            }
          }

          const themedImageMatch = segment.match(/<!-- THEMED_IMAGE_(\d+) -->/)
          if (themedImageMatch) {
            const imageIndex = parseInt(themedImageMatch[1], 10)
            const imageProps = themedImages[imageIndex]
            if (imageProps) {
              return (
                <ThemedImage
                  key={`themed-image-${index}`}
                  {...imageProps}
                />
              )
            }
          }

          const iframeMatch = segment.match(/<!-- RESPONSIVE_IFRAME_(\d+) -->/)
          if (iframeMatch) {
            const index = parseInt(iframeMatch[1], 10)
            const props = responsiveIframes[index]
            if (props) {
              return (
                <ResponsiveIframe
                  key={`responsive-iframe-${index}`}
                  {...props}
                />
              )
            }
          }

          const calloutMatch = segment.match(/<!-- CALLOUT_(\d+) -->/)
          if (calloutMatch) {
            const index = parseInt(calloutMatch[1], 10)
            const props = callouts[index]
            if (props) {
              const type: CalloutType = props.type && calloutTypes.has(props.type as CalloutType)
                ? (props.type as CalloutType)
                : 'info'
              return (
                <Callout key={`callout-${index}`} type={type} emoji={props.emoji}>
                  <ReactMarkdown
                    remarkPlugins={remarkPluginList}
                    rehypePlugins={rehypePluginList}
                    components={markdownComponents}
                  >
                    {props.content}
                  </ReactMarkdown>
                </Callout>
              )
            }
          }

          return (
            <ReactMarkdown
              key={`markdown-${index}`}
              remarkPlugins={remarkPluginList}
              rehypePlugins={rehypePluginList}
              components={markdownComponents}
            >
              {segment}
            </ReactMarkdown>
          )
        })
      ) : (
        <ReactMarkdown
          remarkPlugins={remarkPluginList}
          rehypePlugins={rehypePluginList}
          components={markdownComponents}
        >
          {beforeFAQ}
        </ReactMarkdown>
      )}

      {hasFAQs && (
        <>
          <h2 id="frequently-asked-questions" className="scroll-mt-20 text-3xl font-bold tracking-tight text-foreground mt-10 mb-4">
            Frequently Asked Questions
          </h2>
          <FAQAccordion faqs={faqs} />
        </>
      )}

      {afterFAQ && (
        <ReactMarkdown
          remarkPlugins={remarkPluginList}
          rehypePlugins={rehypePluginList}
          components={markdownComponents}
        >
          {afterFAQ}
        </ReactMarkdown>
      )}
    </>
  )
}

interface ExportedArrayBlock {
  varName: string
  start: number
  end: number
  literal: string
}

function extractExportedArrayBlock(source: string, varName: string): ExportedArrayBlock | null {
  const pattern = new RegExp(`export const ${escapeRegExp(varName)}\\s*=\\s*\\[`)
  const match = pattern.exec(source)

  if (!match || match.index === undefined) {
    return null
  }

  const arrayStartIndex = match.index + match[0].length - 1
  const arrayEndIndex = findMatchingBracket(source, arrayStartIndex)

  if (arrayEndIndex === -1) {
    return null
  }

  let removalEnd = arrayEndIndex + 1
  if (source[removalEnd] === ';') {
    removalEnd += 1
  }

  return {
    varName,
    start: match.index,
    end: removalEnd,
    literal: source.slice(arrayStartIndex, arrayEndIndex + 1),
  }
}

function findMatchingBracket(source: string, startIndex: number): number {
  let depth = 0
  let inString = false
  let stringChar = ''

  for (let i = startIndex; i < source.length; i++) {
    const char = source[i]
    const prevChar = i > 0 ? source[i - 1] : ''

    if (inString) {
      if (char === stringChar && prevChar !== '\\') {
        inString = false
      }
      continue
    }

    if (char === '"' || char === "'" || char === '`') {
      inString = true
      stringChar = char
      continue
    }

    if (char === '[') {
      depth++
      continue
    }

    if (char === ']') {
      depth--
      if (depth === 0) {
        return i
      }
    }
  }

  return -1
}

function parseExternalLinkSections(literal: string): ExternalLinkSection[] | null {
  try {
    // eslint-disable-next-line no-new-func
    const parsed = new Function(`return (${literal})`)()
    return Array.isArray(parsed) ? (parsed as ExternalLinkSection[]) : null
  } catch (error) {
    console.warn('Failed to parse ExternalLinks sections from MDX content', error)
    return null
  }
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
