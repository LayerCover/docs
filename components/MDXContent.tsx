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
// import LayerCoverAnimation from './LayerCoverAnimation'
import { ThemedImage } from './ThemedImage'
import { Callout } from './Callout'
import { ExternalLinks } from './ExternalLinks'
import { ResponsiveIframe } from './ResponsiveIframe'
import { PremiumCalculator } from './PremiumCalculator'
import { RiskPointsCalculator } from './RiskPointsCalculator'
import { StepByStep } from './StepByStep'
import { CodeSandboxEmbed } from './CodeSandboxEmbed'
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
  code: ({ node, className, children, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || '')
    const language = match ? match[1] : ''

    // Detect inline code: if parent is not <pre>, it's inline
    const isInline = node?.parent?.tagName !== 'pre' && !language

    // Render mermaid diagrams
    if (language === 'mermaid') {
      return <Mermaid chart={String(children).replace(/\n$/, '')} />
    }

    // Inline code (backticks in text)
    if (isInline) {
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
    <ul className="list-disc list-outside pl-6 space-y-2 my-4 text-foreground" {...props} />
  ),
  ol: ({ node, ...props }: any) => (
    <ol className="list-decimal list-outside pl-6 space-y-2 my-4 text-foreground" {...props} />
  ),
  li: ({ node, ...props }: any) => (
    <li className="text-foreground" {...props} />
  ),
  blockquote: ({ node, ...props }: any) => (
    <blockquote
      className="border-l-4 border-brand-500 pl-4 italic my-4 text-muted-foreground"
      {...props}
    />
  ),
  table: ({ node, ...props }: any) => (
    <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 my-4">
      <table className="min-w-full text-sm" {...props} />
    </div>
  ),
}

const remarkPluginList = [remarkGfm, remarkMath]
const rehypePluginList = [rehypeRaw, rehypeKatex]
// Callouts should not process $ as math delimiters
const remarkPluginListNoMath = [remarkGfm]
const rehypePluginListNoMath = [rehypeRaw]
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
  const hasFAQAccordion = content.includes('<FAQAccordion')
  const hasPremiumCalculator = content.includes('<PremiumCalculator')
  const hasRiskPointsCalculator = content.includes('<RiskPointsCalculator')
  const hasStepByStep = content.includes('<StepByStep')
  const hasCodeSandboxEmbed = content.includes('<CodeSandboxEmbed')

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

  // if (hasLayerCoverAnimation) {
  //   processedContent = processedContent.replace(
  //     /import LayerCoverAnimation from ['"]@\/components\/LayerCoverAnimation['"]\s*\n?/g,
  //     ''
  //   )

  //   processedContent = processedContent.replace(
  //     /<LayerCoverAnimation\s*\/>/g,
  //     '<!-- LAYERCOVER_ANIMATION -->'
  //   )
  // }

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

  // Process PremiumCalculator
  const premiumCalculators: Array<{ defaultCoverage?: number; defaultRate?: number; defaultDuration?: number }> = []
  if (hasPremiumCalculator) {
    processedContent = processedContent.replace(
      /import \{ PremiumCalculator \} from ['"]@\/components\/PremiumCalculator['"]\s*\n?/g,
      ''
    )
    const pcRegex = /<PremiumCalculator(?:\s+defaultCoverage=\{(\d+)\})?(?:\s+defaultRate=\{(\d+)\})?(?:\s+defaultDuration=\{(\d+)\})?\s*\/>/g
    let pcMatch
    while ((pcMatch = pcRegex.exec(processedContent)) !== null) {
      premiumCalculators.push({
        defaultCoverage: pcMatch[1] ? parseInt(pcMatch[1], 10) : undefined,
        defaultRate: pcMatch[2] ? parseInt(pcMatch[2], 10) : undefined,
        defaultDuration: pcMatch[3] ? parseInt(pcMatch[3], 10) : undefined,
      })
    }
    let counter = 0
    processedContent = processedContent.replace(pcRegex, () => `<!-- PREMIUM_CALCULATOR_${counter++} -->`)
  }

  // Process RiskPointsCalculator
  const riskCalculators: Array<{ defaultDeposit?: number; maxBudget?: number }> = []
  if (hasRiskPointsCalculator) {
    processedContent = processedContent.replace(
      /import \{ RiskPointsCalculator \} from ['"]@\/components\/RiskPointsCalculator['"]\s*\n?/g,
      ''
    )
    const rcRegex = /<RiskPointsCalculator(?:\s+defaultDeposit=\{(\d+)\})?(?:\s+maxBudget=\{(\d+)\})?\s*\/>/g
    let rcMatch
    while ((rcMatch = rcRegex.exec(processedContent)) !== null) {
      riskCalculators.push({
        defaultDeposit: rcMatch[1] ? parseInt(rcMatch[1], 10) : undefined,
        maxBudget: rcMatch[2] ? parseInt(rcMatch[2], 10) : undefined,
      })
    }
    let counter = 0
    processedContent = processedContent.replace(rcRegex, () => `<!-- RISK_CALCULATOR_${counter++} -->`)
  }

  // Process StepByStep
  const stepBySteps: Array<{ steps: Array<{ title: string; description: string; tip?: string }> }> = []
  if (hasStepByStep) {
    processedContent = processedContent.replace(
      /import \{ StepByStep \} from ['"]@\/components\/StepByStep['"]\s*\n?/g,
      ''
    )
    const sbsRegex = /<StepByStep\s+steps=\{(\[[\s\S]*?\])\}\s*\/>/g
    let sbsMatch
    while ((sbsMatch = sbsRegex.exec(processedContent)) !== null) {
      try {
        // eslint-disable-next-line no-new-func
        const parsed = new Function(`return (${sbsMatch[1]})`)()
        stepBySteps.push({ steps: Array.isArray(parsed) ? parsed : [] })
      } catch (e) {
        stepBySteps.push({ steps: [] })
      }
    }
    let counter = 0
    processedContent = processedContent.replace(sbsRegex, () => `<!-- STEP_BY_STEP_${counter++} -->`)
  }

  // Process CodeSandboxEmbed
  const codeSandboxes: Array<{ url: string; title?: string; height?: number }> = []
  if (hasCodeSandboxEmbed) {
    processedContent = processedContent.replace(
      /import \{ CodeSandboxEmbed \} from ['"]@\/components\/CodeSandboxEmbed['"]\s*\n?/g,
      ''
    )
    const csRegex = /<CodeSandboxEmbed\s+url="([^"]+)"(?:\s+title="([^"]+)")?(?:\s+height=\{(\d+)\})?\s*\/>/g
    let csMatch
    while ((csMatch = csRegex.exec(processedContent)) !== null) {
      codeSandboxes.push({
        url: csMatch[1],
        title: csMatch[2] || undefined,
        height: csMatch[3] ? parseInt(csMatch[3], 10) : undefined,
      })
    }
    let counter = 0
    processedContent = processedContent.replace(csRegex, () => `<!-- CODE_SANDBOX_${counter++} -->`)
  }

  // Process raw HTML div blocks (card grids, badge rows, etc.)
  // These must bypass ReactMarkdown to avoid hydration mismatches from
  // block-level elements (div, h3, p) inside inline elements (a)
  const rawHtmlBlocks: string[] = []
  {
    const rawDivRegex = /^<div\s+className="[^"]*"[^>]*>[\s\S]*?^<\/div>/gm
    let rawMatch
    const rawMatches: Array<{ index: number; match: string }> = []
    while ((rawMatch = rawDivRegex.exec(processedContent)) !== null) {
      rawMatches.push({ index: rawMatch.index, match: rawMatch[0] })
    }
    // Process in reverse to preserve indices
    for (let i = rawMatches.length - 1; i >= 0; i--) {
      const blockIndex = rawHtmlBlocks.length
      rawHtmlBlocks.unshift(rawMatches[i].match)
      const placeholder = `<!-- RAW_HTML_${blockIndex} -->`
      processedContent =
        processedContent.substring(0, rawMatches[i].index) +
        placeholder +
        processedContent.substring(rawMatches[i].index + rawMatches[i].match.length)
    }
  }

  // Process FAQAccordion components
  const faqAccordions: FAQ[][] = []
  if (hasFAQAccordion) {
    // Remove import statement
    processedContent = processedContent.replace(
      /import \{ FAQAccordion \} from ['"]@\/components\/FAQAccordion['"]\s*\n?/g,
      ''
    )

    // Parse FAQAccordion components with embedded faqs prop
    const faqAccordionRegex = /<FAQAccordion\s+faqs=\{(\[[\s\S]*?\])\}\s*\/>/g
    let faqMatch
    while ((faqMatch = faqAccordionRegex.exec(processedContent)) !== null) {
      try {
        // Parse the faqs array
        // eslint-disable-next-line no-new-func
        const parsed = new Function(`return (${faqMatch[1]})`)()
        faqAccordions.push(Array.isArray(parsed) ? parsed : [])
      } catch (e) {
        console.warn('Failed to parse FAQAccordion faqs:', e)
        faqAccordions.push([])
      }
    }

    let counter = 0
    processedContent = processedContent.replace(
      faqAccordionRegex,
      () => `<!-- FAQ_ACCORDION_${counter++} -->`
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
    /(<!-- CONTRACT_ADDRESSES -->|<!-- POOL_PARAMETERS -->|<!-- THEMED_IMAGE_\d+ -->|<!-- RESPONSIVE_IFRAME_\d+ -->|<!-- LAYERCOVER_ANIMATION -->|<!-- EXTERNAL_LINKS_[A-Za-z0-9_$]+ -->|<!-- CALLOUT_\d+ -->|<!-- FAQ_ACCORDION_\d+ -->|<!-- PREMIUM_CALCULATOR_\d+ -->|<!-- RISK_CALCULATOR_\d+ -->|<!-- STEP_BY_STEP_\d+ -->|<!-- CODE_SANDBOX_\d+ -->|<!-- RAW_HTML_\d+ -->)/
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

          // if (segment === '<!-- LAYERCOVER_ANIMATION -->') {
          //   return (
          //     <div key={`layercover-animation-${index}`} className="my-12">
          //       <LayerCoverAnimation />
          //     </div>
          //   )
          // }

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
                    remarkPlugins={remarkPluginListNoMath}
                    rehypePlugins={rehypePluginListNoMath}
                    components={markdownComponents}
                  >
                    {props.content}
                  </ReactMarkdown>
                </Callout>
              )
            }
          }

          const faqAccordionMatch = segment.match(/<!-- FAQ_ACCORDION_(\d+) -->/)
          if (faqAccordionMatch) {
            const faqIndex = parseInt(faqAccordionMatch[1], 10)
            const faqList = faqAccordions[faqIndex]
            if (faqList && faqList.length > 0) {
              return (
                <div key={`faq-accordion-${index}`} className="my-6">
                  <FAQAccordion faqs={faqList} />
                </div>
              )
            }
          }

          const premCalcMatch = segment.match(/<!-- PREMIUM_CALCULATOR_(\d+) -->/)
          if (premCalcMatch) {
            const idx = parseInt(premCalcMatch[1], 10)
            const props = premiumCalculators[idx]
            if (props) {
              return <PremiumCalculator key={`premium-calc-${index}`} {...props} />
            }
          }

          const riskCalcMatch = segment.match(/<!-- RISK_CALCULATOR_(\d+) -->/)
          if (riskCalcMatch) {
            const idx = parseInt(riskCalcMatch[1], 10)
            const props = riskCalculators[idx]
            if (props) {
              return <RiskPointsCalculator key={`risk-calc-${index}`} {...props} />
            }
          }

          const sbsMatch = segment.match(/<!-- STEP_BY_STEP_(\d+) -->/)
          if (sbsMatch) {
            const idx = parseInt(sbsMatch[1], 10)
            const props = stepBySteps[idx]
            if (props && props.steps.length > 0) {
              return <StepByStep key={`step-by-step-${index}`} steps={props.steps} />
            }
          }

          const csbMatch = segment.match(/<!-- CODE_SANDBOX_(\d+) -->/)
          if (csbMatch) {
            const idx = parseInt(csbMatch[1], 10)
            const props = codeSandboxes[idx]
            if (props) {
              return <CodeSandboxEmbed key={`code-sandbox-${index}`} {...props} />
            }
          }

          const rawHtmlMatch = segment.match(/<!-- RAW_HTML_(\d+) -->/)
          if (rawHtmlMatch) {
            const idx = parseInt(rawHtmlMatch[1], 10)
            const html = rawHtmlBlocks[idx]
            if (html) {
              // Convert className to class for raw HTML rendering
              const converted = html.replace(/className=/g, 'class=')
              return (
                <div
                  key={`raw-html-${index}`}
                  className="not-prose"
                  dangerouslySetInnerHTML={{ __html: converted }}
                />
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
