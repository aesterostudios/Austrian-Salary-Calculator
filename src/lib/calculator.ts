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
  socialInsuranceSpecial: number;
  allowancesMonthly: number;
  allowancesAnnual: number;
  taxableIncomeMonthly: number;
  taxableIncomeAnnual: number;
  incomeTaxMonthly: number;
  incomeTaxAnnual: number;
  incomeTaxSpecial13th: number;
  incomeTaxSpecial14th: number;
  creditsAnnual: number;
  creditsMonthly: number;
  familyBonusAnnual: number;
  familyBonusMonthly: number;
  netMonthly: number;
  netAnnual: number;
  netRegularMonthly: number;
  netRegularAnnual: number;
  netSpecial13th: number;
  netSpecial14th: number;
  commuterAllowanceMonthly: number;
}

const PAYMENTS_PER_YEAR = 14;
const REGULAR_PAYMENTS_PER_YEAR = 12;
const SPECIAL_PAYMENTS_PER_YEAR = PAYMENTS_PER_YEAR - REGULAR_PAYMENTS_PER_YEAR;
const TAX_FREE_SPECIAL_ALLOWANCE = 620;

const SOCIAL_INSURANCE_RATES: Record<EmploymentType, number> = {
  employee: 0.1807,
  apprentice: 0.155,
  pensioner: 0.051,
};

const SOCIAL_INSURANCE_SPECIAL_RATES: Partial<Record<EmploymentType, number>> = {
  employee: 0.1707,
  apprentice: 0.1445,
};

const SPECIAL_PAYMENT_SURCHARGE_BRACKETS = [
  { cap: 25000, rate: 0.275 },
  { cap: 25000, rate: 0.3575 },
  { cap: Number.POSITIVE_INFINITY, rate: 0.5 },
] as const;

const EMPLOYEE_BONUS_MAX = 400;
const EMPLOYEE_BONUS_THRESHOLD = 2000;
const EMPLOYEE_BONUS_SLOPE = 0.27512866700977856;

function calculateEmployeeBonus(
  employmentType: EmploymentType,
  taxableIncomeMonthly: number,
): number {
  if (employmentType === "pensioner") {
    return 0;
  }

  if (taxableIncomeMonthly <= EMPLOYEE_BONUS_THRESHOLD) {
    return EMPLOYEE_BONUS_MAX;
  }

  const reduction =
    (taxableIncomeMonthly - EMPLOYEE_BONUS_THRESHOLD) * EMPLOYEE_BONUS_SLOPE;

  return Math.max(0, EMPLOYEE_BONUS_MAX - reduction);
}

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
    incomePeriod === "monthly" ? sanitizedIncome : sanitizedIncome / PAYMENTS_PER_YEAR;

  const specialPaymentGross = grossMonthly;

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

  const socialInsuranceSpecialRate =
    SOCIAL_INSURANCE_SPECIAL_RATES[employmentType] ?? socialInsuranceRate;
  const socialInsuranceSpecial = specialPaymentGross * socialInsuranceSpecialRate;

  const taxableIncomeMonthly = Math.max(
    0,
    taxableGrossMonthly - socialInsuranceMonthly - allowancesMonthly,
  );

  const taxableIncomeAnnual =
    taxableIncomeMonthly * REGULAR_PAYMENTS_PER_YEAR;

  const baseTaxAnnual = progressiveIncomeTax(taxableIncomeAnnual);

  const sanitizedChildrenUnder18 = hasChildren
    ? Math.max(childrenUnder18, 0)
    : 0;
  const sanitizedChildrenOver18 = hasChildren
    ? Math.max(childrenOver18, 0)
    : 0;
  const totalChildren = sanitizedChildrenUnder18 + sanitizedChildrenOver18;

  const baseCredit = employmentType === "pensioner" ? 764 : 476;
  const employeeBonusAnnual = calculateEmployeeBonus(
    employmentType,
    taxableIncomeMonthly,
  );

  const creditsAnnual =
    calculateSingleEarnerCredit(isSingleEarner, totalChildren) +
    baseCredit +
    employeeBonusAnnual;

  const familyBonusAnnual = calculateFamilyBonus(
    familyBonus,
    sanitizedChildrenUnder18,
    sanitizedChildrenOver18,
  );

  const incomeTaxRegularAnnual = Math.max(
    0,
    baseTaxAnnual - creditsAnnual - familyBonusAnnual,
  );

  const incomeTaxRegularMonthly =
    incomeTaxRegularAnnual / REGULAR_PAYMENTS_PER_YEAR;

  const specialTaxBasePerPayment = Math.max(
    0,
    specialPaymentGross - socialInsuranceSpecial,
  );

  const specialTaxBaseAnnual =
    specialTaxBasePerPayment * SPECIAL_PAYMENTS_PER_YEAR;

  const sixthLimit = Math.max(0, taxableIncomeAnnual / 6);

  const taxFreeSpecialAllowance = Math.min(
    TAX_FREE_SPECIAL_ALLOWANCE,
    specialTaxBaseAnnual,
  );

  const amountTaxedAtSixPercent = Math.min(
    Math.max(0, specialTaxBaseAnnual - taxFreeSpecialAllowance),
    sixthLimit,
  );

  const surchargeCaps = SPECIAL_PAYMENT_SURCHARGE_BRACKETS.map(
    ({ cap }) => cap,
  );

  const specialTaxes: number[] = [];
  let remainingTaxFreePortion = taxFreeSpecialAllowance;
  let remainingSixPercentPortion = amountTaxedAtSixPercent;

  for (let paymentIndex = 0; paymentIndex < SPECIAL_PAYMENTS_PER_YEAR; paymentIndex += 1) {
    let taxableBase = specialTaxBasePerPayment;

    const taxFreeApplied = Math.min(taxableBase, remainingTaxFreePortion);
    taxableBase -= taxFreeApplied;
    remainingTaxFreePortion = Math.max(0, remainingTaxFreePortion - taxFreeApplied);

    const sixPercentApplied = Math.min(taxableBase, remainingSixPercentPortion);
    taxableBase -= sixPercentApplied;
    remainingSixPercentPortion = Math.max(
      0,
      remainingSixPercentPortion - sixPercentApplied,
    );

    let tax = sixPercentApplied * 0.06;

    let aboveSixthPortion = taxableBase;

    for (let bracketIndex = 0; bracketIndex < SPECIAL_PAYMENT_SURCHARGE_BRACKETS.length && aboveSixthPortion > 0; bracketIndex += 1) {
      const bracket = SPECIAL_PAYMENT_SURCHARGE_BRACKETS[bracketIndex];
      const remainingCap = surchargeCaps[bracketIndex];

      if (!Number.isFinite(remainingCap)) {
        tax += aboveSixthPortion * bracket.rate;
        aboveSixthPortion = 0;
        break;
      }

      const applied = Math.min(aboveSixthPortion, remainingCap);
      if (applied > 0) {
        tax += applied * bracket.rate;
        aboveSixthPortion -= applied;
        surchargeCaps[bracketIndex] = remainingCap - applied;
      }
    }

    specialTaxes.push(tax);
  }

  const incomeTaxSpecial13th = specialTaxes[0] ?? 0;
  const incomeTaxSpecial14th = specialTaxes[1] ?? 0;
  const incomeTaxSpecialAnnual = incomeTaxSpecial13th + incomeTaxSpecial14th;

  const incomeTaxAnnual = incomeTaxRegularAnnual + incomeTaxSpecialAnnual;
  const incomeTaxMonthly = incomeTaxRegularMonthly;

  const netRegularMonthly = Math.max(
    0,
    grossMonthly - socialInsuranceMonthly - incomeTaxRegularMonthly,
  );

  const netSpecial13th = Math.max(
    0,
    specialPaymentGross - socialInsuranceSpecial - incomeTaxSpecial13th,
  );

  const netSpecial14th = Math.max(
    0,
    specialPaymentGross - socialInsuranceSpecial - incomeTaxSpecial14th,
  );

  const netRegularAnnual = netRegularMonthly * REGULAR_PAYMENTS_PER_YEAR;
  const netAnnual = netRegularAnnual + netSpecial13th + netSpecial14th;
  const netMonthly = netAnnual / REGULAR_PAYMENTS_PER_YEAR;

  const socialInsuranceAnnual =
    socialInsuranceMonthly * REGULAR_PAYMENTS_PER_YEAR +
    socialInsuranceSpecial * SPECIAL_PAYMENTS_PER_YEAR;

  return {
    grossMonthly,
    grossAnnual: grossMonthly * PAYMENTS_PER_YEAR,
    taxableGrossMonthly,
    socialInsuranceMonthly,
    socialInsuranceAnnual,
    socialInsuranceSpecial,
    allowancesMonthly,
    allowancesAnnual: allowancesMonthly * REGULAR_PAYMENTS_PER_YEAR,
    taxableIncomeMonthly,
    taxableIncomeAnnual,
    incomeTaxMonthly,
    incomeTaxAnnual,
    incomeTaxSpecial13th,
    incomeTaxSpecial14th,
    creditsAnnual,
    creditsMonthly: creditsAnnual / REGULAR_PAYMENTS_PER_YEAR,
    familyBonusAnnual,
    familyBonusMonthly: familyBonusAnnual / REGULAR_PAYMENTS_PER_YEAR,
    netMonthly,
    netAnnual,
    netRegularMonthly,
    netRegularAnnual,
    netSpecial13th,
    netSpecial14th,
    commuterAllowanceMonthly: sanitizedCommuterAllowance,
  };
}

export function formatCurrency(
  value: number,
  locale: string = "de-AT",
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(value);
}
