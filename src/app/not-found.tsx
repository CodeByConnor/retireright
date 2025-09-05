import Link from 'next/link'
import { Home, Calculator, ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { siteConfig } from '@/lib/site.config'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface via-white to-surface flex items-center justify-center">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          {/* Logo */}
          <div className="flex items-center justify-center space-x-2 mb-8">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold">RC</span>
            </div>
            <span className="font-semibold text-foreground text-lg">{siteConfig.name}</span>
          </div>

          <Card>
            <CardHeader className="text-center">
              <div className="text-6xl font-bold text-primary mb-4">404</div>
              <CardTitle className="text-2xl">Page Not Found</CardTitle>
              <CardDescription>
                The page you're looking for doesn't exist or has been moved.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Don't worry, you can still access all the features of RetireRight.
              </p>
              
              <div className="flex flex-col gap-3">
                <Button asChild size="lg" className="w-full">
                  <Link href="/">
                    <Calculator className="mr-2 h-4 w-4" />
                    Go to Calculator
                  </Link>
                </Button>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button asChild variant="outline" size="sm">
                    <Link href="/learn">
                      Learn More
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/about">
                      About
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Popular pages:
            </p>
            <div className="flex justify-center gap-4 text-sm">
              <Link href="/learn" className="text-primary hover:text-primary-dark transition-colors">
                How It Works
              </Link>
              <Link href="/disclaimer" className="text-primary hover:text-primary-dark transition-colors">
                Disclaimers
              </Link>
              <Link href="/about" className="text-primary hover:text-primary-dark transition-colors">
                About
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
