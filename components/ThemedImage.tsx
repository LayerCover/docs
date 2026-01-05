'use client'

import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'
import Image from 'next/image'

interface ThemedImageProps {
  lightSrc: string
  darkSrc: string
  alt: string
  className?: string
  width?: number
  height?: number
}

export function ThemedImage({ lightSrc, darkSrc, alt, className, width, height }: ThemedImageProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  const finalWidth = width ?? 1200
  const finalHeight = height ?? 675
  const src = mounted && resolvedTheme === 'dark' ? darkSrc : lightSrc

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      width={finalWidth}
      height={finalHeight}
      sizes="100vw"
    />
  )
}
