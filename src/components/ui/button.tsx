import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary-dark shadow-sm hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 active:translate-y-0 transform-gpu",
        destructive: "bg-destructive text-destructive-foreground hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0 transform-gpu",
        outline: "border border-border bg-background hover:bg-muted hover:text-accent-foreground hover:border-primary/50 hover:-translate-y-0.5 active:translate-y-0 hover:shadow-md transform-gpu",
        secondary: "bg-muted text-muted-foreground hover:bg-muted/80 hover:-translate-y-0.5 active:translate-y-0 transform-gpu",
        ghost: "hover:bg-muted hover:text-accent-foreground hover:-translate-y-0.5 active:translate-y-0 transform-gpu",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2 gap-2",
        sm: "h-9 rounded-lg px-4 gap-1.5",
        lg: "h-12 rounded-xl px-8 gap-2.5 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
