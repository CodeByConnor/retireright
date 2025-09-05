'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSearchParams } from 'next/navigation'
import { Calculator, Info, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { CurrencyInput } from '@/components/ui/currency-input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { Accordion, AccordionItem } from '@/components/ui/accordion'

import { 
  calculatorInputSchema, 
  type CalculatorInput,
  type CalculationResult,
  FilingEntity,
  ContributionType,
  US_STATES
} from '@/lib/types'
import { cn } from '@/lib/utils'

interface CalculatorFormProps {
  onResult: (result: CalculationResult) => void
  className?: string
}

export function CalculatorForm({ onResult, className }: CalculatorFormProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const searchParams = useSearchParams()

  // Get values from URL parameters
  const getInitialValues = (): Partial<CalculatorInput> => {
    const urlParams: Partial<CalculatorInput> = {
      filingEntity: FilingEntity.SOLE_PROP,
      state: 'CA',
      age: 35,
      contributionType: ContributionType.PRE_TAX,
      rothPercentage: 50,
      enableCatchUp: false,
      assumeSelfEmploymentTax: true,
      marginalTaxRate: 0.22,
      netProfit: 0,
      w2Wages: 0,
      businessProfit: 0
    }

    // Override with URL parameters if present
    if (searchParams.get('entity')) {
      urlParams.filingEntity = searchParams.get('entity') as any
    }
    if (searchParams.get('age')) {
      urlParams.age = parseInt(searchParams.get('age') || '35')
    }
    if (searchParams.get('state')) {
      urlParams.state = searchParams.get('state') || 'CA'
    }
    if (searchParams.get('income')) {
      const income = parseInt(searchParams.get('income') || '0')
      if (urlParams.filingEntity === FilingEntity.SOLE_PROP) {
        urlParams.netProfit = income
      } else {
        urlParams.w2Wages = income
      }
    }
    if (searchParams.get('type')) {
      urlParams.contributionType = searchParams.get('type') as any
    }

    return urlParams
  }

  const form = useForm<CalculatorInput>({
    resolver: zodResolver(calculatorInputSchema),
    defaultValues: getInitialValues()
  })

  const watchedValues = form.watch()
  const { filingEntity, age, contributionType } = watchedValues

  // Auto-enable catch-up for age 50+
  React.useEffect(() => {
    if (age >= 50 && !form.getValues('enableCatchUp')) {
      form.setValue('enableCatchUp', true)
    }
  }, [age, form])

  const onSubmit = async (data: CalculatorInput) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/calc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error?.message || 'Calculation failed')
      }

      onResult(result.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const getIncomeFields = () => {
    switch (filingEntity) {
      case FilingEntity.SOLE_PROP:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="netProfit" className="text-sm font-medium">Net Profit (Schedule C)</Label>
              <CurrencyInput
                id="netProfit"
                placeholder="100,000"
                className="mt-1"
                roundTo={1000}
                value={form.watch('netProfit')}
                onChange={(value) => form.setValue('netProfit', value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Enter your net profit after business expenses (automatically rounded to nearest $1,000)
              </p>
            </div>
          </div>
        )
      
      case FilingEntity.S_CORP:
      case FilingEntity.C_CORP:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="w2Wages" className="text-sm font-medium">W-2 Wages</Label>
              <CurrencyInput
                id="w2Wages"
                placeholder="80,000"
                className="mt-1"
                roundTo={1000}
                value={form.watch('w2Wages')}
                onChange={(value) => form.setValue('w2Wages', value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                W-2 wages paid to owner-employee (automatically rounded to nearest $1,000)
              </p>
            </div>
            <div>
              <Label htmlFor="businessProfit" className="text-sm font-medium">Business Profit (Optional)</Label>
              <CurrencyInput
                id="businessProfit"
                placeholder="50,000"
                className="mt-1"
                roundTo={1000}
                value={form.watch('businessProfit')}
                onChange={(value) => form.setValue('businessProfit', value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Additional business profit for context (automatically rounded to nearest $1,000)
              </p>
            </div>
          </div>
        )
    }
  }

  return (
    <Card className={cn("w-full max-w-2xl shadow-lg", className)}>
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Calculator className="h-6 w-6 text-primary" />
          RetireRight Calculator
        </CardTitle>
        <CardDescription className="text-base">
          Calculate your optimal 401(k), Solo 401(k), or SEP contribution limits based on your business structure and income.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Business Structure */}
          <div className="space-y-4 p-4 bg-muted/30 rounded-lg border">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <div className="h-2 w-2 bg-primary rounded-full"></div>
              Business Information
            </h3>
            <div>
              <Label htmlFor="filingEntity" className="text-sm font-medium">Business Structure</Label>
              <Select
                id="filingEntity"
                {...form.register('filingEntity')}
                className="mt-1"
              >
                <option value={FilingEntity.SOLE_PROP}>Sole Proprietorship / LLC (Schedule C)</option>
                <option value={FilingEntity.S_CORP}>S-Corporation</option>
                <option value={FilingEntity.C_CORP}>C-Corporation</option>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="state" className="text-sm font-medium">State</Label>
                <Select
                  id="state"
                  {...form.register('state')}
                  className="mt-1"
                >
                  {US_STATES.map((state) => (
                    <option key={state.value} value={state.value}>
                      {state.label}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <Label htmlFor="age" className="text-sm font-medium">Age</Label>
                <Input
                  id="age"
                  type="number"
                  min="18"
                  max="100"
                  className="mt-1"
                  {...form.register('age', { valueAsNumber: true })}
                />
              </div>
            </div>
          </div>

          {/* Income */}
          <div className="space-y-4 p-4 bg-muted/30 rounded-lg border">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <div className="h-2 w-2 bg-accent rounded-full"></div>
              Income Information
            </h3>
            {getIncomeFields()}
          </div>

          {/* Contribution Preferences */}
          <div className="space-y-4 p-4 bg-muted/30 rounded-lg border">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <div className="h-2 w-2 bg-primary rounded-full"></div>
              Contribution Preferences
            </h3>
            
            <div>
              <Label htmlFor="contributionType">Contribution Type</Label>
              <Select
                id="contributionType"
                {...form.register('contributionType')}
              >
                <option value={ContributionType.PRE_TAX}>Pre-tax (Traditional)</option>
                <option value={ContributionType.ROTH}>Roth (After-tax)</option>
                <option value={ContributionType.MIX}>Mix of Both</option>
              </Select>
            </div>

            {contributionType === ContributionType.MIX && (
              <div className="space-y-2">
                <Label>Roth Percentage: {form.watch('rothPercentage')}%</Label>
                <Slider
                  min={0}
                  max={100}
                  step={5}
                  value={form.watch('rothPercentage')}
                  onValueChange={(value) => form.setValue('rothPercentage', value)}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0% Roth</span>
                  <span>100% Roth</span>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Checkbox
                id="enableCatchUp"
                {...form.register('enableCatchUp')}
                disabled={age < 50}
              />
              <Label htmlFor="enableCatchUp" className="text-sm">
                Enable catch-up contributions (Age 50+)
                {age >= 50 && <span className="text-primary ml-1">✓ Eligible</span>}
              </Label>
            </div>
          </div>

          {/* Advanced Options */}
          <Accordion>
            <AccordionItem title="Advanced Options">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Marginal Tax Rate: {(form.watch('marginalTaxRate') * 100).toFixed(0)}%</Label>
                  <Slider
                    min={0.1}
                    max={0.5}
                    step={0.01}
                    value={form.watch('marginalTaxRate')}
                    onValueChange={(value) => form.setValue('marginalTaxRate', value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Used for tax savings estimates
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="assumeSelfEmploymentTax"
                    {...form.register('assumeSelfEmploymentTax')}
                  />
                  <Label htmlFor="assumeSelfEmploymentTax" className="text-sm">
                    Apply self-employment tax adjustments (for sole proprietors)
                  </Label>
                </div>
              </div>
            </AccordionItem>
          </Accordion>

          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                {error}
              </div>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Calculating...</span>
              </>
            ) : (
              <>
                <Calculator className="h-5 w-5 transition-all duration-300 ease-out group-hover:rotate-12 group-hover:scale-110" />
                <span>Calculate Contributions</span>
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
