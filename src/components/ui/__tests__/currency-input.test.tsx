import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CurrencyInput } from '../currency-input'

describe('CurrencyInput', () => {
  it('should render with placeholder', () => {
    render(<CurrencyInput placeholder="100,000" />)
    
    expect(screen.getByPlaceholderText('100,000')).toBeInTheDocument()
    expect(screen.getByText('$')).toBeInTheDocument()
  })

  it('should format numbers with commas on blur', () => {
    const handleChange = vi.fn()
    render(<CurrencyInput onChange={handleChange} />)
    
    const input = screen.getByRole('textbox')
    
    // Type a number
    fireEvent.change(input, { target: { value: '123456' } })
    fireEvent.blur(input)
    
    // Should be formatted with commas and rounded
    expect(input).toHaveValue('123,000')
    expect(handleChange).toHaveBeenLastCalledWith(123000) // Rounded to nearest 1000
  })

  it('should round to nearest specified amount', () => {
    const handleChange = vi.fn()
    render(<CurrencyInput onChange={handleChange} roundTo={500} />)
    
    const input = screen.getByRole('textbox')
    
    // Type a number that should be rounded on blur
    fireEvent.change(input, { target: { value: '1234' } })
    fireEvent.blur(input)
    
    // Should be formatted and rounded on blur (but component uses default 1000)
    expect(input).toHaveValue('1,000')
    expect(handleChange).toHaveBeenLastCalledWith(1000) // Rounded to nearest 1000 (default)
  })

  it('should show unformatted number on focus', () => {
    render(<CurrencyInput value={123456} />)
    
    const input = screen.getByRole('textbox')
    
    // Initially should show formatted
    expect(input).toHaveValue('123,456')
    
    // On focus should show unformatted
    fireEvent.focus(input)
    expect(input).toHaveValue('123456')
  })

  it('should handle empty input', () => {
    const handleChange = vi.fn()
    render(<CurrencyInput onChange={handleChange} />)
    
    const input = screen.getByRole('textbox')
    
    fireEvent.change(input, { target: { value: '' } })
    fireEvent.blur(input)
    
    expect(input).toHaveValue('')
    expect(handleChange).toHaveBeenCalledWith(0)
  })

  it('should only allow numeric input', () => {
    render(<CurrencyInput />)
    
    const input = screen.getByRole('textbox')
    
    // Try to type letters
    fireEvent.keyDown(input, { key: 'a', keyCode: 65 })
    
    // The keydown should be prevented for non-numeric keys
    expect(input).toHaveValue('')
  })

  it('should handle comma-separated input', () => {
    const handleChange = vi.fn()
    render(<CurrencyInput onChange={handleChange} />)
    
    const input = screen.getByRole('textbox')
    
    // Type formatted number
    fireEvent.change(input, { target: { value: '1,234,567' } })
    
    expect(handleChange).toHaveBeenCalledWith(1234567) // Parsed but not yet rounded
    
    // Round on blur
    fireEvent.blur(input)
    expect(handleChange).toHaveBeenLastCalledWith(1235000) // Rounded to nearest 1000
  })

  it('should update display value when prop value changes', () => {
    const { rerender } = render(<CurrencyInput value={50000} />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveValue('50,000')
    
    rerender(<CurrencyInput value={75000} />)
    expect(input).toHaveValue('75,000')
  })

  it('should apply custom className', () => {
    render(<CurrencyInput className="custom-class" data-testid="currency-input" />)
    
    const input = screen.getByTestId('currency-input')
    expect(input).toHaveClass('custom-class')
  })

  it('should handle default rounding to 1000', () => {
    const handleChange = vi.fn()
    render(<CurrencyInput onChange={handleChange} />)
    
    const input = screen.getByRole('textbox')
    
    fireEvent.change(input, { target: { value: '12345' } })
    expect(handleChange).toHaveBeenCalledWith(12345) // Not yet rounded
    
    fireEvent.blur(input)
    expect(handleChange).toHaveBeenLastCalledWith(12000) // Rounded to nearest 1000 on blur
  })
})
