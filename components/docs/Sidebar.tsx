'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ALargeSmall,
  AlarmClockOff,
  AlertTriangle,
  AlignCenterVertical,
  AlignHorizontalSpaceBetween,
  AlignVerticalJustifyEnd,
  Antenna,
  Armchair,
  Axis3d,
  BadgeIndianRupee,
  BaggageClaim,
  BarChartHorizontalBig,
  Beaker,
  BellDot,
  BetweenVerticalEnd,
  Bluetooth,
  BookAudio,
  BookMarked,
  BookOpen,
  BookText,
  BookX,
  BoxSelect,
  Braces,
  Briefcase,
  Brush,
  Cake,
  CalendarMinus,
  CameraOff,
  CarTaxiFront,
  Cctv,
  ChevronDown,
  ChevronDownSquare,
  ChevronRight,
  ChevronUpSquare,
  Church,
  CircleChevronUp,
  CircleHelp,
  CircleSlash,
  CircuitBoard,
  ClipboardCheck,
  ClipboardType,
  Clock5,
  CloudHail,
  CloudUpload,
  Coffee,
  Cog,
  Compass,
  ConciergeBell,
  Copy,
  CornerLeftDown,
  Crop,
  DatabaseBackup,
  Dice4,
  DivideCircle,
  Dot,
  Drum,
  Edit3,
  Euro,
  Fence,
  FileBadge2,
  FileCheck2,
  FileDiff,
  FileKey2,
  FilePieChart,
  FileStack,
  FileWarning,
  FishOff,
  FlaskConical,
  FoldHorizontal,
  FolderDown,
  FolderOpen,
  FolderTree,
  Frown,
  Gamepad2,
  GitBranchPlus,
  GitPullRequestCreate,
  Github,
  GraduationCap,
  Group,
  Handshake,
  Heading2,
  HeartOff,
  HelpCircle,
  Hospital,
  ImageOff,
  Infinity,
  Kanban,
  KeyRound,
  LampFloor,
  Landmark,
  Laugh,
  LayoutTemplate,
  Library,
  Lightbulb,
  Link2,
  ListOrdered,
  LoaderCircle,
  Lollipop,
  MailSearch,
  Map as MapIcon,
  Maximize2,
  MessageCircle,
  MessageCircleDashed,
  MessageSquareCode,
  MessageSquareShare,
  Microwave,
  MonitorCheck,
  MonitorX,
  MousePointerClick,
  MoveHorizontal,
  Music4,
  Network,
  NotebookPen,
  NotepadText,
  Outdent,
  PaintRoller,
  Palette,
  PanelLeftClose,
  PanelTopClose,
  Parentheses,
  PawPrint,
  Pentagon,
  PhoneMissed,
  PiggyBank,
  PlaneTakeoff,
  PlugZap,
  Pocket,
  PowerOff,
  Rabbit,
  Rat,
  ReceiptText,
  RefreshCw,
  Reply,
  Rocket,
  RotateCw,
  Ruler,
  Scale3D,
  ScatterChart,
  School,
  ScrollText,
  Search,
  SearchCode,
  ServerCog,
  Shield,
  ShieldCheck,
  ShieldX,
  Shrub,
  SignalMedium,
  Sliders,
  Sparkles,
  Terminal,
  Users,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import type { SidebarItem } from '@/lib/content/loader'

interface SidebarProps {
  items: SidebarItem[]
  variant?: 'default' | 'drawer'
  onNavigate?: () => void
}

const manualIconMap = new Map<string, LucideIcon>([
  ['introduction', Compass],
  ['getting-started', Rocket],
  ['concepts', Lightbulb],
  ['core-mechanics', Cog],
  ['advanced-features', Sparkles],
  ['guides', MapIcon],
  ['user-guides', School],
  ['governance', Landmark],
  ['security', ShieldCheck],
  ['integration', PlugZap],
  ['technical-reference', CircuitBoard],
  ['api', Braces],
  ['resources', Library],
  ['resources/audits', FileCheck2],
  ['resources/risks', AlertTriangle],
  ['resources/contract-addresses', Network],
  ['resources/parameters', Sliders],
  ['resources/access-controls', KeyRound],
  ['resources/licensing', ScrollText],
  ['resources/brand-kit', Palette],
  ['resources/glossary', BookText],
  ['faq', HelpCircle],
  ['appendices', NotebookPen],
  ['reference', BookOpen],
])

const iconPool: LucideIcon[] = [
  ALargeSmall,
  AlarmClockOff,
  AlignCenterVertical,
  AlignHorizontalSpaceBetween,
  AlignVerticalJustifyEnd,
  Antenna,
  Armchair,
  Axis3d,
  BadgeIndianRupee,
  BaggageClaim,
  BarChartHorizontalBig,
  Beaker,
  BellDot,
  BetweenVerticalEnd,
  Bluetooth,
  BookAudio,
  BookMarked,
  BookX,
  BoxSelect,
  Brush,
  Cake,
  CalendarMinus,
  CameraOff,
  CarTaxiFront,
  Cctv,
  ChevronDownSquare,
  ChevronUpSquare,
  Church,
  CircleChevronUp,
  CircleHelp,
  CircleSlash,
  ClipboardCheck,
  ClipboardType,
  Clock5,
  CloudHail,
  CloudUpload,
  Coffee,
  ConciergeBell,
  Copy,
  CornerLeftDown,
  Crop,
  DatabaseBackup,
  Dice4,
  DivideCircle,
  Dot,
  Drum,
  Edit3,
  Euro,
  Fence,
  FileBadge2,
  FileDiff,
  FileKey2,
  FilePieChart,
  FileStack,
  FileWarning,
  FishOff,
  FlaskConical,
  FoldHorizontal,
  FolderDown,
  FolderOpen,
  FolderTree,
  Frown,
  Gamepad2,
  GitBranchPlus,
  GitPullRequestCreate,
  GraduationCap,
  Group,
  Handshake,
  Heading2,
  HeartOff,
  Hospital,
  ImageOff,
  Infinity,
  Kanban,
  LampFloor,
  Laugh,
  LayoutTemplate,
  Link2,
  ListOrdered,
  LoaderCircle,
  Lollipop,
  MailSearch,
  Maximize2,
  MessageCircleDashed,
  MessageSquareCode,
  MessageSquareShare,
  Microwave,
  MonitorCheck,
  MonitorX,
  MousePointerClick,
  MoveHorizontal,
  Music4,
  NotepadText,
  Outdent,
  PaintRoller,
  PanelLeftClose,
  PanelTopClose,
  Parentheses,
  PawPrint,
  Pentagon,
  PhoneMissed,
  PiggyBank,
  PlaneTakeoff,
  Pocket,
  PowerOff,
  Rabbit,
  Rat,
  ReceiptText,
  RefreshCw,
  Reply,
  RotateCw,
  Ruler,
  Scale3D,
  ScatterChart,
  SearchCode,
  ServerCog,
  Shield,
  ShieldX,
  Shrub,
  SignalMedium,
]

const fallbackIcon = iconPool[iconPool.length - 1]

const assignedIcons = new Map<string, LucideIcon>()
const usedIcons = new Set<LucideIcon>(manualIconMap.values())
let iconCursor = 0

function normalizeKey(title?: string, href?: string) {
  const rawTitle =
    typeof title === 'string' && title.trim().length > 0
      ? title
      : href?.split('/').filter(Boolean).pop() ?? 'untitled'

  const fallback = rawTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  if (!href) {
    return fallback
  }

  const trimmed = href.replace(/^\/+/, '')
  const segments = trimmed.split('/').filter(Boolean)

  if (segments.length > 0 && /^v\d+/i.test(segments[0])) {
    segments.shift()
  }

  const normalized = segments.map((segment) => segment.toLowerCase()).join('/')
  return normalized || fallback
}

function getNextIcon(): LucideIcon {
  while (iconCursor < iconPool.length) {
    const candidate = iconPool[iconCursor++]
    if (!usedIcons.has(candidate)) {
      return candidate
    }
  }
  return fallbackIcon
}

function getIcon(title?: string, href?: string) {
  const key = normalizeKey(title, href)

  if (manualIconMap.has(key)) {
    return manualIconMap.get(key)!
  }

  if (assignedIcons.has(key)) {
    return assignedIcons.get(key)!
  }

  const icon = getNextIcon()
  assignedIcons.set(key, icon)
  usedIcons.add(icon)
  return icon
}

function stripVersionPrefix(href: string) {
  const segments = href.split('/').filter(Boolean)
  if (segments.length > 0 && /^v\d+/i.test(segments[0])) {
    segments.shift()
  }
  return `/${segments.join('/')}`
}

type SearchableItem = {
  title: string
  href: string
  breadcrumbs: string[]
}

function flattenSidebarItems(items: SidebarItem[], breadcrumbs: string[] = []): SearchableItem[] {
  const results: SearchableItem[] = []

  for (const item of items) {
    const label = item.title || item.href || 'Untitled'
    const nextBreadcrumbs = [...breadcrumbs, label]

    if (item.href) {
      results.push({
        title: label,
        href: item.href,
        breadcrumbs,
      })
    }

    if (item.children && item.children.length > 0) {
      results.push(...flattenSidebarItems(item.children, nextBreadcrumbs))
    }
  }

  return results
}

export function Sidebar({ items, variant = 'default', onNavigate }: SidebarProps) {
  console.log('Sidebar rendering', { variant, itemsCount: items?.length });
  const pathname = usePathname()
  const normalizedPath = pathname ? stripVersionPrefix(pathname) : '/'
  const [selectedAudience, setSelectedAudience] = useState<'users' | 'developers' | 'curators'>('users')
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)

  const searchableItems = useMemo(() => flattenSidebarItems(items), [items])
  const filteredSearchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) {
      return searchableItems.slice(0, 12)
    }

    return searchableItems
      .filter((item) => {
        const haystack = `${item.title} ${item.href} ${item.breadcrumbs.join(' ')}`.toLowerCase()
        return haystack.includes(query)
      })
      .slice(0, 20)
  }, [searchQuery, searchableItems])

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('layercover-docs-audience')
    if (saved && (saved === 'users' || saved === 'developers' || saved === 'curators')) {
      setSelectedAudience(saved)
    }
  }, [])

  // Save to localStorage when changed
  const handleAudienceChange = (audience: 'users' | 'developers' | 'curators') => {
    setSelectedAudience(audience)
    if (typeof window !== 'undefined') {
      localStorage.setItem('layercover-docs-audience', audience)
    }
  }

  // Filter items based on selected audience
  const getFilteredItems = () => {
    const audienceNavigation = {
      users: [
        '/introduction',
        '/getting-started',
        '/concepts',
        '/user-guides',
        '/guides',
        '/sdk',
        '/api-reference',
        '/core-mechanics',
        '/faq',
        '/resources',
        '/technical-reference',
        '/contracts',
      ],
      developers: [
        '/introduction',
        '/getting-started',
        '/technical-reference',
        '/contracts',
        '/integration',
        '/core-mechanics',
        '/api',
        '/resources',
        '/appendices',
      ],
      curators: [
        '/introduction',
        '/advanced-features',
        '/governance',
        '/core-mechanics',
        '/user-guides',
        '/security',
        '/resources',
      ],
    }

    const allowedPaths = audienceNavigation[selectedAudience]

    return items.filter(item => {
      if (!item.href) return true // Keep items without href (categories)
      const normalizedHref = stripVersionPrefix(item.href)
      return allowedPaths.some(path => normalizedHref.startsWith(path))
    })
  }

  const filteredItems = getFilteredItems()


  useEffect(() => {
    if (!searchOpen) return
    const t = window.setTimeout(() => searchInputRef.current?.focus(), 50)
    return () => window.clearTimeout(t)
  }, [searchOpen])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setSearchOpen(true)
      }

      if (event.key === 'Escape') {
        setSearchOpen(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const handleSearchNavigate = () => {
    setSearchOpen(false)
    setSearchQuery('')
  }

  const renderNavigation = () => (
    <>
      {/* Search Button */}
      <button
        onClick={() => setSearchOpen(true)}
        className="w-full flex items-center gap-3 px-3 py-2 mb-4 text-sm text-muted-foreground border border-border rounded-lg hover:bg-accent hover:text-foreground transition-all group"
      >
        <Search className="h-4 w-4 group-hover:scale-110 transition-transform" />
        <span>Search docs...</span>
        <kbd className="ml-auto px-2 py-0.5 text-xs bg-muted rounded">⌘K</kbd>
      </button>

      {/* Audience Selector temporarily disabled */}
      {/*
      <div className="mb-4">
        <VersionSelector
          selectedAudience={selectedAudience}
          onAudienceChange={handleAudienceChange}
        />
      </div>
      */}

      {/* Navigation */}
      <nav>
        <ul className="space-y-1">
          {filteredItems.map((item) => (
            <SidebarItemComponent
              key={item.href || item.title || 'untitled'}
              item={item}
              activePath={normalizedPath}
              level={0}
              onNavigate={onNavigate}
            />
          ))}
        </ul>
      </nav>

      {/* External Links */}
      <div className="mt-6 pt-6 border-t border-border space-y-2">
        <ExternalLink
          href="https://github.com/layercover/monorepo"
          icon={Github}
          label="GitHub"
        />
        <ExternalLink
          href="https://discord.gg/layercover"
          icon={MessageCircle}
          label="Discord"
        />
      </div>
    </>
  )

  return (
    <>
      {searchOpen && (
        <div
          className="fixed inset-0 z-50 bg-background/70 backdrop-blur-sm flex items-start justify-center p-4 lg:p-8"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-background border border-border rounded-xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                ref={searchInputRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search docs"
                className="flex-1 bg-transparent outline-none text-sm"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="text-[11px] text-muted-foreground bg-muted rounded px-2 py-1"
              >
                Esc
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {filteredSearchResults.length > 0 ? (
                <ul className="divide-y divide-border">
                  {filteredSearchResults.map((result) => (
                    <li key={result.href}>
                      <Link
                        href={result.href}
                        onClick={handleSearchNavigate}
                        className="flex flex-col gap-1 px-4 py-3 hover:bg-accent transition-colors"
                      >
                        <span className="text-sm font-medium">{result.title}</span>
                        {result.breadcrumbs.length > 0 && (
                          <span className="text-xs text-muted-foreground truncate">
                            {result.breadcrumbs.join(' / ')}
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-4 py-6 text-sm text-muted-foreground">
                  No results found
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {variant === 'drawer' ? (
        <div className="h-full overflow-y-auto py-6">
          {renderNavigation()}
        </div>
      ) : (
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto py-6 pr-4">
            {renderNavigation()}
          </div>
        </aside>
      )}
    </>
  )
}

function SidebarItemComponent({
  item,
  activePath,
  level = 0,
  onNavigate,
}: {
  item: SidebarItem
  activePath: string
  level?: number
  onNavigate?: () => void
}) {
  const hasChildren = item.children && item.children.length > 0
  const normalizedHref = item.href ? stripVersionPrefix(item.href) : null
  const isActive = normalizedHref === activePath
  const childActive = hasChildren ? item.children!.some((child) => isItemOrDescendantActive(child, activePath)) : false
  const shouldBeOpen = hasChildren ? isActive || childActive : false
  const [isOpen, setIsOpen] = useState(shouldBeOpen)

  useEffect(() => {
    if (shouldBeOpen) {
      setIsOpen(true)
    }
  }, [shouldBeOpen])

  const displayTitle = item.title ?? item.href ?? 'Untitled'
  const Icon = getIcon(displayTitle, item.href)

  return (
    <li>
      <div className="flex items-center gap-1">
        {hasChildren ? (
          item.href ? (
            <div className={cn(
              "w-full flex items-center text-sm rounded-lg transition-all group",
              isActive
                ? "bg-brand-500/10 text-brand-600 dark:text-brand-400 font-medium"
                : "text-muted-foreground hover:bg-accent hover:text-foreground",
              level === 0 && !isActive && "font-medium"
            )}>
              <Link
                href={item.href}
                className="flex-1 flex items-center gap-2 px-3 py-2"
                onClick={() => onNavigate?.()}
              >
                <Icon className={cn(
                  "h-4 w-4 flex-shrink-0 transition-transform group-hover:scale-110",
                  isActive && "text-brand-500"
                )} />
                <span>{displayTitle}</span>
              </Link>
              <button
                onClick={(e) => { e.preventDefault(); setIsOpen(!isOpen); }}
                className="px-2 py-2 mr-1 hover:bg-black/5 dark:hover:bg-white/10 rounded"
              >
                {isOpen ? (
                  <ChevronDown className="h-4 w-4 flex-shrink-0 transition-transform" />
                ) : (
                  <ChevronRight className="h-4 w-4 flex-shrink-0 transition-transform" />
                )}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-all group",
                "hover:bg-accent hover:text-foreground",
                level === 0 && "font-medium"
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
              <span className="flex-1 text-left">{displayTitle}</span>
              {isOpen ? (
                <ChevronDown className="h-4 w-4 flex-shrink-0 transition-transform" />
              ) : (
                <ChevronRight className="h-4 w-4 flex-shrink-0 transition-transform" />
              )}
            </button>
          )
        ) : item.href ? (
          <Link
            href={item.href}
            className={cn(
              'w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-all group',
              isActive
                ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 font-medium'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground',
              level === 0 && !isActive && 'font-medium'
            )}
            onClick={() => onNavigate?.()}
          >
            <Icon className={cn(
              "h-4 w-4 flex-shrink-0 transition-transform group-hover:scale-110",
              isActive && "text-brand-500"
            )} />
            <span className="flex-1">{displayTitle}</span>
          </Link>
        ) : (
          <div className="w-full flex items-center gap-2 px-3 py-2 text-sm font-semibold">
            <Icon className="h-4 w-4 flex-shrink-0" />
            <span className="flex-1">{displayTitle}</span>
          </div>
        )}
      </div>

      {hasChildren && isOpen && (
        <ul className={cn(
          "mt-1 space-y-1 border-l-2 border-border ml-5 pl-3",
          "animate-in slide-in-from-top-2 duration-200"
        )}>
          {item.children!.map((child) => (
            <SidebarItemComponent
              key={child.href || child.title || 'untitled'}
              item={child}
              activePath={activePath}
              level={level + 1}
              onNavigate={onNavigate}
            />
          ))}
        </ul>
      )}
    </li>
  )
}

function isItemOrDescendantActive(item: SidebarItem, activePath: string): boolean {
  if (item.href && stripVersionPrefix(item.href) === activePath) {
    return true
  }

  return item.children?.some((child) => isItemOrDescendantActive(child, activePath)) ?? false
}

function VersionSelector({
  selectedAudience,
  onAudienceChange
}: {
  selectedAudience: 'users' | 'developers' | 'curators'
  onAudienceChange: (audience: 'users' | 'developers' | 'curators') => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const audiences = [
    {
      label: 'Users',
      value: 'users' as const,
      href: '/user-guides/for-policyholders',
      description: 'For policyholders & underwriters',
      icon: Users
    },
    {
      label: 'Developers',
      value: 'developers' as const,
      href: '/integration/frontend-integration',
      description: 'For builders & integrators',
      icon: Terminal
    },
    {
      label: 'Curators',
      value: 'curators' as const,
      href: '/advanced-features/syndicates',
      description: 'For syndicate managers',
      icon: Briefcase
    },
  ]

  const current = audiences.find(a => a.value === selectedAudience) || audiences[0]
  const CurrentIcon = current.icon

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 text-sm border border-border rounded-lg hover:bg-accent transition-colors"
      >
        <div className="flex items-center gap-2">
          <CurrentIcon className="h-4 w-4" />
          <span className="font-medium">{current.label}</span>
        </div>
        <ChevronDown className={cn(
          "h-4 w-4 transition-transform",
          isOpen && "rotate-180"
        )} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 py-1 bg-background border border-border rounded-lg shadow-lg z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {audiences.map((audience) => {
            const Icon = audience.icon
            const isSelected = audience.value === selectedAudience
            return (
              <button
                key={audience.value}
                onClick={() => {
                  onAudienceChange(audience.value)
                  setIsOpen(false)
                }}
                className={cn(
                  "w-full flex items-start gap-2 px-3 py-2 hover:bg-accent transition-colors group text-left",
                  isSelected && "bg-accent"
                )}
              >
                <Icon className="h-4 w-4 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <div className="flex-1">
                  <div className={cn("font-medium text-sm", isSelected && "text-brand-600 dark:text-brand-400")}>
                    {audience.label}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">{audience.description}</div>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

function ExternalLink({
  href,
  icon: Icon,
  label
}: {
  href: string
  icon: LucideIcon
  label: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-all group"
    >
      <Icon className="h-4 w-4 group-hover:scale-110 transition-transform" />
      <span>{label}</span>
      <svg
        className="ml-auto h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
        />
      </svg>
    </a>
  )
}
