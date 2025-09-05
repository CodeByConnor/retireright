import { describe, it, expect } from 'vitest'
import { calculateContributions, getQuickEstimate } from '../engine'
import { FilingEntity, ContributionType } from '../../types'

describe('Retirement Calculation Engine', () => {
  describe('calculateContributions', () => {
    it('should calculate contributions for sole proprietor', () => {
      const input = {
        filingEntity: FilingEntity.SOLE_PROP,
        state: 'CA',
        age: 35,
        netProfit: 100000,
        contributionType: ContributionType.PRE_TAX,
        rothPercentage: 50,
        enableCatchUp: false,
        assumeSelfEmploymentTax: true,
        marginalTaxRate: 0.22
      }

      const result = calculateContributions(input)

      expect(result).toBeDefined()
      expect(result.contributions.total).toBeGreaterThan(0)
      expect(result.contributions.employeeDeferral).toBeLessThanOrEqual(23000)
      expect(result.contributions.preTaxAmount).toBeGreaterThan(0)
      expect(result.contributions.rothAmount).toBe(0) // Pre-tax only
      expect(result.taxSavings.estimatedSavings).toBeGreaterThan(0)
    })

    it('should calculate contributions for S-Corp', () => {
      const input = {
        filingEntity: FilingEntity.S_CORP,
        state: 'TX',
        age: 45,
        w2Wages: 80000,
        businessProfit: 50000,
        contributionType: ContributionType.ROTH,
        rothPercentage: 50,
        enableCatchUp: false,
        assumeSelfEmploymentTax: false,
        marginalTaxRate: 0.24
      }

      const result = calculateContributions(input)

      expect(result).toBeDefined()
      expect(result.contributions.total).toBeGreaterThan(0)
      expect(result.contributions.employeeDeferral).toBeLessThanOrEqual(23000)
      expect(result.contributions.preTaxAmount).toBeGreaterThan(0) // Employer contribution is always pre-tax
      expect(result.contributions.rothAmount).toBeGreaterThan(0) // Employee Roth
      expect(result.taxSavings.estimatedSavings).toBeGreaterThan(0) // From employer contribution
    })

    it('should handle catch-up contributions for age 50+', () => {
      const input = {
        filingEntity: FilingEntity.SOLE_PROP,
        state: 'NY',
        age: 55,
        netProfit: 150000,
        contributionType: ContributionType.PRE_TAX,
        rothPercentage: 50,
        enableCatchUp: true,
        assumeSelfEmploymentTax: true,
        marginalTaxRate: 0.32
      }

      const result = calculateContributions(input)

      expect(result).toBeDefined()
      expect(result.contributions.catchUpAmount).toBeGreaterThan(0)
      expect(result.contributions.employeeDeferral).toBeLessThanOrEqual(30500) // 23k + 7.5k catch-up
      expect(result.limits.catchUpLimit).toBe(7500)
    })

    it('should handle mixed contribution types', () => {
      const input = {
        filingEntity: FilingEntity.S_CORP,
        state: 'FL',
        age: 40,
        w2Wages: 120000,
        contributionType: ContributionType.MIX,
        rothPercentage: 60, // 60% Roth, 40% pre-tax
        enableCatchUp: false,
        assumeSelfEmploymentTax: false,
        marginalTaxRate: 0.22
      }

      const result = calculateContributions(input)

      expect(result).toBeDefined()
      expect(result.contributions.rothAmount).toBeGreaterThan(0)
      expect(result.contributions.preTaxAmount).toBeGreaterThan(result.contributions.rothAmount) // Includes employer
      
      // Check that the split is approximately correct (allowing for rounding)
      const employeeRoth = result.contributions.rothAmount
      const employeePreTax = result.contributions.preTaxAmount - result.contributions.employerContribution
      const totalEmployee = employeeRoth + employeePreTax
      
      if (totalEmployee > 0) {
        const actualRothPercentage = (employeeRoth / totalEmployee) * 100
        expect(actualRothPercentage).toBeCloseTo(60, 1)
      }
    })

    it('should enforce contribution limits', () => {
      const input = {
        filingEntity: FilingEntity.SOLE_PROP,
        state: 'CA',
        age: 30,
        netProfit: 500000, // Very high income
        contributionType: ContributionType.PRE_TAX,
        rothPercentage: 50,
        enableCatchUp: false,
        assumeSelfEmploymentTax: true,
        marginalTaxRate: 0.37
      }

      const result = calculateContributions(input)

      expect(result).toBeDefined()
      expect(result.contributions.total).toBeLessThanOrEqual(69000) // 415(c) limit
      expect(result.contributions.employeeDeferral).toBeLessThanOrEqual(23000) // Employee limit
    })

    it('should validate required inputs', () => {
      const invalidInput = {
        filingEntity: FilingEntity.SOLE_PROP,
        state: 'CA',
        age: 35,
        // Missing netProfit for sole prop
        contributionType: ContributionType.PRE_TAX,
        rothPercentage: 50,
        enableCatchUp: false,
        assumeSelfEmploymentTax: true,
        marginalTaxRate: 0.22
      }

      expect(() => calculateContributions(invalidInput)).toThrow()
    })

    it('should generate appropriate notes and warnings', () => {
      const input = {
        filingEntity: FilingEntity.S_CORP,
        state: 'WA', // No state tax
        age: 35,
        w2Wages: 30000, // Low W-2 wages
        businessProfit: 100000, // High business profit
        contributionType: ContributionType.PRE_TAX,
        rothPercentage: 50,
        enableCatchUp: false,
        assumeSelfEmploymentTax: false,
        marginalTaxRate: 0.22
      }

      const result = calculateContributions(input)

      expect(result.notes.length).toBeGreaterThan(0)
      expect(result.warnings.length).toBeGreaterThan(0)
      expect(result.notes.some(note => note.includes('Washington'))).toBe(true)
      expect(result.warnings.some(warning => warning.includes('W-2 wages'))).toBe(true)
    })
  })

  describe('getQuickEstimate', () => {
    it('should provide quick estimate for sole proprietor', () => {
      const input = {
        filingEntity: FilingEntity.SOLE_PROP,
        age: 35,
        netProfit: 100000
      }

      const estimate = getQuickEstimate(input)

      expect(estimate).toBeDefined()
      expect(estimate!.estimatedEmployee).toBeGreaterThan(0)
      expect(estimate!.estimatedEmployer).toBeGreaterThan(0)
      expect(estimate!.estimatedTotal).toBeGreaterThan(0)
    })

    it('should handle age 50+ catch-up in quick estimate', () => {
      const input = {
        filingEntity: FilingEntity.S_CORP,
        age: 55,
        w2Wages: 80000
      }

      const estimate = getQuickEstimate(input)

      expect(estimate).toBeDefined()
      expect(estimate!.estimatedEmployee).toBeLessThanOrEqual(30500) // Includes catch-up
    })

    it('should return null for incomplete input', () => {
      const input = {
        age: 35
        // Missing filingEntity
      }

      const estimate = getQuickEstimate(input)
      expect(estimate).toBeNull()
    })
  })
})
