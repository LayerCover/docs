'use client'

import { Disclosure, Transition } from '@headlessui/react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FAQ {
  question: string
  answer: string
}

interface FAQAccordionProps {
  faqs: FAQ[]
  className?: string
}

export function FAQAccordion({ faqs, className }: FAQAccordionProps) {
  return (
    <div className={cn('space-y-4 my-6', className)}>
      {faqs.map((faq, index) => (
        <Disclosure key={index} as="div" className="border border-border rounded-lg">
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full items-center justify-between px-4 py-4 text-left hover:bg-muted/50 transition-colors rounded-lg">
                <span className="font-semibold text-foreground pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={cn(
                    'h-5 w-5 text-muted-foreground transition-transform flex-shrink-0',
                    open && 'transform rotate-180'
                  )}
                />
              </Disclosure.Button>
              <Transition
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
              >
                <Disclosure.Panel className="px-4 pb-4 pt-2 text-muted-foreground">
                  {faq.answer}
                </Disclosure.Panel>
              </Transition>
            </>
          )}
        </Disclosure>
      ))}
    </div>
  )
}
