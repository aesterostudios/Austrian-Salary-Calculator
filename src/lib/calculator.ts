export type EmploymentType = "employee" | "apprentice" | "pensioner";
export type IncomePeriod = "monthly" | "yearly";
export type FamilyBonusOption = "none" | "half" | "full";
export type CommutingFrequency = "none" | "upto10" | "moreThan10";

export interface CalculatorInput {
  employmentType: EmploymentType;
  incomePeriod: IncomePeriod;
  income: number;
  isSingleEarner: boolean;
  familyBonus: FamilyBonusOption;
  children: number;
  hasCompanyCar: boolean;
  companyCarValue: number;
  allowance: number;
  commuterDistance: number;
  publicTransportReasonable: boolean;
  commutingFrequency: CommutingFrequency;
}

export interface CalculationResult {
  grossMonthly: number;
  grossAnnual: number;
  taxableGrossMonthly: number;
  socialInsuranceMonthly: number;
  socialInsuranceAnnual: number;
  allowancesMonthly: number;
  allowancesAnnual: number;
  taxableIncomeMonthly: number;
  taxableIncomeAnnual: number;
  incomeTaxMonthly: number;
  incomeTaxAnnual: number;
  creditsAnnual: number;
  creditsMonthly: number;
  familyBonusAnnual: number;
  familyBonusMonthly: number;
  netMonthly: number;
  netAnnual: number;
  commuterAllowanceMonthly: number;
}

const SOCIAL_INSURANCE_RATES: Record<EmploymentType, number> = {
  employee: 0.1812,
  apprentice: 0.155,
  pensioner: 0.051,
};

interface AllowanceBracket {
  min: number;
  max: number;
  amount: number;
}

const SMALL_COMMUTER_ALLOWANCE: AllowanceBracket[] = [
  { min: 20, max: 40, amount: 58 },
  { min: 40, max: 60, amount: 113 },
  { min: 60, max: Infinity, amount: 168 },
];

const LARGE_COMMUTER_ALLOWANCE: AllowanceBracket[] = [
  { min: 2, max: 20, amount: 31 },
  { min: 20, max: 40, amount: 123 },
  { min: 40, max: 60, amount: 214 },
  { min: 60, max: Infinity, amount: 306 },
];

const COMMUTING_FREQUENCY_FACTORS: Record<CommutingFrequency, number> = {
  none: 0,
  upto10: 0.5,
  moreThan10: 1,
};

function determineCommuterAllowance(
  distance: number,
  publicTransportReasonable: boolean,
  frequency: CommutingFrequency,
): number {
  if (distance <= 0) {
    return 0;
  }

  const table = publicTransportReasonable
    ? SMALL_COMMUTER_ALLOWANCE
    : LARGE_COMMUTER_ALLOWANCE;

  const bracket = table.find(
    (entry) => distance >= entry.min && distance < entry.max,
  );

  if (!bracket) {
    return 0;
  }

  const factor = COMMUTING_FREQUENCY_FACTORS[frequency] ?? 0;
  return bracket.amount * factor;
}

function calculateSingleEarnerCredit(
  isSingleEarner: boolean,
  children: number,
): number {
  if (!isSingleEarner) {
    return 0;
  }

  if (children <= 0) {
    return 364;
  }

  if (children === 1) {
    return 494;
  }

  if (children === 2) {
    return 669;
  }

  return 889 + (children - 3) * 220;
}

function calculateFamilyBonus(
  option: FamilyBonusOption,
  children: number,
): number {
  if (children <= 0 || option === "none") {
    return 0;
  }

  const basePerChild = 166.68; // € per child and month
  const factor = option === "full" ? 1 : 0.5;
  return basePerChild * children * factor * 12;
}

function progressiveIncomeTax(annualTaxable: number): number {
  if (annualTaxable <= 0) {
    return 0;
  }

  const brackets = [
    { limit: 12816, rate: 0 },
    { limit: 20818, rate: 0.2 },
    { limit: 34513, rate: 0.3 },
    { limit: 66612, rate: 0.41 },
    { limit: 99266, rate: 0.48 },
    { limit: 1000000, rate: 0.5 },
  ];

  let remaining = annualTaxable;
  let previousLimit = 0;
  let tax = 0;

  for (const bracket of brackets) {
    const taxablePortion = Math.min(remaining, bracket.limit - previousLimit);
    if (taxablePortion > 0) {
      tax += taxablePortion * bracket.rate;
      remaining -= taxablePortion;
    }

    previousLimit = bracket.limit;
  }

  if (remaining > 0) {
    tax += remaining * 0.55;
  }

  return tax;
}

export function calculateNetSalary(input: CalculatorInput): CalculationResult {
  const {
    employmentType,
    income,
    incomePeriod,
    isSingleEarner,
    familyBonus,
    children,
    hasCompanyCar,
    companyCarValue,
    allowance,
    commuterDistance,
    publicTransportReasonable,
    commutingFrequency,
  } = input;

  const sanitizedIncome = Math.max(income, 0);
  const grossMonthly =
    incomePeriod === "monthly" ? sanitizedIncome : sanitizedIncome / 12;

  const taxableGrossMonthly =
    grossMonthly + (hasCompanyCar ? Math.max(companyCarValue, 0) : 0);

  const commuterAllowanceMonthly = determineCommuterAllowance(
    commuterDistance,
    publicTransportReasonable,
    commutingFrequency,
  );

  const allowancesMonthly = Math.max(allowance, 0) + commuterAllowanceMonthly;

  const socialInsuranceRate =
    SOCIAL_INSURANCE_RATES[employmentType] ?? SOCIAL_INSURANCE_RATES.employee;
  const socialInsuranceMonthly = taxableGrossMonthly * socialInsuranceRate;
  const socialInsuranceAnnual = socialInsuranceMonthly * 12;

  const taxableIncomeMonthly = Math.max(
    0,
    taxableGrossMonthly - socialInsuranceMonthly - allowancesMonthly,
  );

  const taxableIncomeAnnual = taxableIncomeMonthly * 12;

  const baseTaxAnnual = progressiveIncomeTax(taxableIncomeAnnual);

  const sanitizedChildren = Math.max(children, 0);

  const creditsAnnual =
    calculateSingleEarnerCredit(isSingleEarner, sanitizedChildren) +
    (employmentType === "pensioner" ? 764 : 400);

  const familyBonusAnnual = calculateFamilyBonus(
    familyBonus,
    sanitizedChildren,
  );

  const incomeTaxAnnual = Math.max(
    0,
    baseTaxAnnual - creditsAnnual - familyBonusAnnual,
  );

  const incomeTaxMonthly = incomeTaxAnnual / 12;

  const netMonthly = Math.max(
    0,
    grossMonthly - socialInsuranceMonthly - incomeTaxMonthly,
  );

  const netAnnual = netMonthly * 12;

  return {
    grossMonthly,
    grossAnnual: grossMonthly * 12,
    taxableGrossMonthly,
    socialInsuranceMonthly,
    socialInsuranceAnnual,
    allowancesMonthly,
    allowancesAnnual: allowancesMonthly * 12,
    taxableIncomeMonthly,
    taxableIncomeAnnual,
    incomeTaxMonthly,
    incomeTaxAnnual,
    creditsAnnual,
    creditsMonthly: creditsAnnual / 12,
    familyBonusAnnual,
    familyBonusMonthly: familyBonusAnnual / 12,
    netMonthly,
    netAnnual,
    commuterAllowanceMonthly,
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("de-AT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(value);
}
