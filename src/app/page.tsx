'use client'

import * as React from 'react'
import Link from 'next/link'
import { ArrowRight, GraduationCap, ShieldCheck, Building2, TrendingUp, MapPin } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { CalculatorForm } from '@/components/calculator/CalculatorForm'
import { ResultsCard } from '@/components/calculator/ResultsCard'

import type { CalculationResult } from '@/lib/types'
import { siteConfig } from '@/lib/site.config'

export default function HomePage() {
  const [result, setResult] = React.useState<CalculationResult | null>(null)

  const handleResult = (newResult: CalculationResult) => {
    setResult(newResult)
    // Scroll to results
    setTimeout(() => {
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface via-white to-surface">
      {/* Header */}
      <header className="border-b border-border bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-sm">RR</span>
              </div>
              <span className="font-semibold text-foreground">{siteConfig.name}</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-6 text-sm">
              <Link href="/learn" className="text-muted-foreground hover:text-foreground transition-colors">
                Learn
              </Link>
              <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
              <Link href="/disclaimer" className="text-muted-foreground hover:text-foreground transition-colors">
                Disclaimer
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Optimize Your Retirement
            <span className="text-primary block">Contributions</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Calculate optimal 401(k), Solo 401(k), and SEP contribution limits for self-employed professionals 
            based on your business structure, location, and income.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg">
              <Link href="#calculator" className="flex items-center">
                <span>Get Started</span>
                <ArrowRight className="h-5 w-5 transition-all duration-300 ease-out group-hover:translate-x-2 group-hover:scale-110" />
              </Link>
            </Button>
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="/learn" className="group flex items-center gap-2 hover:text-foreground transition-all duration-200">
                <GraduationCap className="h-4 w-4 transition-all duration-200 group-hover:scale-110" />
                <span>Learn How It Works</span>
              </Link>
              <Link href="/disclaimer" className="group flex items-center gap-2 hover:text-foreground transition-all duration-200">
                <ShieldCheck className="h-4 w-4 transition-all duration-200 group-hover:scale-110" />
                <span>Assumptions</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Calculator Section */}
        <div id="calculator" className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
            <div className="w-full lg:w-auto lg:min-w-[500px] lg:max-w-[600px]">
              <CalculatorForm onResult={handleResult} className="mx-auto" />
            </div>
            
            {result && (
              <div id="results" className="w-full lg:w-auto lg:min-w-[500px] lg:max-w-[600px]">
                <ResultsCard result={result} />
              </div>
            )}
          </div>
        </div>

        {/* Features */}
        {!result && (
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Multiple Plan Types</h3>
              <p className="text-sm text-muted-foreground">
                Supports Solo 401(k), SEP-IRA, and traditional 401(k) calculations for different business structures.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-semibold mb-2">Tax Optimization</h3>
              <p className="text-sm text-muted-foreground">
                Calculate pre-tax vs Roth contributions and estimate your tax savings with personalized rates.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">State-Aware</h3>
              <p className="text-sm text-muted-foreground">
                Takes into account your state's tax situation for more accurate contribution planning.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p className="mb-2">
              <strong>Educational estimates only.</strong> Not tax or legal advice.
            </p>
            <p>
              Built by <strong>{siteConfig.author}</strong> • 
              <Link href="/disclaimer" className="hover:text-foreground ml-1">
                View Disclaimers
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}