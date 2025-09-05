/**
 * State-specific retirement contribution rules and adjustments
 * Currently placeholder for future state-specific rules
 */

import type { StateCode } from '../types';

export interface StateRules {
  code: StateCode;
  name: string;
  
  // Placeholder for future state-specific limits or adjustments
  additionalLimits?: {
    maxContribution?: number;
    specialRules?: string[];
  };
  
  // State tax considerations (informational only)
  taxInfo?: {
    hasStateTax: boolean;
    deductsPretaxContributions: boolean;
    taxesRothContributions: boolean;
    notes?: string[];
  };
}

/**
 * State-specific rules database
 * TODO: Add state-specific contribution limits if any states implement them
 */
export const STATE_RULES: Record<StateCode, StateRules> = {
  'AL': { code: 'AL', name: 'Alabama', taxInfo: { hasStateTax: true, deductsPretaxContributions: true, taxesRothContributions: false } },
  'AK': { code: 'AK', name: 'Alaska', taxInfo: { hasStateTax: false, deductsPretaxContributions: false, taxesRothContributions: false } },
  'AZ': { code: 'AZ', name: 'Arizona', taxInfo: { hasStateTax: true, deductsPretaxContributions: true, taxesRothContributions: false } },
  'AR': { code: 'AR', name: 'Arkansas', taxInfo: { hasStateTax: true, deductsPretaxContributions: true, taxesRothContributions: false } },
  'CA': { code: 'CA', name: 'California', taxInfo: { hasStateTax: true, deductsPretaxContributions: true, taxesRothContributions: false } },
  'CO': { code: 'CO', name: 'Colorado', taxInfo: { hasStateTax: true, deductsPretaxContributions: true, taxesRothContributions: false } },
  'CT': { code: 'CT', name: 'Connecticut', taxInfo: { hasStateTax: true, deductsPretaxContributions: true, taxesRothContributions: false } },
  'DE': { code: 'DE', name: 'Delaware', taxInfo: { hasStateTax: true, deductsPretaxContributions: true, taxesRothContributions: false } },
  'FL': { code: 'FL', name: 'Florida', taxInfo: { hasStateTax: false, deductsPretaxContributions: false, taxesRothContributions: false } },
  'GA': { code: 'GA', name: 'Georgia', taxInfo: { hasStateTax: true, deductsPretaxContributions: true, taxesRothContributions: false } },
  'HI': { code: 'HI', name: 'Hawaii', taxInfo: { hasStateTax: true, deductsPretaxContributions: true, taxesRothContributions: false } },
  'ID': { code: 'ID', name: 'Idaho', taxInfo: { hasStateTax: true, deductsPretaxContributions: true, taxesRothContributions: false } },
  'IL': { code: 'IL', name: 'Illinois', taxInfo: { hasStateTax: true, deductsPretaxContributions: true, taxesRothContributions: false } },
  'IN': { code: 'IN', name: 'Indiana', taxInfo: { hasStateTax: true, deductsPretaxContributions: true, taxesRothContributions: false } },
  'IA': { code: 'IA', name: 'Iowa', taxInfo: { hasStateTax: true, deductsPretaxContributions: true, taxesRothContributions: false } },
  'KS': { code: 'KS', name: 'Kansas', taxInfo: { hasStateTax: true, deductsPretaxContributions: true, taxesRothContributions: false } },
  'KY': { code: 'KY', name: 'Kentucky', taxInfo: { hasStateTax: true, deductsPretaxContributions: true, taxesRothContributions: false } },
  'LA': { code: 'LA', name: 'Louisiana', taxInfo: { hasStateTax: true, deductsPretaxContributions: true, taxesRothContributions: false } },
  'ME': { code: 'ME', name: 'Maine', taxInfo: { hasStateTax: true, deductsPretaxContributions: true, taxesRothContributions: false } },
  'MD': { code: 'MD', name: 'Maryland', taxInfo: { hasStateTax: true, deductsPretaxContributions: true, taxesRothContributions: false } },
  'MA': { code: 'MA', name: 'Massachusetts', taxInfo: { hasStateTax: true, deductsPretaxContributions: true, taxesRothContributions: false } },
  'MI': { code: 'MI', name: 'Michigan', taxInfo: { hasStateTax: true, deductsPretaxContributions: true, taxesRothContributions: false } },
  'MN': { code: 'MN', name: 'Minnesota', taxInfo: { hasStateTax: true, deductsPretaxContributions: true, taxesRothContributions: false } },
  'MS': { code: 'MS', name: 'Mississippi', taxInfo: { hasStateTax: true, deductsPretaxContributions: true, taxesRothContributions: false } },
  'MO': { code: 'MO', name: 'Missouri', taxInfo: { hasStateTax: true, deductsPretaxContributions: true, taxesRothContributions: false } },
  'MT': { code: 'MT', name: 'Montana', taxInfo: { hasStateTax: true, deductsPretaxContributions: true, taxesRothContributions: false } },
  'NE': { code: 'NE', name: 'Nebraska', taxInfo: { hasStateTax: true, deductsPretaxContributions: true, taxesRothContributions: false } },
  'NV': { code: 'NV', name: 'Nevada', taxInfo: { hasStateTax: false, deductsPretaxContributions: false, taxesRothContributions: false } },
  'NH': { code: 'NH', name: 'New Hampshire', taxInfo: { hasStateTax: false, deductsPretaxContributions: false, taxesRothContributions: false } },
  'NJ': { code: 'NJ', name: 'New Jersey', taxInfo: { hasStateTax: true, deductsPretaxContributions: true, taxesRothContributions: false } },
  'NM': { code: 'NM', name: 'New Mexico', taxInfo: { hasStateTax: true, deductsPretaxContributions: true, taxesRothContributions: false } },
  'NY': { code: 'NY', name: 'New York', taxInfo: { hasStateTax: true, deductsPretaxContributions: true, taxesRothContributions: false } },
  'NC': { code: 'NC', name: 'North Carolina', taxInfo: { hasStateTax: true, deductsPretaxContributions: true, taxesRothContributions: false } },
  'ND': { code: 'ND', name: 'North Dakota', taxInfo: { hasStateTax: true, deductsPretaxContributions: true, taxesRothContributions: false } },
  'OH': { code: 'OH', name: 'Ohio', taxInfo: { hasStateTax: true, deductsPretaxContributions: true, taxesRothContributions: false } },
  'OK': { code: 'OK', name: 'Oklahoma', taxInfo: { hasStateTax: true, deductsPretaxContributions: true, taxesRothContributions: false } },
  'OR': { code: 'OR', name: 'Oregon', taxInfo: { hasStateTax: true, deductsPretaxContributions: true, taxesRothContributions: false } },
  'PA': { code: 'PA', name: 'Pennsylvania', taxInfo: { hasStateTax: true, deductsPretaxContributions: true, taxesRothContributions: false } },
  'RI': { code: 'RI', name: 'Rhode Island', taxInfo: { hasStateTax: true, deductsPretaxContributions: true, taxesRothContributions: false } },
  'SC': { code: 'SC', name: 'South Carolina', taxInfo: { hasStateTax: true, deductsPretaxContributions: true, taxesRothContributions: false } },
  'SD': { code: 'SD', name: 'South Dakota', taxInfo: { hasStateTax: false, deductsPretaxContributions: false, taxesRothContributions: false } },
  'TN': { code: 'TN', name: 'Tennessee', taxInfo: { hasStateTax: false, deductsPretaxContributions: false, taxesRothContributions: false } },
  'TX': { code: 'TX', name: 'Texas', taxInfo: { hasStateTax: false, deductsPretaxContributions: false, taxesRothContributions: false } },
  'UT': { code: 'UT', name: 'Utah', taxInfo: { hasStateTax: true, deductsPretaxContributions: true, taxesRothContributions: false } },
  'VT': { code: 'VT', name: 'Vermont', taxInfo: { hasStateTax: true, deductsPretaxContributions: true, taxesRothContributions: false } },
  'VA': { code: 'VA', name: 'Virginia', taxInfo: { hasStateTax: true, deductsPretaxContributions: true, taxesRothContributions: false } },
  'WA': { code: 'WA', name: 'Washington', taxInfo: { hasStateTax: false, deductsPretaxContributions: false, taxesRothContributions: false } },
  'WV': { code: 'WV', name: 'West Virginia', taxInfo: { hasStateTax: true, deductsPretaxContributions: true, taxesRothContributions: false } },
  'WI': { code: 'WI', name: 'Wisconsin', taxInfo: { hasStateTax: true, deductsPretaxContributions: true, taxesRothContributions: false } },
  'WY': { code: 'WY', name: 'Wyoming', taxInfo: { hasStateTax: false, deductsPretaxContributions: false, taxesRothContributions: false } },
  'DC': { code: 'DC', name: 'District of Columbia', taxInfo: { hasStateTax: true, deductsPretaxContributions: true, taxesRothContributions: false } }
};

/**
 * Get state-specific rules for a given state code
 */
export function getStateRules(stateCode: StateCode): StateRules {
  return STATE_RULES[stateCode];
}

/**
 * Check if a state has any special contribution limits
 * Currently returns false for all states as no state-specific limits exist
 */
export function hasStateSpecificLimits(stateCode: StateCode): boolean {
  const rules = getStateRules(stateCode);
  return !!(rules.additionalLimits?.maxContribution || rules.additionalLimits?.specialRules?.length);
}

/**
 * Get state tax information for retirement planning context
 */
export function getStateTaxInfo(stateCode: StateCode) {
  const rules = getStateRules(stateCode);
  return rules.taxInfo;
}
