'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Menu, X } from 'lucide-react'
import type { SidebarItem } from '@/lib/content/loader'
import { Sidebar } from './Sidebar'

export function MobileDocsNav({ items }: { items: SidebarItem[] }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!open) return
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open])

  const drawer = open && mounted ? createPortal(
    <div className="fixed inset-0 z-[100] lg:hidden">
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={() => setOpen(false)}
      />
      <div
        className="fixed inset-y-0 left-0 w-[85%] sm:w-80 h-full bg-background border-r border-border shadow-2xl animate-in slide-in-from-left duration-300 flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-border">
          <div className="flex items-center gap-2 font-semibold">
            <span className="text-lg">Menu</span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="rounded-md p-2 hover:bg-muted transition-colors"
            aria-label="Close docs navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <Sidebar items={items} variant="drawer" onNavigate={() => setOpen(false)} />
        </div>
      </div>
    </div>,
    document.body
  ) : null

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium shadow-sm lg:hidden"
        aria-label="Open docs navigation"
      >
        <Menu className="h-4 w-4 text-muted-foreground" />
        Docs
      </button>
      {drawer}
    </>
  )
}
