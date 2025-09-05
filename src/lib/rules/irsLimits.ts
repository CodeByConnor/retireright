/**
 * IRS Contribution Limits for 2024
 * TODO: Update these values annually when IRS releases new limits
 * Source: IRS Publication 560, Notice 2023-75
 */

export const IRS_LIMITS_2024 = {
  // Employee elective deferral limits
  electiveDeferralLimit: 23000, // 401(k) employee contribution limit
  catchUpLimit: 7500, // Additional catch-up for age 50+
  
  // Overall contribution limits (IRC Section 415(c))
  overallLimit415c: 69000, // Total employee + employer contributions
  overallLimit415cWithCatchUp: 76500, // With catch-up contributions
  
  // Compensation limits
  compensationLimit: 345000, // Maximum compensation that can be considered
  
  // SEP-IRA limits
  sepRate: 0.25, // 25% of compensation (but effectively 20% of net earnings for sole prop)
  sepMinCompensation: 750, // Minimum compensation to contribute to SEP
  
  // Solo 401(k) employer contribution rates
  solo401kEmployerRate: 0.25, // 25% for S-Corp/C-Corp W-2 wages
  soleProprietorEffectiveRate: 0.2, // Effective ~20% after SE tax deduction
  
  // Self-employment tax rates
  selfEmploymentTaxRate: 0.1413, // 14.13% (combined employer/employee portion)
  selfEmploymentTaxDeduction: 0.5, // 50% of SE tax is deductible
  
  // Social Security wage base
  socialSecurityWageBase: 160200 // 2024 limit
} as const;

/**
 * Get current year IRS limits
 * In the future, this could be expanded to support multiple years
 */
export function getCurrentIRSLimits() {
  return IRS_LIMITS_2024;
}

/**
 * Calculate the effective employer contribution rate for sole proprietors
 * This accounts for the self-employment tax deduction
 */
export function getSoleProprietorEmployerRate(netEarnings: number): number {
  // For sole proprietors, the employer contribution is based on 
  // net earnings after deducting 1/2 of SE tax
  const seTax = Math.min(netEarnings * IRS_LIMITS_2024.selfEmploymentTaxRate, 
                        IRS_LIMITS_2024.socialSecurityWageBase * IRS_LIMITS_2024.selfEmploymentTaxRate);
  const seTaxDeduction = seTax * IRS_LIMITS_2024.selfEmploymentTaxDeduction;
  const adjustedNetEarnings = netEarnings - seTaxDeduction;
  
  // The effective rate is approximately 20% due to the circular calculation
  return IRS_LIMITS_2024.soleProprietorEffectiveRate;
}

/**
 * Calculate maximum employer contribution for different entity types
 */
export function getMaxEmployerContribution(
  entityType: 'sole_prop' | 's_corp' | 'c_corp',
  compensation: number,
  netEarnings?: number
): number {
  const limits = getCurrentIRSLimits();
  
  switch (entityType) {
    case 'sole_prop':
      if (!netEarnings) return 0;
      // For sole proprietors, use effective rate on net earnings after SE tax deduction
      const effectiveRate = getSoleProprietorEmployerRate(netEarnings);
      const seTax = Math.min(netEarnings * limits.selfEmploymentTaxRate, 
                            limits.socialSecurityWageBase * limits.selfEmploymentTaxRate);
      const seTaxDeduction = seTax * limits.selfEmploymentTaxDeduction;
      const adjustedNetEarnings = netEarnings - seTaxDeduction;
      return Math.min(
        adjustedNetEarnings * effectiveRate,
        limits.compensationLimit * effectiveRate
      );
      
    case 's_corp':
    case 'c_corp':
      // For corporations, employer contribution is 25% of W-2 wages
      return Math.min(
        compensation * limits.solo401kEmployerRate,
        limits.compensationLimit * limits.solo401kEmployerRate
      );
      
    default:
      return 0;
  }
}

/**
 * Check if catch-up contributions are allowed based on age
 */
export function isCatchUpEligible(age: number): boolean {
  return age >= 50;
}

/**
 * Get the maximum elective deferral limit including catch-up if applicable
 */
export function getMaxElectiveDeferral(age: number): number {
  const limits = getCurrentIRSLimits();
  const baseLimit = limits.electiveDeferralLimit;
  const catchUpAmount = isCatchUpEligible(age) ? limits.catchUpLimit : 0;
  return baseLimit + catchUpAmount;
}

/**
 * Get the overall 415(c) limit including catch-up if applicable
 */
export function getOverallLimit415c(age: number): number {
  const limits = getCurrentIRSLimits();
  return isCatchUpEligible(age) ? 
    limits.overallLimit415cWithCatchUp : 
    limits.overallLimit415c;
}
