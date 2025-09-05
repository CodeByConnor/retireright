import Link from 'next/link'
import { ArrowLeft, Calculator, Building, Users, DollarSign } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionItem } from '@/components/ui/accordion'
import { siteConfig } from '@/lib/site.config'

export default function LearnPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface via-white to-surface">
      {/* Header */}
      <header className="border-b border-border bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-sm">RR</span>
              </div>
              <span className="font-semibold text-foreground">{siteConfig.name}</span>
            </div>
            
            <Button asChild variant="outline" className="group">
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4 transition-all duration-300 ease-out group-hover:-translate-x-2 group-hover:scale-110" />
                <span>Back to Calculator</span>
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How Retirement Contributions Work
          </h1>
          <p className="text-lg text-muted-foreground">
            Understanding the basics of self-employed retirement contributions and how different business structures affect your limits.
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Employee Contributions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Money you contribute from your own income, either pre-tax (traditional) or after-tax (Roth).
              </p>
              <ul className="text-sm space-y-1">
                <li>• 2024 limit: $23,000</li>
                <li>• Age 50+ catch-up: +$7,500</li>
                <li>• Limited by your compensation</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-accent" />
                Employer Contributions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Money your business contributes on your behalf, always pre-tax.
              </p>
              <ul className="text-sm space-y-1">
                <li>• Up to 25% of compensation</li>
                <li>• ~20% for sole proprietors</li>
                <li>• Always pre-tax dollars</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Business Structure Differences */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Business Structure Differences</CardTitle>
            <CardDescription>
              How your business entity affects contribution calculations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Sole Proprietorship / LLC (Schedule C)</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Your net profit is your compensation for retirement purposes.
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Employee contributions limited by net profit</li>
                  <li>• Employer contributions ~20% of net earnings (after SE tax adjustment)</li>
                  <li>• Self-employment tax affects calculations</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2">S-Corporation</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Only W-2 wages count as compensation - business profits (K-1) do not.
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Employee contributions limited by W-2 wages</li>
                  <li>• Employer contributions up to 25% of W-2 wages</li>
                  <li>• Must pay "reasonable compensation" as W-2 wages</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2">C-Corporation</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Similar to S-Corp, based on W-2 wages paid to owner-employee.
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Employee contributions limited by W-2 wages</li>
                  <li>• Employer contributions up to 25% of W-2 wages</li>
                  <li>• Double taxation on business profits</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion>
              <AccordionItem title="What's the difference between pre-tax and Roth contributions?">
                <p className="text-sm text-muted-foreground mb-2">
                  <strong>Pre-tax (Traditional):</strong> You get a tax deduction now, but pay taxes when you withdraw in retirement.
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Roth:</strong> You pay taxes now, but withdrawals in retirement are tax-free (including growth).
                </p>
              </AccordionItem>

              <AccordionItem title="What is the 415(c) limit?">
                <p className="text-sm text-muted-foreground">
                  The total of all contributions (employee + employer) cannot exceed $69,000 in 2024 ($76,500 with catch-up). 
                  This is also limited to 100% of your compensation.
                </p>
              </AccordionItem>

              <AccordionItem title="When are catch-up contributions available?">
                <p className="text-sm text-muted-foreground">
                  If you're 50 or older by the end of the tax year, you can contribute an additional $7,500 in employee deferrals, 
                  for a total of $30,500 in 2024.
                </p>
              </AccordionItem>

              <AccordionItem title="How does self-employment tax affect contributions?">
                <p className="text-sm text-muted-foreground">
                  For sole proprietors, you can deduct half of your self-employment tax, which reduces the income base 
                  for calculating employer contributions. This effectively limits employer contributions to about 20% of net earnings.
                </p>
              </AccordionItem>

              <AccordionItem title="Can I contribute if I have employees?">
                <p className="text-sm text-muted-foreground">
                  If you have employees, you generally need to contribute equally for them (as a percentage of compensation). 
                  Solo 401(k) plans are only available when you have no employees other than your spouse.
                </p>
              </AccordionItem>

              <AccordionItem title="When do I need to make contributions?">
                <p className="text-sm text-muted-foreground">
                  Employee deferrals must be made by December 31st. Employer contributions can be made up to your tax filing deadline 
                  (including extensions) - typically October 15th for the prior tax year.
                </p>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center mt-8">
          <Button asChild size="lg" className="group">
            <Link href="/" className="flex items-center gap-3">
              <Calculator className="h-5 w-5 transition-all duration-300 ease-out group-hover:rotate-12 group-hover:scale-110" />
              <span>Try the Calculator</span>
            </Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
