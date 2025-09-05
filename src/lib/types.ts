import { z } from 'zod';

// Filing entity types
export const FilingEntity = {
  SOLE_PROP: 'sole_prop',
  S_CORP: 's_corp', 
  C_CORP: 'c_corp'
} as const;

export type FilingEntityType = typeof FilingEntity[keyof typeof FilingEntity];

// Contribution type preferences
export const ContributionType = {
  PRE_TAX: 'pre_tax',
  ROTH: 'roth',
  MIX: 'mix'
} as const;

export type ContributionTypeType = typeof ContributionType[keyof typeof ContributionType];

// US States
export const US_STATES = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
  { value: 'DC', label: 'District of Columbia' }
] as const;

export type StateCode = typeof US_STATES[number]['value'];

// Input schemas
export const calculatorInputSchema = z.object({
  filingEntity: z.enum([FilingEntity.SOLE_PROP, FilingEntity.S_CORP, FilingEntity.C_CORP]),
  state: z.string().min(2).max(2),
  age: z.number().min(18).max(100),
  
  // Income inputs - conditional based on filing entity
  netProfit: z.number().min(0).optional(), // For sole prop
  w2Wages: z.number().min(0).optional(), // For S-Corp/C-Corp
  businessProfit: z.number().min(0).optional(), // Additional profit for S-Corp/C-Corp
  
  // Preferences
  contributionType: z.enum([ContributionType.PRE_TAX, ContributionType.ROTH, ContributionType.MIX]),
  rothPercentage: z.number().min(0).max(100).default(50), // Only used if contributionType is MIX
  
  // Advanced options
  enableCatchUp: z.boolean().default(false),
  assumeSelfEmploymentTax: z.boolean().default(true),
  marginalTaxRate: z.number().min(0).max(0.5).default(0.22) // 22% default marginal rate
});

export type CalculatorInput = z.infer<typeof calculatorInputSchema>;

// Output types
export interface ContributionBreakdown {
  employeeDeferral: number;
  employerContribution: number;
  total: number;
  catchUpAmount: number;
  
  // Breakdown by type
  preTaxAmount: number;
  rothAmount: number;
}

export interface TaxSavingsEstimate {
  marginalRate: number;
  estimatedSavings: number;
  effectiveContributionCost: number;
}

export interface CalculationResult {
  input: CalculatorInput;
  contributions: ContributionBreakdown;
  taxSavings: TaxSavingsEstimate;
  
  // Limits and constraints
  limits: {
    electiveDeferralLimit: number;
    catchUpLimit: number;
    overallLimit415c: number;
    compensationLimit: number;
  };
  
  // Flags for when limits are hit
  flags: {
    hitElectiveDeferralLimit: boolean;
    hitCatchUpLimit: boolean;
    hit415cLimit: boolean;
    hitCompensationLimit: boolean;
  };
  
  // Explanatory notes
  notes: string[];
  warnings: string[];
}

// Error types
export class CalculationError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'CalculationError';
  }
}

// Validation helper
export function validateCalculatorInput(input: unknown): CalculatorInput {
  return calculatorInputSchema.parse(input);
}
