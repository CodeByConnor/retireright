import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Accordion, AccordionItem } from '../accordion'

describe('Accordion Components', () => {
  describe('AccordionItem', () => {
    it('should render with title and children', () => {
      render(
        <AccordionItem title="Test Title">
          <p>Test content</p>
        </AccordionItem>
      )

      expect(screen.getByText('Test Title')).toBeInTheDocument()
      expect(screen.queryByText('Test content')).not.toBeInTheDocument() // Closed by default
    })

    it('should open when defaultOpen is true', () => {
      render(
        <AccordionItem title="Test Title" defaultOpen>
          <p>Test content</p>
        </AccordionItem>
      )

      expect(screen.getByText('Test Title')).toBeInTheDocument()
      expect(screen.getByText('Test content')).toBeInTheDocument() // Should be visible
    })

    it('should toggle open/closed when clicked', () => {
      render(
        <AccordionItem title="Test Title">
          <p>Test content</p>
        </AccordionItem>
      )

      const button = screen.getByRole('button')
      
      // Initially closed
      expect(screen.queryByText('Test content')).not.toBeInTheDocument()

      // Click to open
      fireEvent.click(button)
      expect(screen.getByText('Test content')).toBeInTheDocument()

      // Click to close
      fireEvent.click(button)
      expect(screen.queryByText('Test content')).not.toBeInTheDocument()
    })

    it('should apply custom className', () => {
      const { container } = render(
        <AccordionItem title="Test Title" className="custom-class">
          <p>Test content</p>
        </AccordionItem>
      )

      expect(container.firstChild).toHaveClass('custom-class')
    })

    it('should have proper button attributes', () => {
      render(
        <AccordionItem title="Test Title">
          <p>Test content</p>
        </AccordionItem>
      )

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('type', 'button')
      expect(button).toHaveTextContent('Test Title')
    })

    it('should rotate chevron icon when opened', () => {
      render(
        <AccordionItem title="Test Title">
          <p>Test content</p>
        </AccordionItem>
      )

      const button = screen.getByRole('button')
      const chevron = button.querySelector('svg')

      // Initially not rotated
      expect(chevron).not.toHaveClass('rotate-180')

      // Click to open
      fireEvent.click(button)
      expect(chevron).toHaveClass('rotate-180')

      // Click to close
      fireEvent.click(button)
      expect(chevron).not.toHaveClass('rotate-180')
    })
  })

  describe('Accordion', () => {
    it('should render children', () => {
      render(
        <Accordion>
          <AccordionItem title="Item 1">Content 1</AccordionItem>
          <AccordionItem title="Item 2">Content 2</AccordionItem>
        </Accordion>
      )

      expect(screen.getByText('Item 1')).toBeInTheDocument()
      expect(screen.getByText('Item 2')).toBeInTheDocument()
    })

    it('should apply custom className', () => {
      const { container } = render(
        <Accordion className="custom-accordion">
          <AccordionItem title="Item 1">Content 1</AccordionItem>
        </Accordion>
      )

      expect(container.firstChild).toHaveClass('custom-accordion')
      expect(container.firstChild).toHaveClass('space-y-2') // Default class
    })

    it('should allow multiple items to be open simultaneously', () => {
      render(
        <Accordion>
          <AccordionItem title="Item 1" defaultOpen>Content 1</AccordionItem>
          <AccordionItem title="Item 2" defaultOpen>Content 2</AccordionItem>
        </Accordion>
      )

      expect(screen.getByText('Content 1')).toBeInTheDocument()
      expect(screen.getByText('Content 2')).toBeInTheDocument()
    })
  })
})
