'use client'

import React, { useMemo, useState } from 'react'
import { AnimatePresence, motion, type Variants } from 'framer-motion'
import { ArrowRight, CreditCard, RefreshCw, ShieldCheck, Sparkles, Wallet } from 'lucide-react'

const steps = ['Select', 'Quote', 'Pay', 'Confirm'] as const
type Step = (typeof steps)[number]

const cardVariants: Variants = {
  initial: { y: 24, opacity: 0, scale: 0.98 },
  enter: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 220, damping: 24 },
  },
  exit: { y: -24, opacity: 0, scale: 0.98, transition: { duration: 0.18 } },
}

const pulseVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: [0, 1, 0],
    transition: { duration: 1.6, repeat: Infinity, ease: 'easeInOut' },
  },
}

const variants = {
  card: cardVariants,
  pulse: pulseVariants,
}

const pipeline = [
  { id: 'select', title: 'Select Cover', icon: ShieldCheck },
  { id: 'quote', title: 'Pricing Quote', icon: Sparkles },
  { id: 'pay', title: 'Pay Premium', icon: CreditCard },
  { id: 'confirm', title: 'Coverage Active', icon: Wallet },
] as const

interface StepperProps {
  activeIndex: number
}

function Stepper({ activeIndex }: StepperProps) {
  return (
    <div className="mx-auto mt-6 flex w-full max-w-4xl items-center justify-between gap-2">
      {pipeline.map((item, index) => (
        <div key={item.id} className="flex flex-1 items-center">
          <div className="relative flex items-center">
            <motion.div
              className={`grid h-10 w-10 place-items-center rounded-full border ${
                index <= activeIndex
                  ? 'border-teal-400 bg-teal-500/10'
                  : 'border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-800'
              }`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            >
              <item.icon
                className={`h-5 w-5 ${index <= activeIndex ? 'text-teal-300' : 'text-slate-500 dark:text-slate-400'}`}
              />
            </motion.div>
            {index < pipeline.length - 1 && (
              <div className="mx-2 hidden flex-1 md:block">
                <motion.div
                  className={`h-0.5 rounded ${index < activeIndex ? 'bg-teal-400' : 'bg-slate-200 dark:bg-slate-700'}`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: index < activeIndex ? 1 : 1 }}
                  style={{ transformOrigin: 'left' }}
                  transition={{ duration: 0.5, delay: 0.05 * index }}
                />
              </div>
            )}
          </div>
          {index < pipeline.length - 1 && (
            <ArrowRight className="mx-2 hidden h-4 w-4 text-slate-400 dark:text-slate-600 md:block" />
          )}
        </div>
      ))}
    </div>
  )
}

export default function LayerCoverAnimation() {
  const [stepIndex, setStepIndex] = useState(0)
  const step = steps[stepIndex]

  const next = () => setStepIndex((value) => Math.min(value + 1, steps.length - 1))
  const reset = () => setStepIndex(0)

  const quote = useMemo(() => {
    const base = 0.9
    const protocol = 'Aave v3'
    const coverage = 10_000
    const premium = Math.max(15, Math.round((coverage * base) / 100))
    return { base, protocol, coverage, premium }
  }, [])

  return (
    <div className="not-prose rounded-[32px] border border-slate-200 bg-gradient-to-b from-white via-slate-50 to-white px-6 py-10 text-slate-900 shadow-xl dark:border-slate-800 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <motion.div className="grid h-10 w-10 place-items-center rounded-xl bg-teal-500/10 ring-1 ring-teal-500/30">
              <svg viewBox="0 0 100 100" className="h-6 w-6">
                <path d="M50 8l32 12v26c0 22-14 34-32 44C32 80 18 68 18 46V20z" fill="#14b8a6" opacity="0.2" />
                <path d="M50 18l22 8v20c0 16-10 26-22 34-12-8-22-18-22-34V26z" fill="#14b8a6" opacity="0.5" />
                <path d="M50 28l12 4v12c0 9-6 15-12 19-6-4-12-10-12-19V32z" fill="#14b8a6" />
              </svg>
            </motion.div>
            <div>
              <h3 className="text-xl font-semibold tracking-tight">LayerCover</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Animated underwriting walkthrough</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700/50"
            >
              <RefreshCw className="h-4 w-4" />
              Reset
            </button>
            <button
              onClick={next}
              className="inline-flex items-center gap-2 rounded-xl bg-teal-500/10 px-3 py-2 text-sm ring-1 ring-teal-400/40 transition hover:bg-teal-500/20"
            >
              Next Step
            </button>
          </div>
        </header>

        <Stepper activeIndex={stepIndex} />

        <div className="relative mx-auto mt-8 grid max-w-5xl grid-cols-1 items-start gap-6 md:grid-cols-3">
          <motion.div
            variants={variants.card}
            initial="initial"
            animate="enter"
            exit="exit"
            className="order-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/60 md:order-1"
          >
            <h4 className="mb-3 text-sm font-semibold text-slate-300">Policyholder</h4>
            <div className="relative">
              <SVGCustomer step={step} />
            </div>
          </motion.div>

          <div className="order-1 md:order-2">
            <AnimatePresence mode="wait" initial={false}>
              {step === 'Select' && (
                <motion.div
                  key="select"
                  variants={variants.card}
                  initial="initial"
                  animate="enter"
                  exit="exit"
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900/60"
                >
                  <h4 className="mb-2 text-lg font-semibold">Select Cover</h4>
                  <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">
                    Pick protocol, coverage amount, and duration.
                  </p>

                  <div className="grid gap-3">
                    <Field label="Protocol">
                      <Chip>{quote.protocol}</Chip>
                    </Field>
                    <Field label="Coverage">
                      <Chip>${quote.coverage.toLocaleString()}</Chip>
                    </Field>
                    <Field label="Duration">
                      <Chip>30 days</Chip>
                    </Field>
                  </div>

                  <motion.button
                    onClick={next}
                    className="mt-6 w-full rounded-xl bg-teal-500 px-4 py-2 font-medium text-slate-900 transition hover:bg-teal-400"
                    whileTap={{ scale: 0.98 }}
                  >
                    Get Quote
                  </motion.button>
                </motion.div>
              )}

              {step === 'Quote' && (
                <motion.div
                  key="quote"
                  variants={variants.card}
                  initial="initial"
                  animate="enter"
                  exit="exit"
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900/60"
                >
                  <h4 className="mb-2 text-lg font-semibold">Pricing Quote</h4>
                  <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">
                    Algorithmic pricing across utilisation and risk tiers.
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <Metric label="Base Rate" value={`${quote.base}%`} />
                    <Metric label="Premium" value={`$${quote.premium.toLocaleString()}`} />
                    <Metric label="Coverage" value={`$${quote.coverage.toLocaleString()}`} />
                    <Metric label="Protocol" value={quote.protocol} />
                  </div>

                  <motion.div className="mt-6 h-20 rounded-xl bg-gradient-to-r from-teal-500/20 to-cyan-500/10 p-2">
                    <motion.div
                      className="h-full rounded-lg bg-teal-400/70"
                      initial={{ width: '0%' }}
                      animate={{ width: step === 'Quote' ? '72%' : '0%' }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                    />
                  </motion.div>

                  <motion.button
                    onClick={next}
                    className="mt-6 w-full rounded-xl bg-teal-500 px-4 py-2 font-medium text-slate-900 transition hover:bg-teal-400"
                    whileTap={{ scale: 0.98 }}
                  >
                    Proceed to Pay
                  </motion.button>
                </motion.div>
              )}

              {step === 'Pay' && (
                <motion.div
                  key="pay"
                  variants={variants.card}
                  initial="initial"
                  animate="enter"
                  exit="exit"
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900/60"
                >
                  <h4 className="mb-2 text-lg font-semibold">Pay Premium</h4>
                  <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">
                    Confirm the transaction directly from your wallet.
                  </p>

                  <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/40">
                    <div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Amount</div>
                      <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        ${quote.premium.toLocaleString()}
                      </div>
                    </div>
                    <motion.div
                      variants={variants.pulse}
                      initial="initial"
                      animate="animate"
                      className="grid h-10 w-10 place-items-center rounded-full bg-teal-500/10 ring-1 ring-teal-400/40"
                    >
                      <CreditCard className="h-5 w-5 text-teal-300" />
                    </motion.div>
                  </div>

                  <motion.button
                    onClick={next}
                    className="mt-6 w-full rounded-xl bg-teal-500 px-4 py-2 font-medium text-slate-900 transition hover:bg-teal-400"
                    whileTap={{ scale: 0.98 }}
                  >
                    Confirm in Wallet
                  </motion.button>
                </motion.div>
              )}

              {step === 'Confirm' && (
                <motion.div
                  key="confirm"
                  variants={variants.card}
                  initial="initial"
                  animate="enter"
                  exit="exit"
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-100 p-6 shadow-xl dark:border-slate-800 dark:from-slate-900/60 dark:to-slate-900/20"
                >
                  <h4 className="mb-2 text-lg font-semibold">Coverage Active</h4>
                  <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">
                    Your protection is now live for the selected term.
                  </p>

                  <div className="relative">
                    <motion.div
                      className="absolute -inset-1 rounded-2xl bg-teal-500/10 blur"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    />
                    <div className="relative grid grid-cols-2 gap-4 rounded-xl border border-teal-500/30 bg-white p-4 dark:bg-slate-900/50">
                      <Metric label="Coverage" value={`$${quote.coverage.toLocaleString()}`} />
                      <Metric label="Premium Paid" value={`$${quote.premium.toLocaleString()}`} />
                      <Metric label="Protocol" value={quote.protocol} />
                      <Metric label="Status" value="Active" />
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="rounded-full bg-slate-100 px-2 py-1 ring-1 ring-slate-200 dark:bg-slate-800/60 dark:ring-slate-700">Algorithmic Pricing</span>
                    <span className="rounded-full bg-slate-100 px-2 py-1 ring-1 ring-slate-200 dark:bg-slate-800/60 dark:ring-slate-700">Solvency Controls</span>
                    <span className="rounded-full bg-slate-100 px-2 py-1 ring-1 ring-slate-200 dark:bg-slate-800/60 dark:ring-slate-700">Capital Automation</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.div
            variants={variants.card}
            initial="initial"
            animate="enter"
            exit="exit"
            className="order-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/60"
          >
            <h4 className="mb-3 text-sm font-semibold text-slate-600 dark:text-slate-300">Layer stack</h4>
            <StackGraphic stepIndex={stepIndex} />
          </motion.div>
        </div>

        <footer className="mx-auto mt-10 max-w-5xl text-center text-xs text-slate-500 dark:text-slate-400">
          Demo only. Replace mock pricing with your oracle and on-chain integrations.
        </footer>
      </div>
    </div>
  )
}

interface FieldProps {
  label: string
  children: React.ReactNode
}

function Field({ label, children }: FieldProps) {
  return (
    <div className="grid gap-1">
      <div className="text-xs text-slate-500 dark:text-slate-400">{label}</div>
      <div className="inline-flex items-center gap-2">{children}</div>
    </div>
  )
}

interface ChipProps {
  children: React.ReactNode
}

function Chip({ children }: ChipProps) {
  return (
    <span className="inline-flex items-center rounded-lg bg-slate-100 px-3 py-1 text-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
      {children}
    </span>
  )
}

interface MetricProps {
  label: string
  value: string
}

function Metric({ label, value }: MetricProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-950/40">
      <div className="text-xs text-slate-500 dark:text-slate-400">{label}</div>
      <div className="text-base font-semibold text-slate-900 dark:text-slate-100">{value}</div>
    </div>
  )
}

interface SVGCustomerProps {
  step: Step
}

function SVGCustomer({ step }: SVGCustomerProps) {
  return (
    <div className="relative">
      <svg viewBox="0 0 240 140" className="w-full">
        <circle cx="60" cy="56" r="28" fill="#0f172a" />
        <circle cx="60" cy="52" r="18" fill="#1f2937" />
        <rect x="40" y="80" width="40" height="18" rx="9" fill="#1f2937" />

        <rect x="110" y="22" width="56" height="96" rx="12" fill="#0b1220" stroke="#334155" />
        <rect x="118" y="34" width="40" height="8" rx="4" fill="#334155" />
        <rect x="118" y="50" width="40" height="46" rx="6" fill="#0f172a" />
        <rect x="118" y="100" width="40" height="8" rx="4" fill="#334155" />

        <g transform="translate(126,58)">
          <path d="M30 0l10 4v9c0 8-5 12-10 15-5-3-10-7-10-15V4z" fill="#14b8a6" opacity="0.35" />
          <path d="M30 6l6 2v5c0 4-3 7-6 9-3-2-6-5-6-9V8z" fill="#14b8a6" />
        </g>

        <path d="M170 70 C 190 72, 206 86, 210 106" stroke="#14b8a6" strokeWidth="2" fill="none" strokeDasharray="4 6" />
      </svg>
      {step === 'Pay' && (
        <motion.div
          className="absolute left-[174px] top-[74px] h-2 w-2 rounded-full bg-teal-400"
          variants={variants.pulse}
          initial="initial"
          animate="animate"
        />
      )}
      {step === 'Confirm' && (
        <motion.div
          className="absolute -right-2 -top-2 grid h-8 w-8 place-items-center rounded-full bg-teal-500/10 ring-1 ring-teal-400/40"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 220, damping: 16 }}
        >
          <ShieldCheck className="h-4 w-4 text-teal-300" />
        </motion.div>
      )}
    </div>
  )
}

interface StackGraphicProps {
  stepIndex: number
}

function StackGraphic({ stepIndex }: StackGraphicProps) {
  const layers = [
    { id: 'pricing', label: 'Algorithmic Pricing' },
    { id: 'solvency', label: 'Solvency Controls' },
    { id: 'capital', label: 'Automated Capital Mgmt' },
  ] as const

  return (
    <div className="relative">
      <div className="grid gap-3">
        {layers.map((layer, index) => (
          <motion.div
            key={layer.id}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/40"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
          >
            <span className="text-sm text-slate-600 dark:text-slate-300">{layer.label}</span>
            <motion.span
              className="h-2 rounded bg-slate-300 dark:bg-slate-800"
              animate={{ width: stepIndex >= index ? 80 : 24 }}
              transition={{ type: 'spring', stiffness: 220, damping: 20 }}
            />
          </motion.div>
        ))}
      </div>
      <motion.div
        className="pointer-events-none absolute -inset-2 rounded-2xl"
        initial={{ boxShadow: '0 0 0 0 rgba(20,184,166,0)' }}
        animate={{
          boxShadow: stepIndex === 3 ? '0 0 0 6px rgba(20,184,166,0.15)' : '0 0 0 0 rgba(20,184,166,0)',
        }}
        transition={{ duration: 0.6 }}
      />
    </div>
  )
}
