export type EmploymentType = "employee" | "apprentice" | "pensioner";
export type IncomePeriod = "monthly" | "yearly";
export type FamilyBonusOption = "none" | "shared" | "full";

export interface CalculatorInput {
  employmentType: EmploymentType;
  incomePeriod: IncomePeriod;
  income: number;
  hasChildren: boolean;
  childrenUnder18: number;
  childrenOver18: number;
  isSingleEarner: boolean;
  familyBonus: FamilyBonusOption;
  taxableBenefitsMonthly: number;
  companyCarBenefitMonthly: number;
  allowance: number;
  receivesCommuterAllowance: boolean;
  commuterAllowanceMonthly: number;
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

function calculateSingleEarnerCredit(
  isSingleEarner: boolean,
  children: number,
): number {
  if (!isSingleEarner || children <= 0) {
    return 0;
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
  childrenUnder18: number,
  childrenOver18: number,
): number {
  const totalChildren = childrenUnder18 + childrenOver18;

  if (totalChildren <= 0 || option === "none") {
    return 0;
  }

  const factor = option === "full" ? 1 : 0.5;
  const childBonusUnder18 = 166.68 * childrenUnder18;
  const childBonusOver18 = 54.18 * childrenOver18;

  return (childBonusUnder18 + childBonusOver18) * factor * 12;
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
    hasChildren,
    childrenUnder18,
    childrenOver18,
    isSingleEarner,
    familyBonus,
    taxableBenefitsMonthly,
    companyCarBenefitMonthly,
    allowance,
    receivesCommuterAllowance,
    commuterAllowanceMonthly,
  } = input;

  const sanitizedIncome = Math.max(income, 0);
  const grossMonthly =
    incomePeriod === "monthly" ? sanitizedIncome : sanitizedIncome / 12;

  const taxableGrossMonthly =
    grossMonthly +
    Math.max(taxableBenefitsMonthly, 0) +
    Math.max(companyCarBenefitMonthly, 0);

  const sanitizedCommuterAllowance = receivesCommuterAllowance
    ? Math.max(commuterAllowanceMonthly, 0)
    : 0;

  const allowancesMonthly =
    Math.max(allowance, 0) + sanitizedCommuterAllowance;

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

  const sanitizedChildrenUnder18 = hasChildren
    ? Math.max(childrenUnder18, 0)
    : 0;
  const sanitizedChildrenOver18 = hasChildren
    ? Math.max(childrenOver18, 0)
    : 0;
  const totalChildren = sanitizedChildrenUnder18 + sanitizedChildrenOver18;

  const creditsAnnual =
    calculateSingleEarnerCredit(isSingleEarner, totalChildren) +
    (employmentType === "pensioner" ? 764 : 400);

  const familyBonusAnnual = calculateFamilyBonus(
    familyBonus,
    sanitizedChildrenUnder18,
    sanitizedChildrenOver18,
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
    commuterAllowanceMonthly: sanitizedCommuterAllowance,
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("de-AT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(value);
}
