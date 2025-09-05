import { describe, it, expect } from 'vitest'
import { 
  calculateEntityLimits,
  calculateSoleProprietorLimits,
  calculateSCorpLimits,
  calculateCCorpLimits,
  getEntityIncomeRequirements
} from '../entities'
import { FilingEntity } from '../../types'

describe('Entity Calculations', () => {
  describe('calculateSoleProprietorLimits', () => {
    it('should calculate limits for sole proprietor with moderate income', () => {
      const result = calculateSoleProprietorLimits(100000, 35)

      expect(result.compensationForContributions).toBe(100000)
      expect(result.maxEmployeeDeferral).toBeLessThanOrEqual(23000)
      expect(result.maxEmployerContribution).toBeGreaterThan(0)
      expect(result.maxEmployerContribution).toBeLessThan(result.compensationForContributions * 0.25)
      expect(result.notes.length).toBeGreaterThan(0)
      expect(result.notes.some(note => note.includes('sole proprietor'))).toBe(true)
    })

    it('should handle catch-up for age 50+', () => {
      const result = calculateSoleProprietorLimits(100000, 55)

      expect(result.maxEmployeeDeferral).toBeLessThanOrEqual(30500) // 23k + 7.5k
      expect(result.totalMaxContribution).toBeGreaterThan(23000)
    })

    it('should warn about very low net profit', () => {
      const result = calculateSoleProprietorLimits(500, 35)

      expect(result.warnings.some(warning => warning.includes('Very low net profit'))).toBe(true)
    })

    it('should warn about income exceeding compensation limit', () => {
      const result = calculateSoleProprietorLimits(400000, 35)

      expect(result.warnings.some(warning => warning.includes('exceeds IRS compensation limit'))).toBe(true)
    })
  })

  describe('calculateSCorpLimits', () => {
    it('should calculate limits for S-Corp with reasonable W-2 wages', () => {
      const result = calculateSCorpLimits(80000, 50000, 40)

      expect(result.compensationForContributions).toBe(80000)
      expect(result.maxEmployeeDeferral).toBeLessThanOrEqual(23000)
      expect(result.maxEmployerContribution).toBe(80000 * 0.25) // 25% of W-2 wages
      expect(result.notes.some(note => note.includes('S-Corp'))).toBe(true)
    })

    it('should warn about low W-2 wages relative to business profit', () => {
      const result = calculateSCorpLimits(30000, 100000, 40)

      expect(result.warnings.some(warning => warning.includes('W-2 wages'))).toBe(true)
      expect(result.warnings.some(warning => warning.includes('reasonable compensation'))).toBe(true)
    })

    it('should handle high business profits appropriately', () => {
      const result = calculateSCorpLimits(40000, 200000, 40)

      expect(result.warnings.some(warning => warning.includes('increasing W-2 wages'))).toBe(true)
    })
  })

  describe('calculateCCorpLimits', () => {
    it('should calculate limits for C-Corp', () => {
      const result = calculateCCorpLimits(90000, 30000, 45)

      expect(result.compensationForContributions).toBe(90000)
      expect(result.maxEmployeeDeferral).toBeLessThanOrEqual(23000)
      expect(result.maxEmployerContribution).toBe(90000 * 0.25)
      expect(result.notes.some(note => note.includes('C-Corp'))).toBe(true)
      expect(result.notes.some(note => note.includes('double taxation'))).toBe(true)
    })

    it('should handle business profits in notes', () => {
      const result = calculateCCorpLimits(80000, 40000, 35)

      expect(result.notes.some(note => note.includes('after corporate income tax'))).toBe(true)
    })
  })

  describe('calculateEntityLimits', () => {
    it('should dispatch to correct calculator for sole prop', () => {
      const input = {
        entityType: FilingEntity.SOLE_PROP,
        age: 35,
        netProfit: 100000
      }

      const result = calculateEntityLimits(input)

      expect(result).toBeDefined()
      expect(result.notes.some(note => note.includes('sole proprietor'))).toBe(true)
    })

    it('should dispatch to correct calculator for S-Corp', () => {
      const input = {
        entityType: FilingEntity.S_CORP,
        age: 40,
        w2Wages: 80000,
        businessProfit: 50000
      }

      const result = calculateEntityLimits(input)

      expect(result).toBeDefined()
      expect(result.notes.some(note => note.includes('S-Corp'))).toBe(true)
    })

    it('should throw error for missing required inputs', () => {
      const input = {
        entityType: FilingEntity.SOLE_PROP,
        age: 35
        // Missing netProfit
      }

      expect(() => calculateEntityLimits(input)).toThrow('Net profit is required')
    })
  })

  describe('getEntityIncomeRequirements', () => {
    it('should return correct requirements for sole prop', () => {
      const requirements = getEntityIncomeRequirements(FilingEntity.SOLE_PROP)

      expect(requirements.required).toContain('netProfit')
      expect(requirements.optional).toEqual([])
      expect(requirements.descriptions.netProfit).toContain('Schedule C')
    })

    it('should return correct requirements for S-Corp', () => {
      const requirements = getEntityIncomeRequirements(FilingEntity.S_CORP)

      expect(requirements.required).toContain('w2Wages')
      expect(requirements.optional).toContain('businessProfit')
      expect(requirements.descriptions.w2Wages).toContain('owner-employee')
    })

    it('should return correct requirements for C-Corp', () => {
      const requirements = getEntityIncomeRequirements(FilingEntity.C_CORP)

      expect(requirements.required).toContain('w2Wages')
      expect(requirements.optional).toContain('businessProfit')
      expect(requirements.descriptions.businessProfit).toContain('corporate taxes')
    })
  })
})
