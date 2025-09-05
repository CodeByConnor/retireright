/**
 * Main calculation engine for retirement contribution optimization
 */

import type { 
  CalculatorInput, 
  CalculationResult, 
  ContributionBreakdown, 
  TaxSavingsEstimate 
} from '../types';
import { validateCalculatorInput, CalculationError } from '../types';
import { getCurrentIRSLimits, getOverallLimit415c } from './irsLimits';
import { calculateEntityLimits } from './entities';
import { getStateRules } from './states';

/**
 * Calculate optimal retirement contributions based on input parameters
 */
export function calculateContributions(input: unknown): CalculationResult {
  // Validate input
  const validatedInput = validateCalculatorInput(input);
  
  try {
    return performCalculation(validatedInput);
  } catch (error) {
    if (error instanceof CalculationError) {
      throw error;
    }
    throw new CalculationError(
      `Calculation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'CALCULATION_ERROR'
    );
  }
}

/**
 * Internal calculation logic
 */
function performCalculation(input: CalculatorInput): CalculationResult {
  const limits = getCurrentIRSLimits();
  const stateRules = getStateRules(input.state as any);
  
  // Calculate entity-specific limits
  const entityResult = calculateEntityLimits({
    entityType: input.filingEntity,
    age: input.age,
    netProfit: input.netProfit,
    w2Wages: input.w2Wages,
    businessProfit: input.businessProfit
  });
  
  // Determine actual contribution amounts based on preferences
  const contributions = calculateContributionBreakdown(input, entityResult);
  
  // Calculate tax savings estimate
  const taxSavings = calculateTaxSavings(contributions, input.marginalTaxRate);
  
  // Determine which limits were hit
  const flags = calculateLimitFlags(contributions, entityResult, input.age);
  
  // Compile notes and warnings
  const notes = [...entityResult.notes];
  const warnings = [...entityResult.warnings];
  
  // Add state-specific notes if applicable
  if (stateRules.taxInfo?.hasStateTax) {
    notes.push(`${stateRules.name} has state income tax - pre-tax contributions may provide additional state tax savings`);
  } else {
    notes.push(`${stateRules.name} has no state income tax - focus on federal tax optimization`);
  }
  
  // Add general disclaimers
  notes.push('These are planning estimates only - consult with a CPA for personalized advice');
  notes.push('Contribution limits and tax rules may change - verify current limits before contributing');
  
  return {
    input,
    contributions,
    taxSavings,
    limits: {
      electiveDeferralLimit: limits.electiveDeferralLimit + (input.age >= 50 ? limits.catchUpLimit : 0),
      catchUpLimit: limits.catchUpLimit,
      overallLimit415c: getOverallLimit415c(input.age),
      compensationLimit: entityResult.compensationForContributions
    },
    flags,
    notes,
    warnings
  };
}

/**
 * Calculate the breakdown of contributions based on user preferences
 */
function calculateContributionBreakdown(
  input: CalculatorInput, 
  entityResult: any
): ContributionBreakdown {
  const maxEmployee = entityResult.maxEmployeeDeferral;
  const maxEmployer = entityResult.maxEmployerContribution;
  const overallLimit = getOverallLimit415c(input.age);
  
  // Employee contribution (subject to compensation and deferral limits)
  const employeeDeferral = Math.min(
    maxEmployee,
    entityResult.compensationForContributions,
    overallLimit
  );
  
  // Employer contribution (remaining room up to limits)
  const remainingRoom = Math.min(
    overallLimit - employeeDeferral,
    maxEmployer,
    entityResult.compensationForContributions - employeeDeferral
  );
  const employerContribution = Math.max(0, remainingRoom);
  
  const total = employeeDeferral + employerContribution;
  
  // Calculate catch-up amount if applicable
  const limits = getCurrentIRSLimits();
  const catchUpAmount = input.age >= 50 ? 
    Math.min(limits.catchUpLimit, employeeDeferral - limits.electiveDeferralLimit) : 0;
  
  // Break down by contribution type based on preferences
  let preTaxAmount = 0;
  let rothAmount = 0;
  
  switch (input.contributionType) {
    case 'pre_tax':
      preTaxAmount = employeeDeferral;
      rothAmount = 0;
      break;
      
    case 'roth':
      preTaxAmount = 0;
      rothAmount = employeeDeferral;
      break;
      
    case 'mix':
      const rothPercentage = input.rothPercentage / 100;
      rothAmount = Math.round(employeeDeferral * rothPercentage);
      preTaxAmount = employeeDeferral - rothAmount;
      break;
  }
  
  // Note: Employer contributions are always pre-tax
  preTaxAmount += employerContribution;
  
  return {
    employeeDeferral,
    employerContribution,
    total,
    catchUpAmount,
    preTaxAmount,
    rothAmount
  };
}

/**
 * Calculate estimated tax savings
 */
function calculateTaxSavings(
  contributions: ContributionBreakdown, 
  marginalRate: number
): TaxSavingsEstimate {
  // Tax savings only apply to pre-tax contributions
  const taxableReduction = contributions.preTaxAmount;
  const estimatedSavings = taxableReduction * marginalRate;
  const effectiveContributionCost = contributions.total - estimatedSavings;
  
  return {
    marginalRate,
    estimatedSavings,
    effectiveContributionCost
  };
}

/**
 * Determine which contribution limits were reached
 */
function calculateLimitFlags(
  contributions: ContributionBreakdown,
  entityResult: any,
  age: number
) {
  const limits = getCurrentIRSLimits();
  const overallLimit = getOverallLimit415c(age);
  
  return {
    hitElectiveDeferralLimit: contributions.employeeDeferral >= entityResult.maxEmployeeDeferral,
    hitCatchUpLimit: age >= 50 && contributions.catchUpAmount >= limits.catchUpLimit,
    hit415cLimit: contributions.total >= overallLimit,
    hitCompensationLimit: contributions.total >= entityResult.compensationForContributions
  };
}

/**
 * Validate that required income fields are provided based on entity type
 */
function validateEntityInputs(input: CalculatorInput): void {
  switch (input.filingEntity) {
    case 'sole_prop':
      if (!input.netProfit || input.netProfit < 0) {
        throw new CalculationError(
          'Net profit is required and must be positive for sole proprietors',
          'MISSING_NET_PROFIT'
        );
      }
      break;
      
    case 's_corp':
    case 'c_corp':
      if (!input.w2Wages || input.w2Wages < 0) {
        throw new CalculationError(
          'W-2 wages are required and must be positive for S-Corp and C-Corp',
          'MISSING_W2_WAGES'
        );
      }
      break;
  }
}

/**
 * Get quick contribution estimate without full calculation
 * Useful for preview/summary displays
 */
export function getQuickEstimate(input: Partial<CalculatorInput>) {
  if (!input.filingEntity || !input.age) {
    return null;
  }
  
  const limits = getCurrentIRSLimits();
  const maxDeferral = limits.electiveDeferralLimit + (input.age >= 50 ? limits.catchUpLimit : 0);
  
  // Rough employer contribution estimate
  let estimatedEmployer = 0;
  const income = input.netProfit || input.w2Wages || 0;
  
  if (income > 0) {
    switch (input.filingEntity) {
      case 'sole_prop':
        estimatedEmployer = income * 0.2; // Rough 20% estimate
        break;
      case 's_corp':
      case 'c_corp':
        estimatedEmployer = income * 0.25; // 25% of wages
        break;
    }
  }
  
  const estimatedTotal = Math.min(
    maxDeferral + estimatedEmployer,
    getOverallLimit415c(input.age),
    income
  );
  
  return {
    estimatedEmployee: Math.min(maxDeferral, income),
    estimatedEmployer: Math.min(estimatedEmployer, income - maxDeferral),
    estimatedTotal
  };
}
