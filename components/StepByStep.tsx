'use client'

import { useState } from 'react'

interface Step {
    title: string
    description: string
    tip?: string
}

interface StepByStepProps {
    steps: Step[]
}

export function StepByStep({ steps }: StepByStepProps) {
    const [activeStep, setActiveStep] = useState(0)

    return (
        <div className="rounded-xl border border-border bg-background p-6 my-8 not-prose">
            {/* Step indicators */}
            <div className="flex items-center gap-0 mb-8 overflow-x-auto pb-2">
                {steps.map((step, index) => (
                    <div key={index} className="flex items-center shrink-0">
                        <button
                            onClick={() => setActiveStep(index)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${index === activeStep
                                    ? 'bg-brand-500/10 dark:bg-brand-500/20 border border-brand-500/30'
                                    : index < activeStep
                                        ? 'text-brand-600 dark:text-brand-400'
                                        : 'text-muted-foreground'
                                }`}
                        >
                            <span
                                className={`flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold transition-all ${index === activeStep
                                        ? 'bg-brand-500 text-white'
                                        : index < activeStep
                                            ? 'bg-brand-500/20 text-brand-600 dark:text-brand-400'
                                            : 'bg-muted text-muted-foreground'
                                    }`}
                            >
                                {index < activeStep ? '✓' : index + 1}
                            </span>
                            <span className="text-sm font-medium hidden sm:inline">{step.title}</span>
                        </button>
                        {index < steps.length - 1 && (
                            <div
                                className={`w-8 h-0.5 mx-1 ${index < activeStep ? 'bg-brand-500' : 'bg-border'
                                    }`}
                            />
                        )}
                    </div>
                ))}
            </div>

            {/* Active step content */}
            <div className="min-h-[120px]">
                <h4 className="text-xl font-semibold text-foreground mb-3">
                    {steps[activeStep].title}
                </h4>
                <p className="text-muted-foreground leading-relaxed">{steps[activeStep].description}</p>
                {steps[activeStep].tip && (
                    <div className="mt-4 flex items-start gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                        <span className="text-sm">💡</span>
                        <p className="text-sm text-amber-800 dark:text-amber-200 m-0">
                            {steps[activeStep].tip}
                        </p>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-6 pt-4 border-t border-border">
                <button
                    onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
                    disabled={activeStep === 0}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-muted text-muted-foreground"
                >
                    ← Previous
                </button>
                <span className="text-xs text-muted-foreground self-center">
                    Step {activeStep + 1} of {steps.length}
                </span>
                <button
                    onClick={() => setActiveStep((prev) => Math.min(steps.length - 1, prev + 1))}
                    disabled={activeStep === steps.length - 1}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-brand-500 text-white hover:bg-brand-600"
                >
                    Next →
                </button>
            </div>
        </div>
    )
}
