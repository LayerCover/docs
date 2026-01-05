import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Book, Code, Zap } from 'lucide-react'
export default function HomePage() {
  const docsBase = ''

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <nav className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            src="/doc-assets/branding/layercover-logo-light.png"
            alt="LayerCover"
            width={140}
            height={32}
            className="h-8 w-auto dark:hidden"
          />
          <Image
            src="/doc-assets/branding/layercover-logo-dark.png"
            alt="LayerCover"
            width={140}
            height={32}
            className="hidden h-8 w-auto dark:block"
          />
        </div>
        <Link
          href={`${docsBase}/getting-started`}
          className="rounded-lg bg-brand-500 px-4 py-2 text-white hover:bg-brand-600"
        >
          Go to Docs
        </Link>
      </nav>

      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            LayerCover Documentation
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Everything you need to build with LayerCover. Comprehensive guides,
            API references, and examples.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href={`${docsBase}/getting-started`}
              className="rounded-lg bg-brand-500 px-6 py-3 text-white hover:bg-brand-600 inline-flex items-center gap-2"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={`${docsBase}/api`}
              className="rounded-lg border border-border px-6 py-3 hover:bg-accent"
            >
              API Reference
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20 max-w-5xl mx-auto">
          <div className="rounded-lg border border-border p-6">
            <Book className="h-10 w-10 text-brand-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Comprehensive Guides</h3>
            <p className="text-muted-foreground">
              Step-by-step tutorials covering all aspects of the protocol.
            </p>
          </div>
          <div className="rounded-lg border border-border p-6">
            <Code className="h-10 w-10 text-brand-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">API Reference</h3>
            <p className="text-muted-foreground">
              Complete API documentation with code examples.
            </p>
          </div>
          <div className="rounded-lg border border-border p-6">
            <Zap className="h-10 w-10 text-brand-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Quick Start</h3>
            <p className="text-muted-foreground">
              Get up and running in minutes with our quick start guide.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
