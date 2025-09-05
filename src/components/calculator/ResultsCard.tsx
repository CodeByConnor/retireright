'use client'

import * as React from 'react'
import { BarChart3, Banknote, Wallet, AlertTriangle, FileDown, Link2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionItem } from '@/components/ui/accordion'

import type { CalculationResult } from '@/lib/types'
import { formatCurrency, formatPercentage, generateShareableUrl } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface ResultsCardProps {
  result: CalculationResult
  className?: string
}

export function ResultsCard({ result, className }: ResultsCardProps) {
  const { contributions, taxSavings, limits, flags, notes, warnings } = result

  const handleDownload = () => {
    const downloadDataObj = {
      calculationDate: new Date().toISOString(),
      calculator: 'RetireRight',
      input: {
        businessStructure: result.input.filingEntity,
        state: result.input.state,
        age: result.input.age,
        income: result.input.netProfit || result.input.w2Wages || 0,
        contributionType: result.input.contributionType,
        marginalTaxRate: result.input.marginalTaxRate
      },
      results: {
        employeeContribution: contributions.employeeDeferral,
        employerContribution: contributions.employerContribution,
        totalContribution: contributions.total,
        preTaxAmount: contributions.preTaxAmount,
        rothAmount: contributions.rothAmount,
        estimatedTaxSavings: taxSavings.estimatedSavings,
        effectiveCost: taxSavings.effectiveContributionCost
      },
      limits,
      notes,
      warnings,
      disclaimer: 'These are planning estimates only and should not be considered as tax or legal advice. Consult with a qualified CPA or financial advisor before making contribution decisions.'
    }

    // Create and download the file
    const content = JSON.stringify(downloadDataObj, null, 2)
    const blob = new Blob([content], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `retireright-calculation-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleShare = async () => {
    const shareParams = {
      entity: result.input.filingEntity,
      age: result.input.age,
      state: result.input.state,
      income: result.input.netProfit || result.input.w2Wages || 0,
      type: result.input.contributionType
    }

    const shareUrl = generateShareableUrl(shareParams)
    
    try {
      await navigator.clipboard.writeText(shareUrl)
      // Show success feedback
      alert('Calculation link copied to clipboard! Share it with others to show your retirement contribution strategy.')
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = shareUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      alert('Calculation link copied to clipboard!')
    }
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Main Results */}
      <Card className="shadow-lg border-primary/20">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center gap-2 text-xl">
            <BarChart3 className="h-6 w-6 text-primary" />
            Your Optimal Contribution Strategy
          </CardTitle>
          <CardDescription>
            Based on your {result.input.filingEntity.replace('_', '-')} structure and ${formatCurrency(
              result.input.netProfit || result.input.w2Wages || 0, { compact: true }
            )} income
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Employee Contribution */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Banknote className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium">Employee Contribution</span>
              </div>
              <div className="text-2xl font-bold text-foreground">
                {formatCurrency(contributions.employeeDeferral)}
              </div>
              <div className="space-y-1 text-xs text-muted-foreground">
                {contributions.preTaxAmount > 0 && (
                  <div>Pre-tax: {formatCurrency(contributions.preTaxAmount - contributions.employerContribution)}</div>
                )}
                {contributions.rothAmount > 0 && (
                  <div>Roth: {formatCurrency(contributions.rothAmount)}</div>
                )}
                {contributions.catchUpAmount > 0 && (
                  <div className="text-primary">Catch-up: {formatCurrency(contributions.catchUpAmount)}</div>
                )}
              </div>
            </div>

            {/* Employer Contribution */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Employer Contribution</span>
              </div>
              <div className="text-2xl font-bold text-foreground">
                {formatCurrency(contributions.employerContribution)}
              </div>
              <div className="text-xs text-muted-foreground">
                Always pre-tax
              </div>
            </div>

            {/* Total Contribution */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Total Annual Contribution</span>
              </div>
              <div className="text-2xl font-bold text-primary">
                {formatCurrency(contributions.total)}
              </div>
              <div className="text-xs text-muted-foreground">
                {formatPercentage(contributions.total / (result.input.netProfit || result.input.w2Wages || 1))} of income
              </div>
            </div>
          </div>

          {/* Tax Savings */}
          <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
            <h4 className="font-medium text-foreground mb-2">Estimated Tax Savings</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Annual tax savings:</span>
                <span className="ml-2 font-medium text-primary">
                  {formatCurrency(taxSavings.estimatedSavings)}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Effective contribution cost:</span>
                <span className="ml-2 font-medium">
                  {formatCurrency(taxSavings.effectiveContributionCost)}
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Based on {formatPercentage(taxSavings.marginalRate)} marginal tax rate
            </p>
          </div>

          {/* Limit Flags */}
          {(flags.hitElectiveDeferralLimit || flags.hit415cLimit || flags.hitCompensationLimit) && (
            <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200">
              <div className="flex items-center gap-2 text-amber-800 text-sm font-medium mb-1">
                <AlertTriangle className="h-4 w-4" />
                Contribution Limits Reached
              </div>
              <div className="text-xs text-amber-700 space-y-1">
                {flags.hitElectiveDeferralLimit && (
                  <div>• Hit employee deferral limit: {formatCurrency(limits.electiveDeferralLimit)}</div>
                )}
                {flags.hit415cLimit && (
                  <div>• Hit overall 415(c) limit: {formatCurrency(limits.overallLimit415c)}</div>
                )}
                {flags.hitCompensationLimit && (
                  <div>• Limited by compensation: {formatCurrency(limits.compensationLimit)}</div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={handleDownload} variant="outline" className="flex-1">
          <FileDown className="h-4 w-4 transition-all duration-300 ease-out group-hover:-translate-y-1 group-hover:scale-110" />
          <span>Download Results</span>
        </Button>
        <Button onClick={handleShare} variant="outline" className="flex-1">
          <Link2 className="h-4 w-4 transition-all duration-300 ease-out group-hover:rotate-12 group-hover:scale-110" />
          <span>Share Calculation</span>
        </Button>
      </div>

      {/* Detailed Information */}
      <Accordion>
        <AccordionItem title="Contribution Limits & Details">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Employee deferral limit:</span>
                <span className="ml-2 font-medium">{formatCurrency(limits.electiveDeferralLimit)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Overall 415(c) limit:</span>
                <span className="ml-2 font-medium">{formatCurrency(limits.overallLimit415c)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Compensation basis:</span>
                <span className="ml-2 font-medium">{formatCurrency(limits.compensationLimit)}</span>
              </div>
              {limits.catchUpLimit > 0 && (
                <div>
                  <span className="text-muted-foreground">Catch-up limit:</span>
                  <span className="ml-2 font-medium">{formatCurrency(limits.catchUpLimit)}</span>
                </div>
              )}
            </div>
          </div>
        </AccordionItem>

        {notes.length > 0 && (
          <AccordionItem title="Important Notes">
            <ul className="space-y-1 text-sm">
              {notes.map((note, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </AccordionItem>
        )}

        {warnings.length > 0 && (
          <AccordionItem title="Warnings & Considerations">
            <ul className="space-y-1 text-sm text-amber-700">
              {warnings.map((warning, index) => (
                <li key={index} className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 mt-0.5 text-amber-500" />
                  <span>{warning}</span>
                </li>
              ))}
            </ul>
          </AccordionItem>
        )}
      </Accordion>

      {/* Disclaimer */}
      <Card className="bg-muted/30">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground text-center">
            <strong>Disclaimer:</strong> These are planning estimates only and should not be considered as tax or legal advice. 
            Consult with a qualified CPA or financial advisor before making contribution decisions. 
            IRS limits and tax rules may change.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
