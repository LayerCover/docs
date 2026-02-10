import Link from 'next/link'
import Image from 'next/image'
import type { SidebarItem } from '@/lib/content/loader'
import { ThemeToggle } from '../ThemeToggle'
import { MobileDocsNav } from './MobileDocsNav'
import { DocSearch } from '../search/DocSearch'
import { PapersDropdown } from './PapersDropdown'

interface HeaderProps {
  sidebarItems?: SidebarItem[]
}

export function Header({ sidebarItems }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            {sidebarItems && (
              <div className="lg:hidden">
                <MobileDocsNav items={sidebarItems} />
              </div>
            )}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0 min-w-[140px]">
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
          </div>

          <nav className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
            <DocSearch />
            <PapersDropdown />
            <a
              href="https://app.layercover.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Launch App
            </a>
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}

