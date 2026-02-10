'use client'

import type { ComponentType } from 'react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Prism as SyntaxHighlighterBase } from 'react-syntax-highlighter'
import type { SyntaxHighlighterProps } from 'react-syntax-highlighter'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Copy, Check } from 'lucide-react'

const SyntaxHighlighter = SyntaxHighlighterBase as unknown as ComponentType<SyntaxHighlighterProps>

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 p-1.5 rounded-md bg-muted/80 hover:bg-muted border border-border transition-colors"
      title="Copy code"
    >
      {copied ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <Copy className="h-4 w-4 text-muted-foreground" />
      )}
    </button>
  )
}

export function CodeBlock({ language, children }: { language: string; children: string }) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm my-4">
        <code>{children}</code>
      </pre>
    )
  }

  // Solidity-friendly color scheme
  const solidityDarkTheme = {
    ...oneDark,
    'pre[class*="language-"]': {
      ...oneDark['pre[class*="language-"]'],
      background: '#1e1e1e',
      fontSize: '0.875rem',
    },
    'code[class*="language-"]': {
      ...oneDark['code[class*="language-"]'],
      background: '#1e1e1e',
      fontSize: '0.875rem',
    },
    'comment': {
      color: '#6A9955',
      fontStyle: 'italic',
    },
    'prolog': {
      color: '#6A9955',
    },
    'doctype': {
      color: '#6A9955',
    },
    'cdata': {
      color: '#6A9955',
    },
    'punctuation': {
      color: '#D4D4D4',
    },
    'property': {
      color: '#9CDCFE',
    },
    'tag': {
      color: '#569CD6',
    },
    'boolean': {
      color: '#569CD6',
    },
    'number': {
      color: '#B5CEA8',
    },
    'constant': {
      color: '#4FC1FF',
    },
    'symbol': {
      color: '#4FC1FF',
    },
    'deleted': {
      color: '#CE9178',
    },
    'selector': {
      color: '#D7BA7D',
    },
    'attr-name': {
      color: '#9CDCFE',
    },
    'string': {
      color: '#CE9178',
    },
    'char': {
      color: '#CE9178',
    },
    'builtin': {
      color: '#4EC9B0',
    },
    'inserted': {
      color: '#B5CEA8',
    },
    'operator': {
      color: '#D4D4D4',
    },
    'entity': {
      color: '#569CD6',
    },
    'url': {
      color: '#CE9178',
    },
    'variable': {
      color: '#9CDCFE',
    },
    'atrule': {
      color: '#C586C0',
    },
    'attr-value': {
      color: '#CE9178',
    },
    'function': {
      color: '#DCDCAA',
    },
    'class-name': {
      color: '#4EC9B0',
    },
    'keyword': {
      color: '#C586C0',
    },
    'regex': {
      color: '#D16969',
    },
    'important': {
      color: '#569CD6',
      fontWeight: 'bold',
    },
  }

  const solidityLightTheme = {
    ...oneLight,
    'pre[class*="language-"]': {
      ...oneLight['pre[class*="language-"]'],
      background: '#FFFFFF',
      fontSize: '0.875rem',
    },
    'code[class*="language-"]': {
      ...oneLight['code[class*="language-"]'],
      background: '#FFFFFF',
      fontSize: '0.875rem',
    },
    'comment': {
      color: '#008000',
      fontStyle: 'italic',
    },
    'prolog': {
      color: '#008000',
    },
    'doctype': {
      color: '#008000',
    },
    'cdata': {
      color: '#008000',
    },
    'punctuation': {
      color: '#000000',
    },
    'property': {
      color: '#001080',
    },
    'tag': {
      color: '#0000FF',
    },
    'boolean': {
      color: '#0000FF',
    },
    'number': {
      color: '#098658',
    },
    'constant': {
      color: '#0070C1',
    },
    'symbol': {
      color: '#0070C1',
    },
    'deleted': {
      color: '#A31515',
    },
    'selector': {
      color: '#795E26',
    },
    'attr-name': {
      color: '#001080',
    },
    'string': {
      color: '#A31515',
    },
    'char': {
      color: '#A31515',
    },
    'builtin': {
      color: '#267F99',
    },
    'inserted': {
      color: '#098658',
    },
    'operator': {
      color: '#000000',
    },
    'entity': {
      color: '#0000FF',
    },
    'url': {
      color: '#A31515',
    },
    'variable': {
      color: '#001080',
    },
    'atrule': {
      color: '#AF00DB',
    },
    'attr-value': {
      color: '#A31515',
    },
    'function': {
      color: '#795E26',
    },
    'class-name': {
      color: '#267F99',
    },
    'keyword': {
      color: '#0000FF',
    },
    'regex': {
      color: '#811F3F',
    },
    'important': {
      color: '#0000FF',
      fontWeight: 'bold',
    },
  }

  const style = resolvedTheme === 'dark' ? solidityDarkTheme : solidityLightTheme

  return (
    <div className="relative group overflow-x-auto">
      <CopyButton text={children} />
      <SyntaxHighlighter
        style={style}
        language={language === 'sol' ? 'solidity' : language}
        PreTag="div"
        className="rounded-lg my-4 overflow-hidden border border-border"
        customStyle={{
          margin: 0,
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
          padding: '1rem',
        }}
        codeTagProps={{
          style: {
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
          }
        }}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  )
}
