'use client'

import { AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

type CalloutType = 'info' | 'warning' | 'success' | 'error'

const icons: Record<CalloutType, typeof Info> = {
  info: Info,
  warning: AlertCircle,
  success: CheckCircle2,
  error: XCircle,
}

const styles: Record<CalloutType, string> = {
  info: 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100',
  warning: 'bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-100',
  success: 'bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100',
  error: 'bg-rose-50 dark:bg-rose-950 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-100',
}

export function Callout({
  type = 'info',
  emoji,
  children,
}: {
  type?: CalloutType
  emoji?: string
  children: React.ReactNode
}) {
  const Icon = icons[type]

  return (
    <div className={cn('my-6 rounded-lg border p-4 flex gap-3', styles[type])}>
      <div className="flex h-6 w-6 items-center justify-center">
        {emoji ? (
          <span className="text-lg leading-none" aria-hidden>
            {emoji}
          </span>
        ) : (
          <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
        )}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  )
}
