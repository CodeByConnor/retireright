import Link from 'next/link'
import { ArrowLeft, AlertTriangle, Calendar, Calculator } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { siteConfig } from '@/lib/site.config'

export default function DisclaimerPage() {
  const lastUpdated = "January 1, 2024"

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
            Disclaimers & Assumptions
          </h1>
          <p className="text-lg text-muted-foreground">
            Important information about the calculations, limitations, and assumptions used in this tool.
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
            <Calendar className="h-4 w-4" />
            Last updated: {lastUpdated}
          </div>
        </div>

        <div className="space-y-6">
          {/* Main Disclaimer */}
          <Card className="bg-amber-50 border-amber-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-800">
                <AlertTriangle className="h-5 w-5" />
                Important Disclaimer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-amber-700">
                <p className="font-medium">
                  This tool provides educational estimates only and should not be considered as tax, legal, or financial advice.
                </p>
                <ul className="space-y-2 text-sm">
                  <li>• Always consult with a qualified CPA, tax advisor, or financial planner before making retirement contribution decisions</li>
                  <li>• Tax laws, IRS limits, and regulations may change without notice</li>
                  <li>• Individual circumstances may affect eligibility and contribution limits</li>
                  <li>• This tool does not constitute professional advice or recommendations</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Calculation Assumptions */}
          <Card>
            <CardHeader>
              <CardTitle>Calculation Assumptions</CardTitle>
              <CardDescription>
                Key assumptions and methodologies used in the calculations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">IRS Limits (2024)</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Employee deferral limit: $23,000</li>
                    <li>• Catch-up contribution limit: $7,500 (age 50+)</li>
                    <li>• Overall 415(c) limit: $69,000 ($76,500 with catch-up)</li>
                    <li>• Compensation limit: $345,000</li>
                    <li>• Self-employment tax rate: 14.13%</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Sole Proprietor Calculations</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Net earnings subject to self-employment tax</li>
                    <li>• 50% of SE tax is deductible</li>
                    <li>• Effective employer contribution rate ~20% due to circular calculation</li>
                    <li>• Compensation base is net profit from Schedule C</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">S-Corp & C-Corp Calculations</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Only W-2 wages count as compensation</li>
                    <li>• Business profits (K-1 income) do not count for contribution purposes</li>
                    <li>• Employer contributions up to 25% of W-2 wages</li>
                    <li>• "Reasonable compensation" requirements assumed to be met</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Tax Savings Estimates</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Based on marginal tax rate provided by user</li>
                    <li>• Federal taxes only - state taxes vary by location</li>
                    <li>• Does not account for phase-outs or alternative minimum tax</li>
                    <li>• Assumes current tax rates continue</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Limitations */}
          <Card>
            <CardHeader>
              <CardTitle>Limitations & Exclusions</CardTitle>
              <CardDescription>
                What this tool does not account for
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Not Included in Calculations</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• State-specific contribution limits or special rules</li>
                    <li>• Alternative minimum tax (AMT) implications</li>
                    <li>• Phase-outs for high-income earners</li>
                    <li>• Multiple plan aggregation rules</li>
                    <li>• Required minimum distributions (RMDs)</li>
                    <li>• Plan administration fees and costs</li>
                    <li>• Investment performance or market conditions</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Special Circumstances Not Addressed</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Multiple businesses or entities</li>
                    <li>• Controlled group or affiliated service group rules</li>
                    <li>• Highly compensated employee (HCE) testing</li>
                    <li>• Top-heavy plan requirements</li>
                    <li>• Employee benefit plan coordination</li>
                    <li>• Divorce or other family law considerations</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Sources */}
          <Card>
            <CardHeader>
              <CardTitle>Data Sources</CardTitle>
              <CardDescription>
                Official sources used for calculations and limits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold mb-2">IRS Publications & Guidance</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• IRS Publication 560 - Retirement Plans for Small Business (SEP, SIMPLE, and Qualified Plans)</li>
                    <li>• Notice 2023-75 - 2024 Limitations Adjusted for Cost-of-Living</li>
                    <li>• Internal Revenue Code Section 415(c) - Limitation on Annual Additions</li>
                    <li>• IRS Revenue Procedures and Private Letter Rulings</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Tax Code References</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• IRC Section 401(k) - Cash or Deferred Arrangements</li>
                    <li>• IRC Section 408(k) - Simplified Employee Pensions</li>
                    <li>• IRC Section 1401 - Self-Employment Tax</li>
                    <li>• IRC Section 164(f) - Deduction for One-Half of Self-Employment Taxes</li>
                  </ul>
                </div>

                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">
                    <strong>Note:</strong> All calculations are based on federal tax law and IRS guidance current as of the last update date. 
                    State laws may impose additional requirements or limitations not reflected in these calculations.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Data */}
          <Card>
            <CardHeader>
              <CardTitle>Privacy & Data Handling</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>
                  <strong>No Personal Information Stored:</strong> This calculator does not store, transmit, or retain any personal financial information. 
                  All calculations are performed locally in your browser.
                </p>
                <p>
                  <strong>No Account Required:</strong> You can use this tool without creating an account or providing any personal information.
                </p>
                <p>
                  <strong>Analytics:</strong> This site may use privacy-focused analytics to understand usage patterns, but no personally identifiable information is collected.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle>Questions or Corrections</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                If you believe there are errors in the calculations or have suggestions for improvements, 
                please reach out through the contact information provided on the About page.
              </p>
              <p className="text-sm text-muted-foreground">
                While we strive for accuracy, this tool should always be used in conjunction with professional tax and financial advice.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center mt-8">
          <Button asChild size="lg" className="group">
            <Link href="/" className="flex items-center gap-3">
              <Calculator className="h-5 w-5 transition-all duration-300 ease-out group-hover:rotate-12 group-hover:scale-110" />
              <span>Back to Calculator</span>
            </Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
