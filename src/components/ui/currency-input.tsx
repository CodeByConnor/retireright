'use client'

import * as React from "react"
import { Input } from "./input"
import { cn } from "@/lib/utils"

export interface CurrencyInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value?: number
  onChange?: (value: number) => void
  roundTo?: number // Round to nearest X (e.g., 1000, 500, 100)
}

const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ className, value, onChange, roundTo = 1000, ...props }, ref) => {
    const [displayValue, setDisplayValue] = React.useState('')
    const [isFocused, setIsFocused] = React.useState(false)

    // Format number with commas
    const formatNumber = (num: number): string => {
      return new Intl.NumberFormat('en-US').format(num)
    }

    // Parse formatted number string
    const parseNumber = (str: string): number => {
      const cleaned = str.replace(/[,$]/g, '')
      const num = parseFloat(cleaned)
      return isNaN(num) ? 0 : num
    }

    // Round to nearest specified amount
    const roundValue = (num: number): number => {
      return Math.round(num / roundTo) * roundTo
    }

    // Update display value when prop value changes
    React.useEffect(() => {
      if (value !== undefined && !isFocused) {
        setDisplayValue(value > 0 ? formatNumber(value) : '')
      }
    }, [value, isFocused])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value
      setDisplayValue(inputValue)

      // Parse the value but don't round until blur
      const numericValue = parseNumber(inputValue)
      onChange?.(numericValue)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      
      // Format the final value on blur
      const numericValue = parseNumber(displayValue)
      const roundedValue = roundValue(numericValue)
      
      if (roundedValue > 0) {
        setDisplayValue(formatNumber(roundedValue))
      } else {
        setDisplayValue('')
      }
      
      onChange?.(roundedValue)
      props.onBlur?.(e)
    }

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      
      // Show unformatted number for editing
      if (value && value > 0) {
        setDisplayValue(value.toString())
      }
      
      props.onFocus?.(e)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Allow: backspace, delete, tab, escape, enter
      if ([8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
          // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
          (e.keyCode === 65 && e.ctrlKey === true) ||
          (e.keyCode === 67 && e.ctrlKey === true) ||
          (e.keyCode === 86 && e.ctrlKey === true) ||
          (e.keyCode === 88 && e.ctrlKey === true) ||
          // Allow: home, end, left, right
          (e.keyCode >= 35 && e.keyCode <= 39)) {
        return
      }
      
      // Ensure that it is a number and stop the keypress
      if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault()
      }
      
      props.onKeyDown?.(e)
    }

    return (
      <div className="relative">
        <Input
          {...props}
          ref={ref}
          type="text"
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          className={cn("pr-12", className)}
          placeholder={props.placeholder || "0"}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <span className="text-muted-foreground text-sm">$</span>
        </div>
      </div>
    )
  }
)
CurrencyInput.displayName = "CurrencyInput"

export { CurrencyInput }
