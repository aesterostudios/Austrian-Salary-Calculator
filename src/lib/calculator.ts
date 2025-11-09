export type EmploymentType = "employee" | "apprentice" | "pensioner";
export type IncomePeriod = "monthly" | "yearly";
export type FamilyBonusOption = "none" | "shared" | "full";
export type CalculationMode = "gross-to-net" | "net-to-gross";

export interface CalculatorInput {
  employmentType: EmploymentType;
  incomePeriod: IncomePeriod;
  income: number;
  calculationMode?: CalculationMode;
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

/**
 * Calculates Verkehrsabsetzbetrag + Erhöhter Verkehrsabsetzbetrag + Zuschlag
 * for employees and apprentices (2026 values, indexed)
 */
function calculateVerkehrsabsetzbetrag(
  employmentType: EmploymentType,
  taxableIncomeAnnual: number,
): number {
  if (employmentType === "pensioner") {
    return 0;
  }

  // Base Verkehrsabsetzbetrag: €496
  let credit = 496;

  // Erhöhter Verkehrsabsetzbetrag: €853 if income ≤ €15,069, phases down to €496 by €16,056
  if (taxableIncomeAnnual <= 15069) {
    credit = 853;
  } else if (taxableIncomeAnnual < 16056) {
    // Linear phase-out from 853 to 496 between €15,069 and €16,056
    const phaseOutRange = 16056 - 15069;
    const excessIncome = taxableIncomeAnnual - 15069;
    const reductionAmount = (853 - 496) * (excessIncome / phaseOutRange);
    credit = 853 - reductionAmount;
  }

  // Zuschlag zum Verkehrsabsetzbetrag: €804, phases out from €19,761 to €30,259
  let zuschlag = 0;
  if (taxableIncomeAnnual <= 19761) {
    zuschlag = 804;
  } else if (taxableIncomeAnnual < 30259) {
    // Linear phase-out from 804 to 0 between €19,761 and €30,259
    const phaseOutRange = 30259 - 19761;
    const excessIncome = taxableIncomeAnnual - 19761;
    zuschlag = 804 * (1 - excessIncome / phaseOutRange);
  }

  return credit + zuschlag;
}

/**
 * Calculates Pensionistenabsetzbetrag for pensioners (2026 values, indexed)
 */
function calculatePensionistenabsetzbetrag(
  taxableIncomeAnnual: number,
): number {
  // Erhöhter Pensionistenabsetzbetrag: €1,502 (phases out between €24,616 and €31,494)
  if (taxableIncomeAnnual <= 24616) {
    return 1502;
  } else if (taxableIncomeAnnual < 31494) {
    // Linear phase-out from 1502 to 1020 between €24,616 and €31,494
    const phaseOutRange = 31494 - 24616;
    const excessIncome = taxableIncomeAnnual - 24616;
    const reductionAmount = (1502 - 1020) * (excessIncome / phaseOutRange);
    return 1502 - reductionAmount;
  }

  // Normal Pensionistenabsetzbetrag: €1,020 (phases out between €21,614 and €31,494)
  if (taxableIncomeAnnual <= 21614) {
    return 1020;
  } else if (taxableIncomeAnnual < 31494) {
    // Linear phase-out from 1020 to 0 between €21,614 and €31,494
    const phaseOutRange = 31494 - 21614;
    const excessIncome = taxableIncomeAnnual - 21614;
    return 1020 * (1 - excessIncome / phaseOutRange);
  }

  return 0;
}

/**
 * Calculates SV-Rückerstattung (negative tax) cap for 2026
 * This is the maximum refund amount for low-income earners
 */
function calculateNegativeTaxCap(
  employmentType: EmploymentType,
  hasCommuterAllowance: boolean,
): number {
  if (employmentType === "pensioner") {
    return 723;
  }

  // Employees and apprentices
  if (hasCommuterAllowance) {
    return 750;
  }

  return 496;
}

function calculateSingleEarnerCredit(
  isSingleEarner: boolean,
  children: number,
): number {
  if (!isSingleEarner || children <= 0) {
    return 0;
  }

  // 2026 Alleinverdiener-/Alleinerzieherabsetzbetrag (indexed)
  if (children === 1) {
    return 601;
  }

  if (children === 2) {
    return 813;
  }

  return 1081 + (children - 3) * 268;
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
  // 2026 Family Bonus Plus: €2,000/year under 18, €700/year over 18
  const childBonusUnder18 = (2000 / 12) * childrenUnder18;
  const childBonusOver18 = (700 / 12) * childrenOver18;

  return (childBonusUnder18 + childBonusOver18) * factor * 12;
}

function progressiveIncomeTax(annualTaxable: number): number {
  if (annualTaxable <= 0) {
    return 0;
  }

  // 2026 tax brackets (indexed by +1.733% per BGBl II 191/2025)
  const brackets = [
    { limit: 13539, rate: 0 },
    { limit: 21992, rate: 0.2 },
    { limit: 36458, rate: 0.3 },
    { limit: 70365, rate: 0.4 },
    { limit: 104859, rate: 0.48 },
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

  // Top rate 55% for income over €1,000,000 (extended through 2029)
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

  // Calculate employment-type specific credits (2026 values)
  const employmentCredit = employmentType === "pensioner"
    ? calculatePensionistenabsetzbetrag(taxableIncomeAnnual)
    : calculateVerkehrsabsetzbetrag(employmentType, taxableIncomeAnnual);

  const creditsAnnual =
    calculateSingleEarnerCredit(isSingleEarner, totalChildren) +
    employmentCredit;

  const familyBonusAnnual = calculateFamilyBonus(
    familyBonus,
    sanitizedChildrenUnder18,
    sanitizedChildrenOver18,
  );

  // Calculate tax after credits (can be negative = SV-Rückerstattung)
  let incomeTaxRegularAnnual = baseTaxAnnual - creditsAnnual - familyBonusAnnual;

  // Apply negative tax cap (SV-Rückerstattung) for low-income earners
  // Only applies if there is actual taxable income (no refund for zero income)
  if (incomeTaxRegularAnnual < 0 && taxableIncomeAnnual > 0) {
    const negativeTaxCap = calculateNegativeTaxCap(
      employmentType,
      receivesCommuterAllowance,
    );
    // Refund is capped (negative tax means refund)
    incomeTaxRegularAnnual = Math.max(-negativeTaxCap, incomeTaxRegularAnnual);
  } else if (taxableIncomeAnnual === 0) {
    // No income means no tax and no refund
    incomeTaxRegularAnnual = 0;
  }

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

/**
 * Reverse calculator: finds the gross salary needed to achieve a target net salary
 * Uses binary search algorithm for efficiency
 */
export function calculateGrossFromNet(input: CalculatorInput): CalculationResult {
  const targetNet = input.income;
  const isMonthly = input.incomePeriod === "monthly";

  // Convert target to annual net if needed
  const targetNetAnnual = isMonthly ? targetNet * REGULAR_PAYMENTS_PER_YEAR : targetNet;

  // Binary search bounds (gross is always higher than net)
  let minGross = targetNetAnnual; // Lower bound
  let maxGross = targetNetAnnual * 3; // Upper bound (gross can be up to ~2x net, 3x is safe)

  const tolerance = 0.5; // Tolerance of €0.50
  const maxIterations = 50;
  let iterations = 0;

  let bestResult: CalculationResult | null = null;
  let bestDifference = Number.POSITIVE_INFINITY;

  while (iterations < maxIterations && (maxGross - minGross) > tolerance) {
    const midGross = (minGross + maxGross) / 2;

    // Create input for forward calculation
    const testInput: CalculatorInput = {
      ...input,
      income: isMonthly ? midGross / PAYMENTS_PER_YEAR : midGross,
      incomePeriod: isMonthly ? "monthly" : "yearly",
    };

    const result = calculateNetSalary(testInput);
    const resultNetAnnual = result.netAnnual;
    const difference = Math.abs(resultNetAnnual - targetNetAnnual);

    // Track best result
    if (difference < bestDifference) {
      bestDifference = difference;
      bestResult = result;
    }

    // Adjust search bounds
    if (resultNetAnnual < targetNetAnnual) {
      minGross = midGross;
    } else {
      maxGross = midGross;
    }

    iterations++;

    // If we're within tolerance, we're done
    if (difference < tolerance) {
      break;
    }
  }

  return bestResult || calculateNetSalary({
    ...input,
    income: isMonthly ? targetNetAnnual / PAYMENTS_PER_YEAR : targetNetAnnual,
  });
}
