# LayerCover Documentation Site

A production-ready documentation site built with Next.js 14 App Router, featuring Aave-style UX with advanced search, versioning, and MDX support.

## Features

- **Modern Stack**: Next.js 14 App Router, TypeScript, Tailwind CSS
- **MDX Support**: Full MDX with custom components (Tabs, Callouts, Code blocks)
- **Versioning**: Multi-version documentation support (v1, v2, etc.)
- **Search**: Algolia DocSearch + local FlexSearch fallback
- **Theming**: Light/dark mode with system preference detection
- **Navigation**: Sidebar with collapsible sections, TOC with scroll-spy, breadcrumbs
- **Performance**: Static generation, prefetching, optimized images
- **SEO**: Sitemap, robots.txt, OpenGraph tags, canonical URLs
- **A11y**: WCAG 2.1 AA compliant, keyboard navigation, screen reader support
- **i18n**: Multi-language support (English default)

## Project Structure

```
docs-site/
├── app/
│   ├── (docs)/
│   │   └── [version]/
│   │       └── [[...slug]]/
│   │           └── page.tsx          # Main doc pages
│   ├── (marketing)/
│   │   └── page.tsx                  # Landing page
│   ├── api/
│   │   ├── search/route.ts           # Local search API
│   │   └── feedback/route.ts         # Feedback widget
│   ├── layout.tsx                    # Root layout
│   └── globals.css                   # Global styles
├── components/
│   ├── docs/
│   │   ├── Sidebar.tsx               # Left navigation
│   │   ├── RightTOC.tsx              # Table of contents
│   │   ├── Breadcrumbs.tsx           # Page breadcrumbs
│   │   ├── PrevNext.tsx              # Page navigation
│   │   └── VersionBanner.tsx         # Non-latest warning
│   ├── mdx/
│   │   ├── CodeBlock.tsx             # Syntax highlighted code
│   │   ├── Tabs.tsx                  # Tabbed content
│   │   ├── Callout.tsx               # Admonitions
│   │   ├── Badge.tsx                 # Status badges
│   │   ├── Steps.tsx                 # Step-by-step guides
│   │   ├── CardGrid.tsx              # Card layouts
│   │   └── Mermaid.tsx               # Diagrams
│   ├── search/
│   │   ├── SearchDialog.tsx          # Cmd+K search
│   │   ├── AlgoliaSearch.tsx         # Algolia implementation
│   │   └── LocalSearch.tsx           # FlexSearch fallback
│   ├── ThemeToggle.tsx               # Light/dark switch
│   ├── VersionSwitcher.tsx           # Version dropdown
│   └── LangSwitcher.tsx              # Language selector
├── lib/
│   ├── content/
│   │   ├── loader.ts                 # MDX file loader
│   │   └── link-checker.ts           # Broken link detection
│   ├── search/
│   │   ├── algolia.ts                # Algolia client
│   │   └── flexsearch.ts             # Local search index
│   ├── versions.ts                   # Version config
│   └── utils.ts                      # Utilities
├── content/
│   ├── v1/
│   │   └── en/
│   │       ├── getting-started.mdx
│   │       ├── concepts/
│   │       ├── guides/
│   │       └── reference/
│   └── v2/
│       └── en/
│           └── ...                    # Same structure
├── public/
│   ├── logo.svg
│   └── search-index.json              # Pre-built search index
├── scripts/
│   ├── build-search-index.mjs         # Generate search index
│   ├── check-links.mjs                # Link validation
│   └── generate-api-docs.mjs          # OpenAPI → pages
├── .github/
│   └── workflows/
│       └── ci.yml                     # CI/CD pipeline
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build

```bash
npm run build
npm start
```

### Other Commands

```bash
npm run lint          # ESLint
npm run typecheck     # TypeScript
npm run links         # Check broken links
npm run test          # Playwright tests
npm run index         # Generate search index
```

## Writing Documentation

### Creating a New Page

Create an MDX file in `content/{version}/{locale}/`:

```mdx
---
title: My Page Title
description: Page description for SEO
order: 10
sidebar: Navigation Label
tags: [tag1, tag2]
toc: true
draft: false
---

# My Page Title

Content goes here...
```

### Frontmatter Options

- `title` (required): Page title
- `description`: Meta description
- `order`: Sort order in sidebar (lower = higher)
- `sidebar`: Custom sidebar label (defaults to title)
- `tags`: Array of tags for search
- `toc`: Show table of contents (default: true)
- `draft`: Hide in production (default: false)

### Using MDX Components

#### Code Blocks

\`\`\`typescript title="example.ts"
const greeting = "Hello World"
console.log(greeting)
\`\`\`

#### Tabs

```mdx
<Tabs items={['TypeScript', 'JavaScript', 'cURL']}>
  <Tab>
    TypeScript code...
  </Tab>
  <Tab>
    JavaScript code...
  </Tab>
  <Tab>
    cURL example...
  </Tab>
</Tabs>
```

#### Callouts

```mdx
<Callout type="info">
  This is an informational callout.
</Callout>

<Callout type="warning">
  This is a warning!
</Callout>

<Callout type="success">
  Success message here.
</Callout>
```

#### Steps

```mdx
<Steps>
  <Step>First step</Step>
  <Step>Second step</Step>
  <Step>Third step</Step>
</Steps>
```

#### Mermaid Diagrams

```mdx
<Mermaid>
{`
graph TD
    A[Start] --> B[Process]
    B --> C[End]
`}
</Mermaid>
```

## Versioning

### Adding a New Version

1. Update `lib/versions.ts`:

```typescript
export const versions: Version[] = [
  {
    label: 'v3 (Latest)',
    path: 'v3',
    isLatest: true,
  },
  {
    label: 'v2',
    path: 'v2',
  },
  {
    label: 'v1',
    path: 'v1',
  },
]
```

2. Create content directory:

```bash
mkdir -p content/v3/en
```

3. Copy content from previous version:

```bash
cp -r content/v2/en/* content/v3/en/
```

4. Update the docs as needed

## Search Configuration

### Algolia DocSearch

1. Sign up at [Algolia DocSearch](https://docsearch.algolia.com/)
2. Add environment variables:

```env
NEXT_PUBLIC_ALGOLIA_APP_ID=your_app_id
NEXT_PUBLIC_ALGOLIA_API_KEY=your_search_key
NEXT_PUBLIC_ALGOLIA_INDEX=your_index_name
```

3. Configure crawler in Algolia dashboard

### Local Search (Fallback)

Build the search index:

```bash
npm run index
```

This generates `public/search-index.json` used by FlexSearch when Algolia is not configured.

## API Documentation

### OpenAPI

Place your `openapi.yaml` in the project root:

```bash
npm run generate-api-docs
```

This creates pages under `content/{version}/en/api/`.

### TypeDoc

Generate SDK documentation from TypeScript:

```bash
npx typedoc --out ./typedoc-output
npm run generate-sdk-docs
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

```bash
vercel --prod
```

### Other Platforms

```bash
npm run build
# Deploy the `.next` and `public` directories
```

## CI/CD

The project includes GitHub Actions workflow that:

- Runs type checking
- Lints code
- Builds the site
- Checks for broken links
- Runs Playwright tests
- Deploys preview for PRs

## Customization

### Branding

1. Update colors in `tailwind.config.ts`:

```typescript
colors: {
  brand: {
    500: '#YOUR_COLOR',
    // ... other shades
  }
}
```

2. Update logo in `public/logo.svg`

3. Update `app/layout.tsx` metadata:

```typescript
export const metadata = {
  title: 'Your Project Name',
  description: 'Your description',
}
```

### Theme

Modify CSS variables in `app/globals.css`:

```css
:root {
  --primary: 207 90% 54%; /* HSL values */
  /* ... other variables */
}
```

## Performance

Target Lighthouse scores:

- **Performance**: ≥95
- **Accessibility**: 100
- **Best Practices**: 100
- **SEO**: 100

Optimizations applied:

- Static generation for all doc pages
- Image optimization
- Font optimization
- Prefetching on hover
- Code splitting
- CSS minification

## Accessibility

- Semantic HTML
- ARIA labels
- Keyboard navigation (Tab, Shift+Tab, Enter, Escape)
- Focus indicators
- Screen reader support
- Color contrast ratios ≥4.5:1

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## License

MIT License - see [LICENSE](./LICENSE)

## Support

- GitHub Issues: [Your repo issues URL]
- Discord: [Your discord invite]
- Email: support@example.com

---

Built with ❤️ using [Next.js](https://nextjs.org/)
