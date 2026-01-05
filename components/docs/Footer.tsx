import Link from 'next/link'
import Image from 'next/image'
import { Github, MessageCircle, Send } from 'lucide-react'

export function Footer() {
  const withVersion = (path: string) => path
  return (
    <footer className="border-t border-border bg-background mt-16">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
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
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs mb-6">
              Parametric on-chain insurance protocol protecting DeFi users from smart contract risks.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://twitter.com/LayerCover"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Twitter"
              >
                <Send className="h-5 w-5" />
              </a>
              <a
                href="https://github.com/LayerCover"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://discord.gg/layercover"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Discord"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-sm mb-4">Product</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://app.layercover.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Launch App
                </a>
              </li>
              <li>
                <Link
                  href={withVersion('/concepts/buying-cover')}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Buy Coverage
                </Link>
              </li>
              <li>
                <Link
                  href={withVersion('/concepts/underwriting')}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Provide Capital
                </Link>
              </li>
              <li>
                <a
                  href="https://whitepaper.layercover.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Whitepaper
                </a>
              </li>
            </ul>
          </div>

          {/* Developers */}
          <div>
            <h3 className="font-semibold text-sm mb-4">Developers</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href={withVersion('/getting-started')}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href={withVersion('/resources/parameters')}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  API Reference
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/LayerCover"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  GitHub
                </a>
              </li>
              <li>
                <Link
                  href={withVersion('/resources/contract-addresses')}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Smart Contracts
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="font-semibold text-sm mb-4">Community</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://discord.gg/layercover"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Discord
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com/LayerCover"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Twitter
                </a>
              </li>
              <li>
                <Link
                  href={withVersion('/resources/community')}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Forum
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/LayerCover/community"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Governance
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} LayerCover. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href={withVersion('/resources/terms-of-service')}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href={withVersion('/resources/privacy-policy')}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
