/**
 * Entity-specific calculation helpers for retirement contributions
 */

import type { FilingEntityType } from '../types';
import { getCurrentIRSLimits, getMaxEmployerContribution } from './irsLimits';

export interface EntityCalculationInput {
  entityType: FilingEntityType;
  age: number;
  
  // Income inputs (conditional based on entity)
  netProfit?: number; // For sole proprietors
  w2Wages?: number; // For S-Corp/C-Corp
  businessProfit?: number; // Additional business profit for S-Corp/C-Corp
}

export interface EntityCalculationResult {
  compensationForContributions: number;
  maxEmployeeDeferral: number;
  maxEmployerContribution: number;
  totalMaxContribution: number;
  
  // Entity-specific notes
  notes: string[];
  warnings: string[];
}

/**
 * Calculate contribution limits for sole proprietors (Schedule C)
 */
export function calculateSoleProprietorLimits(
  netProfit: number,
  age: number
): EntityCalculationResult {
  const limits = getCurrentIRSLimits();
  const notes: string[] = [];
  const warnings: string[] = [];
  
  // For sole proprietors, compensation is net profit from Schedule C
  const compensation = Math.min(netProfit, limits.compensationLimit);
  
  // Employee deferral is limited by the lesser of compensation or IRS limit
  const maxEmployeeDeferral = Math.min(
    compensation,
    limits.electiveDeferralLimit + (age >= 50 ? limits.catchUpLimit : 0)
  );
  
  // Employer contribution calculation for sole proprietors
  const maxEmployerContribution = getMaxEmployerContribution('sole_prop', compensation, netProfit);
  
  // Total is limited by 415(c) limit
  const overallLimit = age >= 50 ? limits.overallLimit415cWithCatchUp : limits.overallLimit415c;
  const totalMaxContribution = Math.min(
    maxEmployeeDeferral + maxEmployerContribution,
    overallLimit,
    compensation // Can't contribute more than compensation
  );
  
  // Add explanatory notes
  notes.push('As a sole proprietor, your contributions are based on net profit from Schedule C');
  notes.push('Employer contributions are approximately 20% of net earnings after self-employment tax deduction');
  
  if (netProfit > limits.compensationLimit) {
    warnings.push(`Income exceeds IRS compensation limit of $${limits.compensationLimit.toLocaleString()}`);
  }
  
  if (netProfit < 1000) {
    warnings.push('Very low net profit may limit contribution opportunities');
  }
  
  return {
    compensationForContributions: compensation,
    maxEmployeeDeferral,
    maxEmployerContribution,
    totalMaxContribution,
    notes,
    warnings
  };
}

/**
 * Calculate contribution limits for S-Corporation owners
 */
export function calculateSCorpLimits(
  w2Wages: number,
  businessProfit: number = 0,
  age: number
): EntityCalculationResult {
  const limits = getCurrentIRSLimits();
  const notes: string[] = [];
  const warnings: string[] = [];
  
  // For S-Corp, only W-2 wages count as compensation for contribution purposes
  const compensation = Math.min(w2Wages, limits.compensationLimit);
  
  // Employee deferral is based on W-2 wages only
  const maxEmployeeDeferral = Math.min(
    compensation,
    limits.electiveDeferralLimit + (age >= 50 ? limits.catchUpLimit : 0)
  );
  
  // Employer contribution is 25% of W-2 wages
  const maxEmployerContribution = getMaxEmployerContribution('s_corp', compensation);
  
  // Total is limited by 415(c) limit
  const overallLimit = age >= 50 ? limits.overallLimit415cWithCatchUp : limits.overallLimit415c;
  const totalMaxContribution = Math.min(
    maxEmployeeDeferral + maxEmployerContribution,
    overallLimit,
    compensation
  );
  
  // Add explanatory notes
  notes.push('As an S-Corp owner, contributions are based only on W-2 wages, not business profits');
  notes.push('Employer contributions are 25% of W-2 wages');
  notes.push('Business profits (K-1 income) do not count as compensation for contribution purposes');
  
  if (businessProfit > w2Wages * 2) {
    warnings.push('Consider increasing W-2 wages to maximize contribution opportunities');
    warnings.push('IRS requires "reasonable compensation" for S-Corp owner-employees');
  }
  
  if (w2Wages < 30000 && businessProfit > 50000) {
    warnings.push('W-2 wages may be too low relative to business profits - consult a CPA');
  }
  
  return {
    compensationForContributions: compensation,
    maxEmployeeDeferral,
    maxEmployerContribution,
    totalMaxContribution,
    notes,
    warnings
  };
}

/**
 * Calculate contribution limits for C-Corporation owners
 */
export function calculateCCorpLimits(
  w2Wages: number,
  businessProfit: number = 0,
  age: number
): EntityCalculationResult {
  const limits = getCurrentIRSLimits();
  const notes: string[] = [];
  const warnings: string[] = [];
  
  // For C-Corp, W-2 wages are the compensation base
  const compensation = Math.min(w2Wages, limits.compensationLimit);
  
  // Employee deferral calculation
  const maxEmployeeDeferral = Math.min(
    compensation,
    limits.electiveDeferralLimit + (age >= 50 ? limits.catchUpLimit : 0)
  );
  
  // Employer contribution is 25% of W-2 wages
  const maxEmployerContribution = getMaxEmployerContribution('c_corp', compensation);
  
  // Total is limited by 415(c) limit
  const overallLimit = age >= 50 ? limits.overallLimit415cWithCatchUp : limits.overallLimit415c;
  const totalMaxContribution = Math.min(
    maxEmployeeDeferral + maxEmployerContribution,
    overallLimit,
    compensation
  );
  
  // Add explanatory notes
  notes.push('As a C-Corp owner-employee, contributions are based on W-2 wages');
  notes.push('Employer contributions are 25% of W-2 wages');
  notes.push('C-Corp profits are subject to double taxation but provide flexibility');
  
  if (businessProfit > 0) {
    notes.push('Business profits shown are after corporate income tax');
  }
  
  return {
    compensationForContributions: compensation,
    maxEmployeeDeferral,
    maxEmployerContribution,
    totalMaxContribution,
    notes,
    warnings
  };
}

/**
 * Main entity calculation dispatcher
 */
export function calculateEntityLimits(input: EntityCalculationInput): EntityCalculationResult {
  const { entityType, age, netProfit = 0, w2Wages = 0, businessProfit = 0 } = input;
  
  switch (entityType) {
    case 'sole_prop':
      if (!netProfit) {
        throw new Error('Net profit is required for sole proprietor calculations');
      }
      return calculateSoleProprietorLimits(netProfit, age);
      
    case 's_corp':
      if (!w2Wages) {
        throw new Error('W-2 wages are required for S-Corp calculations');
      }
      return calculateSCorpLimits(w2Wages, businessProfit, age);
      
    case 'c_corp':
      if (!w2Wages) {
        throw new Error('W-2 wages are required for C-Corp calculations');
      }
      return calculateCCorpLimits(w2Wages, businessProfit, age);
      
    default:
      throw new Error(`Unsupported entity type: ${entityType}`);
  }
}

/**
 * Get entity-specific income requirements and descriptions
 */
export function getEntityIncomeRequirements(entityType: FilingEntityType) {
  switch (entityType) {
    case 'sole_prop':
      return {
        required: ['netProfit'],
        optional: [],
        descriptions: {
          netProfit: 'Net profit from Schedule C (after business expenses)'
        }
      };
      
    case 's_corp':
      return {
        required: ['w2Wages'],
        optional: ['businessProfit'],
        descriptions: {
          w2Wages: 'W-2 wages paid to owner-employee',
          businessProfit: 'Additional business profit (K-1 income) - optional for context'
        }
      };
      
    case 'c_corp':
      return {
        required: ['w2Wages'],
        optional: ['businessProfit'],
        descriptions: {
          w2Wages: 'W-2 wages paid to owner-employee',
          businessProfit: 'Business profit after corporate taxes - optional for context'
        }
      };
      
    default:
      return { required: [], optional: [], descriptions: {} };
  }
}
