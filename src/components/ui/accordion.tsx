'use client'

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface AccordionItemProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
  className?: string
}

export function AccordionItem({ 
  title, 
  children, 
  defaultOpen = false, 
  className 
}: AccordionItemProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)

  return (
    <div className={cn("border border-border rounded-lg", className)}>
      <button
        className="flex w-full items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <span className="font-medium">{title}</span>
        <ChevronDown 
          className={cn(
            "h-4 w-4 shrink-0 transition-transform duration-200",
            isOpen && "rotate-180"
          )} 
        />
      </button>
      {isOpen && (
        <div className="px-4 pb-4 pt-0 text-sm text-muted-foreground">
          {children}
        </div>
      )}
    </div>
  )
}

interface AccordionProps {
  children: React.ReactNode
  className?: string
}

export function Accordion({ children, className }: AccordionProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {children}
    </div>
  )
}
