import { describe, it, expect } from 'vitest'
import {
  getCurrentIRSLimits,
  getSoleProprietorEmployerRate,
  getMaxEmployerContribution,
  isCatchUpEligible,
  getMaxElectiveDeferral,
  getOverallLimit415c,
  IRS_LIMITS_2024
} from '../irsLimits'

describe('IRS Limits', () => {
  describe('getCurrentIRSLimits', () => {
    it('should return 2024 limits', () => {
      const limits = getCurrentIRSLimits()

      expect(limits.electiveDeferralLimit).toBe(23000)
      expect(limits.catchUpLimit).toBe(7500)
      expect(limits.overallLimit415c).toBe(69000)
      expect(limits.overallLimit415cWithCatchUp).toBe(76500)
      expect(limits.compensationLimit).toBe(345000)
    })
  })

  describe('getSoleProprietorEmployerRate', () => {
    it('should return effective rate for sole proprietor', () => {
      const rate = getSoleProprietorEmployerRate(100000)

      expect(rate).toBe(0.2) // 20% effective rate
      expect(rate).toBeLessThan(0.25) // Less than corporate rate due to SE tax
    })

    it('should handle high income levels', () => {
      const rate = getSoleProprietorEmployerRate(500000)

      expect(rate).toBe(0.2) // Should still be 20%
    })
  })

  describe('getMaxEmployerContribution', () => {
    it('should calculate max employer contribution for sole prop', () => {
      const maxContribution = getMaxEmployerContribution('sole_prop', 100000, 100000)

      expect(maxContribution).toBeGreaterThan(0)
      expect(maxContribution).toBeLessThan(100000 * 0.25) // Less than 25% due to SE tax
      expect(maxContribution).toBeCloseTo(18587, 10) // Actual calculated value
    })

    it('should calculate max employer contribution for S-Corp', () => {
      const maxContribution = getMaxEmployerContribution('s_corp', 80000)

      expect(maxContribution).toBe(80000 * 0.25) // Exactly 25% for corporations
    })

    it('should calculate max employer contribution for C-Corp', () => {
      const maxContribution = getMaxEmployerContribution('c_corp', 90000)

      expect(maxContribution).toBe(90000 * 0.25) // Exactly 25% for corporations
    })

    it('should respect compensation limits', () => {
      const highIncome = 400000 // Above compensation limit
      const maxContribution = getMaxEmployerContribution('s_corp', highIncome)

      expect(maxContribution).toBeLessThanOrEqual(IRS_LIMITS_2024.compensationLimit * 0.25)
    })

    it('should return 0 for sole prop without net earnings', () => {
      const maxContribution = getMaxEmployerContribution('sole_prop', 100000) // No netEarnings param

      expect(maxContribution).toBe(0)
    })
  })

  describe('isCatchUpEligible', () => {
    it('should return false for age under 50', () => {
      expect(isCatchUpEligible(35)).toBe(false)
      expect(isCatchUpEligible(49)).toBe(false)
    })

    it('should return true for age 50 and above', () => {
      expect(isCatchUpEligible(50)).toBe(true)
      expect(isCatchUpEligible(55)).toBe(true)
      expect(isCatchUpEligible(65)).toBe(true)
    })
  })

  describe('getMaxElectiveDeferral', () => {
    it('should return base limit for under 50', () => {
      const maxDeferral = getMaxElectiveDeferral(35)

      expect(maxDeferral).toBe(23000)
    })

    it('should include catch-up for age 50+', () => {
      const maxDeferral = getMaxElectiveDeferral(55)

      expect(maxDeferral).toBe(23000 + 7500) // Base + catch-up
    })
  })

  describe('getOverallLimit415c', () => {
    it('should return base 415(c) limit for under 50', () => {
      const limit = getOverallLimit415c(35)

      expect(limit).toBe(69000)
    })

    it('should return enhanced limit for age 50+', () => {
      const limit = getOverallLimit415c(55)

      expect(limit).toBe(76500) // Base + catch-up room
    })
  })

  describe('IRS_LIMITS_2024 constants', () => {
    it('should have all required limit values', () => {
      expect(IRS_LIMITS_2024.electiveDeferralLimit).toBeGreaterThan(0)
      expect(IRS_LIMITS_2024.catchUpLimit).toBeGreaterThan(0)
      expect(IRS_LIMITS_2024.overallLimit415c).toBeGreaterThan(IRS_LIMITS_2024.electiveDeferralLimit)
      expect(IRS_LIMITS_2024.overallLimit415cWithCatchUp).toBeGreaterThan(IRS_LIMITS_2024.overallLimit415c)
      expect(IRS_LIMITS_2024.compensationLimit).toBeGreaterThan(IRS_LIMITS_2024.overallLimit415c)
    })

    it('should have reasonable tax rates', () => {
      expect(IRS_LIMITS_2024.sepRate).toBe(0.25)
      expect(IRS_LIMITS_2024.solo401kEmployerRate).toBe(0.25)
      expect(IRS_LIMITS_2024.soleProprietorEffectiveRate).toBe(0.2)
      expect(IRS_LIMITS_2024.selfEmploymentTaxRate).toBeGreaterThan(0.1)
      expect(IRS_LIMITS_2024.selfEmploymentTaxDeduction).toBe(0.5)
    })
  })
})
