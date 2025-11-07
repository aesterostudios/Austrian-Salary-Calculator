import LZString from 'lz-string';
import type { CalculatorInput, EmploymentType, IncomePeriod, FamilyBonusOption, CalculationMode } from './calculator';

// Ultra-compact encoding with single-letter keys and numeric codes
// Only non-default values are encoded to minimize payload size

const DEFAULTS: CalculatorInput = {
  employmentType: 'employee',
  incomePeriod: 'monthly',
  income: 0,
  calculationMode: 'gross-to-net',
  hasChildren: false,
  childrenUnder18: 0,
  childrenOver18: 0,
  isSingleEarner: false,
  familyBonus: 'none',
  taxableBenefitsMonthly: 0,
  companyCarBenefitMonthly: 0,
  allowance: 0,
  receivesCommuterAllowance: false,
  commuterAllowanceMonthly: 0,
};

// Enum to number mappings for ultra-compact encoding
const EMPLOYMENT_TYPE_MAP: Record<EmploymentType, number> = {
  employee: 0,
  apprentice: 1,
  pensioner: 2,
};

const EMPLOYMENT_TYPE_REVERSE: Record<number, EmploymentType> = {
  0: 'employee',
  1: 'apprentice',
  2: 'pensioner',
};

const PERIOD_MAP: Record<IncomePeriod, number> = {
  monthly: 0,
  yearly: 1,
};

const PERIOD_REVERSE: Record<number, IncomePeriod> = {
  0: 'monthly',
  1: 'yearly',
};

const MODE_MAP: Record<CalculationMode, number> = {
  'gross-to-net': 0,
  'net-to-gross': 1,
};

const MODE_REVERSE: Record<number, CalculationMode> = {
  0: 'gross-to-net',
  1: 'net-to-gross',
};

const BONUS_MAP: Record<FamilyBonusOption, number> = {
  none: 0,
  shared: 1,
  full: 2,
};

const BONUS_REVERSE: Record<number, FamilyBonusOption> = {
  0: 'none',
  1: 'shared',
  2: 'full',
};

/**
 * Converts CalculatorInput to ultra-compact object with only non-default values
 */
function minifyPayload(payload: CalculatorInput): Record<string, number> {
  const compact: Record<string, number> = {};

  // Always include income (required field)
  compact.i = payload.income;

  // Only include non-default values
  if (payload.employmentType !== DEFAULTS.employmentType) {
    compact.e = EMPLOYMENT_TYPE_MAP[payload.employmentType];
  }
  if (payload.incomePeriod !== DEFAULTS.incomePeriod) {
    compact.p = PERIOD_MAP[payload.incomePeriod];
  }
  if (payload.calculationMode && payload.calculationMode !== DEFAULTS.calculationMode) {
    compact.m = MODE_MAP[payload.calculationMode];
  }
  if (payload.childrenUnder18 > 0) {
    compact.c = payload.childrenUnder18;
  }
  if (payload.childrenOver18 > 0) {
    compact.C = payload.childrenOver18;
  }
  if (payload.isSingleEarner) {
    compact.s = 1;
  }
  if (payload.familyBonus !== DEFAULTS.familyBonus) {
    compact.f = BONUS_MAP[payload.familyBonus];
  }
  if (payload.taxableBenefitsMonthly > 0) {
    compact.b = payload.taxableBenefitsMonthly;
  }
  if (payload.companyCarBenefitMonthly > 0) {
    compact.r = payload.companyCarBenefitMonthly;
  }
  if (payload.allowance > 0) {
    compact.a = payload.allowance;
  }
  if (payload.commuterAllowanceMonthly > 0) {
    compact.u = payload.commuterAllowanceMonthly;
  }

  return compact;
}

/**
 * Converts compact object back to full CalculatorInput
 */
function expandPayload(compact: Record<string, number>): CalculatorInput {
  return {
    employmentType: compact.e !== undefined ? EMPLOYMENT_TYPE_REVERSE[compact.e] : DEFAULTS.employmentType,
    incomePeriod: compact.p !== undefined ? PERIOD_REVERSE[compact.p] : DEFAULTS.incomePeriod,
    income: compact.i,
    calculationMode: compact.m !== undefined ? MODE_REVERSE[compact.m] : DEFAULTS.calculationMode,
    hasChildren: (compact.c || 0) + (compact.C || 0) > 0,
    childrenUnder18: compact.c || 0,
    childrenOver18: compact.C || 0,
    isSingleEarner: compact.s === 1,
    familyBonus: compact.f !== undefined ? BONUS_REVERSE[compact.f] : DEFAULTS.familyBonus,
    taxableBenefitsMonthly: compact.b || 0,
    companyCarBenefitMonthly: compact.r || 0,
    allowance: compact.a || 0,
    receivesCommuterAllowance: (compact.u || 0) > 0,
    commuterAllowanceMonthly: compact.u || 0,
  };
}

/**
 * Compresses calculator input data and encodes it for URL usage
 * Uses aggressive minification to create ultra-short URLs
 */
export function encodePayload(payload: CalculatorInput): string {
  try {
    const minified = minifyPayload(payload);
    const json = JSON.stringify(minified);
    const compressed = LZString.compressToEncodedURIComponent(json);
    return compressed;
  } catch (error) {
    console.error('Failed to encode payload:', error);
    // Fallback to basic compression
    return LZString.compressToEncodedURIComponent(JSON.stringify(payload));
  }
}

/**
 * Decodes and decompresses calculator input data from URL
 * Handles: optimized format, legacy LZ compressed, and legacy uncompressed
 */
export function decodePayload(encodedPayload: string | null): CalculatorInput | null {
  if (!encodedPayload) {
    return null;
  }

  try {
    // Try decompressing first (new/legacy compressed formats)
    const decompressed = LZString.decompressFromEncodedURIComponent(encodedPayload);

    if (decompressed) {
      const parsed = JSON.parse(decompressed);

      // Check if it's the new optimized format (has single-letter keys)
      if (parsed.i !== undefined) {
        return expandPayload(parsed);
      }

      // Otherwise it's legacy compressed format (full object)
      return parsed as CalculatorInput;
    }

    // Fallback to legacy uncompressed format
    try {
      return JSON.parse(decodeURIComponent(encodedPayload)) as CalculatorInput;
    } catch {
      return JSON.parse(encodedPayload) as CalculatorInput;
    }
  } catch (error) {
    console.error('Failed to decode payload:', error);
    return null;
  }
}

/**
 * Creates a shareable URL with ultra-compressed payload
 */
export function createShareUrl(payload: CalculatorInput, baseUrl?: string): string {
  const base = baseUrl || window.location.origin;
  const compressed = encodePayload(payload);
  return `${base}/result?payload=${compressed}`;
}
