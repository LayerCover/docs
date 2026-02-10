# Quick Start Guide

## Immediate Setup (5 minutes)

### 1. Install Dependencies

```bash
cd /Users/timjudge/Documents/Projects/layercover/monorepo/packages/docs-site
npm install
```

### 2. Create Sample Content

```bash
mkdir -p content/v2/en
```

Create `content/v2/en/getting-started.mdx`:

```mdx
---
title: Getting Started
description: Get up and running with LayerCover
order: 1
---

# Getting Started

Welcome to LayerCover documentation! This guide will help you get started.

## Quick Installation

<Tabs items={['npm', 'yarn', 'pnpm']}>
  <Tab>
    \`\`\`bash
    npm install @layercover/sdk
    \`\`\`
  </Tab>
  <Tab>
    \`\`\`bash
    yarn add @layercover/sdk
    \`\`\`
  </Tab>
  <Tab>
    \`\`\`bash
    pnpm add @layercover/sdk
    \`\`\`
  </Tab>
</Tabs>

## First Steps

<Steps>
  <Step>Install the SDK using your preferred package manager</Step>
  <Step>Configure your environment variables</Step>
  <Step>Initialize the client in your application</Step>
</Steps>

<Callout type="info">
  Make sure you have Node.js 18+ installed before proceeding.
</Callout>

## Basic Example

\`\`\`typescript title="example.ts"
import { LayerCoverClient } from '@layercover/sdk'

const client = new LayerCoverClient({
  apiKey: process.env.LAYERCOVER_API_KEY,
})

// Purchase coverage
const policy = await client.purchaseCoverage({
  amount: 10000,
  protocol: 'aave',
})

console.log('Policy ID:', policy.id)
\`\`\`

## Architecture Overview

<Mermaid>
{\`
graph TD
    A[User] -->|Buy Policy| B[Policy Manager]
    B -->|Store| C[Policy NFT]
    B -->|Allocate| D[Capital Pool]
    D -->|Earn| E[Yield Adapters]
\`}
</Mermaid>

## Next Steps

<CardGrid>
  <Card href="/v2/concepts" title="Core Concepts">
    Learn about insurance policies, underwriting, and risk management
  </Card>
  <Card href="/v2/guides" title="Guides">
    Step-by-step tutorials for common tasks
  </Card>
  <Card href="/v2/api" title="API Reference">
    Complete API documentation
  </Card>
</CardGrid>
```

### 3. Create Additional Pages

Create the minimal structure:

```bash
# Create directory structure
mkdir -p content/v2/en/{concepts,guides,api,reference}

# Create index files
touch content/v2/en/concepts/index.mdx
touch content/v2/en/guides/index.mdx
touch content/v2/en/api/index.mdx
```

Example `content/v2/en/concepts/index.mdx`:

```mdx
---
title: Core Concepts
description: Understand the fundamentals
order: 2
---

# Core Concepts

Learn the core concepts of LayerCover protocol.

## Insurance Policies

Each policy is an ERC-721 NFT providing coverage for specific protocols.

<Callout type="warning">
  Policies require continuous premium payment to remain active.
</Callout>

## Key Features

- **NFT-Based**: Each policy is a tradeable NFT
- **Continuous Premium**: Pay-as-you-go model
- **Instant Claims**: Automated, on-chain claims processing
- **Salvage Mechanism**: Claimants provide protocol tokens

## How It Works

\`\`\`solidity
// Simplified policy purchase
function purchaseCover(
    uint256 poolId,
    uint256 coverageAmount,
    uint256 initialPremium
) external returns (uint256 policyId)
\`\`\`
```

### 4. Create Missing Component Stubs

Create `components/mdx/CardGrid.tsx`:

```typescript
export function CardGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid md:grid-cols-2 gap-4 my-6">{children}</div>
}

export function Card({ title, href, children }: any) {
  return (
    <a
      href={href}
      className="block p-6 rounded-lg border border-border hover:border-primary transition-colors"
    >
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{children}</p>
    </a>
  )
}
```

Create `components/mdx/Badge.tsx`:

```typescript
export function Badge({ children, variant = 'default' }: any) {
  const variants = {
    default: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100',
    success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant as keyof typeof variants]}`}>
      {children}
    </span>
  )
}
```

Create `components/mdx/Mermaid.tsx`:

```typescript
'use client'

import { useEffect, useRef } from 'react'

export function Mermaid({ children }: { children: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      import('mermaid').then((m) => {
        m.default.initialize({ startOnLoad: true, theme: 'neutral' })
        m.default.contentLoaded()
      })
    }
  }, [children])

  return (
    <div className="mermaid my-6" ref={ref}>
      {children}
    </div>
  )
}
```

### 5. Create Environment File

Create `.env.local`:

```env
# Optional: Algolia Search
NEXT_PUBLIC_ALGOLIA_APP_ID=
NEXT_PUBLIC_ALGOLIA_API_KEY=
NEXT_PUBLIC_ALGOLIA_INDEX=

# Optional: Analytics
NEXT_PUBLIC_GA_ID=
```

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Production Build

```bash
# Type check
npm run typecheck

# Build
npm run build

# Start production server
npm start
```

## Deploy to Vercel

### Option 1: CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

### Option 2: GitHub Integration

1. Push code to GitHub
2. Import project in Vercel dashboard
3. Configure build settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`
4. Add environment variables
5. Deploy

## Customization Checklist

- [ ] Update colors in `tailwind.config.ts`
- [ ] Replace logo in `public/logo.svg`
- [ ] Update metadata in `app/layout.tsx`
- [ ] Configure Algolia search (optional)
- [ ] Add your content in `content/v2/en/`
- [ ] Customize landing page in `app/(marketing)/page.tsx`
- [ ] Set up analytics (Google Analytics, Vercel Analytics)

## Testing

```bash
# Install Playwright
npx playwright install

# Run tests
npm test

# Check links
npm run links
```

## Common Issues

### Module not found errors

```bash
# Clear cache and reinstall
rm -rf node_modules .next package-lock.json
npm install
```

### MDX compilation errors

- Check frontmatter YAML syntax
- Ensure MDX components are properly imported
- Verify closing tags in MDX content

### Build failures

- Run `npm run typecheck` to find TypeScript errors
- Check Node.js version (18+ required)
- Verify all dependencies are installed

## Next Steps

1. **Add More Content**: Create more MDX files in `content/`
2. **Customize Theme**: Modify colors and branding
3. **Set Up Search**: Configure Algolia or use local search
4. **Add API Docs**: Generate from OpenAPI spec
5. **Enable i18n**: Add translations in other languages
6. **Configure CI/CD**: Set up automated testing and deployment

## Performance Tips

- Pre-render as much as possible (use `generateStaticParams`)
- Optimize images with Next.js Image component
- Enable compression in production
- Use Vercel Edge Network for CDN
- Monitor with Lighthouse and Web Vitals

## Support

- **GitHub Issues**: [Repository URL]
- **Discord**: [Discord invite]
- **Documentation**: [https://docs.example.com](https://docs.example.com)

---

**Total Setup Time**: ~5-10 minutes
**Ready for Production**: After customization and content addition
