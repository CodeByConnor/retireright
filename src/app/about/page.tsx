import Link from 'next/link'
import { ArrowLeft, Mail, Github, Calculator } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { siteConfig } from '@/lib/site.config'

export default function AboutPage() {
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
            
            <Button asChild variant="outline">
              <Link href="/" className="flex items-center">
                <ArrowLeft className="h-4 w-4 transition-all duration-300 ease-out group-hover:-translate-x-2 group-hover:scale-110" />
                <span>Back to Calculator</span>
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            About This Tool
          </h1>
          <p className="text-lg text-muted-foreground">
            Learn about the purpose, creator, and philosophy behind this retirement contribution calculator.
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Why This Tool Exists</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p className="text-muted-foreground mb-4">
                Retirement planning for self-employed individuals can be complex and confusing. Different business 
                structures have different rules, limits vary by age, and the interaction between employee and employer 
                contributions isn't always clear.
              </p>
              <p className="text-muted-foreground mb-4">
                This tool was created to simplify the process by providing clear, accurate calculations for optimal 
                retirement contribution strategies across different business entities and income levels.
              </p>
              <p className="text-muted-foreground">
                Whether you're a freelancer, consultant, small business owner, or entrepreneur, this calculator 
                helps you maximize your retirement savings while staying within IRS limits.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>About the Creator</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                This tool was created by <strong>Connor Pham</strong> to help self-employed folks explore 
                retirement contribution options.
              </p>
              <p className="text-muted-foreground mb-6">
                As someone who has navigated the complexities of self-employed retirement planning, Connor 
                understands the importance of having reliable, easy-to-use tools for financial planning.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild variant="outline" size="sm">
                  <a href={siteConfig.links.email}>
                    <Mail className="mr-2 h-4 w-4" />
                    Contact
                  </a>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <a href={siteConfig.links.github} target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    View Source
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Technical Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Built With</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Next.js 15 (App Router)</li>
                    <li>• TypeScript</li>
                    <li>• Tailwind CSS</li>
                    <li>• Zod for validation</li>
                    <li>• React Hook Form</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Features</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Real-time calculations</li>
                    <li>• State-aware tax considerations</li>
                    <li>• Multiple business entity support</li>
                    <li>• Responsive design</li>
                    <li>• Shareable results</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 p-4 rounded-lg bg-muted/50">
                <h4 className="font-semibold mb-2">Open Source</h4>
                <p className="text-sm text-muted-foreground">
                  This tool is open source and available on GitHub. Contributions, bug reports, 
                  and feature requests are welcome.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Sources & Accuracy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Calculations are based on current IRS Publication 560 and related tax code provisions. 
                The tool uses 2024 contribution limits and tax rules.
              </p>
              
              <div className="space-y-3 text-sm">
                <div>
                  <strong>IRS Sources:</strong>
                  <ul className="text-muted-foreground mt-1 ml-4">
                    <li>• Publication 560 - Retirement Plans for Small Business</li>
                    <li>• Notice 2023-75 - 2024 Contribution Limits</li>
                    <li>• IRC Section 415(c) - Overall Contribution Limits</li>
                  </ul>
                </div>
                
                <div>
                  <strong>Updates:</strong>
                  <p className="text-muted-foreground mt-1">
                    Limits and calculations are updated annually when the IRS releases new guidance, 
                    typically in late October or November.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-amber-50 border-amber-200">
            <CardHeader>
              <CardTitle className="text-amber-800">Important Disclaimer</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-amber-700 text-sm">
                This tool provides educational estimates only and should not be considered as tax, legal, 
                or financial advice. Always consult with qualified professionals before making retirement 
                contribution decisions. Tax laws and IRS limits may change.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center mt-8">
          <Button asChild size="lg">
            <Link href="/" className="flex items-center">
              <Calculator className="h-5 w-5 transition-all duration-300 ease-out group-hover:rotate-12 group-hover:scale-110" />
              <span>Try the Calculator</span>
            </Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
