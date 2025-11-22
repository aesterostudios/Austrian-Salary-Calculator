import { describe, it, expect } from 'vitest';
import { calculateNetSalary, calculateGrossFromNet, formatCurrency, type CalculatorInput } from './calculator';

describe('Calculator', () => {
  describe('calculateNetSalary', () => {
    it('should calculate net salary for a basic employee with €3000 monthly gross', () => {
      const input: CalculatorInput = {
        employmentType: 'employee',
        incomePeriod: 'monthly',
        income: 3000,
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

      const result = calculateNetSalary(input);

      // Basic sanity checks
      expect(result.grossMonthly).toBe(3000);
      expect(result.grossAnnual).toBe(42000); // 14 payments
      expect(result.netMonthly).toBeGreaterThan(0);
      expect(result.netMonthly).toBeLessThan(3000);
      expect(result.socialInsuranceMonthly).toBeGreaterThan(0);
      expect(result.incomeTaxMonthly).toBeGreaterThan(0);
    });

    it('should apply family bonus plus correctly for 2 children under 18', () => {
      const input: CalculatorInput = {
        employmentType: 'employee',
        incomePeriod: 'monthly',
        income: 3000,
        calculationMode: 'gross-to-net',
        hasChildren: true,
        childrenUnder18: 2,
        childrenOver18: 0,
        isSingleEarner: false,
        familyBonus: 'full',
        taxableBenefitsMonthly: 0,
        companyCarBenefitMonthly: 0,
        allowance: 0,
        receivesCommuterAllowance: false,
        commuterAllowanceMonthly: 0,
      };

      const result = calculateNetSalary(input);

      // Family bonus should be €166.68/month * 2 children * 12 months = €4,000.32
      expect(result.familyBonusAnnual).toBeCloseTo(4000.32, 0);
      expect(result.familyBonusMonthly).toBeCloseTo(333.36, 1);
    });

    it('should calculate different social insurance for apprentices', () => {
      const employeeInput: CalculatorInput = {
        employmentType: 'employee',
        incomePeriod: 'monthly',
        income: 2000,
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

      const apprenticeInput = { ...employeeInput, employmentType: 'apprentice' as const };

      const employeeResult = calculateNetSalary(employeeInput);
      const apprenticeResult = calculateNetSalary(apprenticeInput);

      // Apprentice should have lower social insurance (15.50% vs 18.07%)
      expect(apprenticeResult.socialInsuranceMonthly).toBeLessThan(employeeResult.socialInsuranceMonthly);
      expect(apprenticeResult.netMonthly).toBeGreaterThan(employeeResult.netMonthly);
    });

    it('should calculate pensioner with lower social insurance', () => {
      const input: CalculatorInput = {
        employmentType: 'pensioner',
        incomePeriod: 'monthly',
        income: 2000,
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

      const result = calculateNetSalary(input);

      // Pensioner should have 5.10% social insurance
      expect(result.socialInsuranceMonthly).toBeCloseTo(2000 * 0.051, 0);
    });

    it('should handle yearly income period correctly', () => {
      const monthlyInput: CalculatorInput = {
        employmentType: 'employee',
        incomePeriod: 'monthly',
        income: 3000,
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

      const yearlyInput = { ...monthlyInput, incomePeriod: 'yearly' as const, income: 42000 };

      const monthlyResult = calculateNetSalary(monthlyInput);
      const yearlyResult = calculateNetSalary(yearlyInput);

      // Should produce same results
      expect(yearlyResult.grossMonthly).toBeCloseTo(monthlyResult.grossMonthly, 0);
      expect(yearlyResult.grossAnnual).toBeCloseTo(monthlyResult.grossAnnual, 0);
    });

    it('should calculate 13th and 14th salaries with different tax rates', () => {
      const input: CalculatorInput = {
        employmentType: 'employee',
        incomePeriod: 'monthly',
        income: 3000,
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

      const result = calculateNetSalary(input);

      // 13th and 14th should be different due to progressive tax brackets
      expect(result.netSpecial13th).not.toBe(result.netSpecial14th);
      // 13th typically has lower tax (uses lower brackets first)
      expect(result.incomeTaxSpecial13th).toBeLessThan(result.incomeTaxSpecial14th);
    });

    it('should apply single earner credit correctly', () => {
      const withoutCredit: CalculatorInput = {
        employmentType: 'employee',
        incomePeriod: 'monthly',
        income: 3000,
        calculationMode: 'gross-to-net',
        hasChildren: true,
        childrenUnder18: 1,
        childrenOver18: 0,
        isSingleEarner: false,
        familyBonus: 'full',
        taxableBenefitsMonthly: 0,
        companyCarBenefitMonthly: 0,
        allowance: 0,
        receivesCommuterAllowance: false,
        commuterAllowanceMonthly: 0,
      };

      const withCredit = { ...withoutCredit, isSingleEarner: true };

      const resultWithout = calculateNetSalary(withoutCredit);
      const resultWith = calculateNetSalary(withCredit);

      // Single earner should have higher credits
      expect(resultWith.creditsAnnual).toBeGreaterThan(resultWithout.creditsAnnual);
      // And therefore higher net
      expect(resultWith.netAnnual).toBeGreaterThan(resultWithout.netAnnual);
    });
  });

  describe('calculateGrossFromNet', () => {
    it('should reverse calculate gross from desired net salary', () => {
      const targetNetMonthlyAvg = 2500; // This is average including 13th/14th
      const input: CalculatorInput = {
        employmentType: 'employee',
        incomePeriod: 'monthly',
        income: targetNetMonthlyAvg,
        calculationMode: 'net-to-gross',
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

      const result = calculateGrossFromNet(input);

      // Gross should be higher than net
      expect(result.grossMonthly).toBeGreaterThan(targetNetMonthlyAvg);
      // The resulting average monthly net (netAnnual/12) should be close to target
      expect(result.netMonthly).toBeCloseTo(targetNetMonthlyAvg, 0);
    });

    it('should work with yearly income period', () => {
      const targetNetAnnual = 30000;
      const input: CalculatorInput = {
        employmentType: 'employee',
        incomePeriod: 'yearly',
        income: targetNetAnnual,
        calculationMode: 'net-to-gross',
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

      const result = calculateGrossFromNet(input);

      // The resulting net annual should be close to target
      expect(result.netAnnual).toBeCloseTo(targetNetAnnual, 0);
    });

    it('should produce reversible calculations', () => {
      const originalGross = 3500;

      // Forward calculation
      const forwardInput: CalculatorInput = {
        employmentType: 'employee',
        incomePeriod: 'monthly',
        income: originalGross,
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

      const forwardResult = calculateNetSalary(forwardInput);

      // Reverse calculation using the average monthly net
      const reverseInput = {
        ...forwardInput,
        income: forwardResult.netMonthly,  // Using average monthly net
        calculationMode: 'net-to-gross' as const,
      };

      const reverseResult = calculateGrossFromNet(reverseInput);

      // Should get back approximately the original gross (within €1)
      expect(reverseResult.grossMonthly).toBeCloseTo(originalGross, 0);
    });
  });

  describe('formatCurrency', () => {
    it('should format currency in Euro with German locale', () => {
      const formatted = formatCurrency(1234.56, 'de-AT');
      expect(formatted).toContain('1');
      expect(formatted).toContain('2');
      expect(formatted).toContain('3');
      expect(formatted).toContain('4');
      expect(formatted).toContain('56');
    });

    it('should format currency in Euro with English locale', () => {
      const formatted = formatCurrency(1234.56, 'en-US');
      expect(formatted).toContain('1');
      expect(formatted).toContain('2');
      expect(formatted).toContain('3');
      expect(formatted).toContain('4');
      expect(formatted).toContain('56');
    });

    it('should handle zero values', () => {
      const formatted = formatCurrency(0, 'de-AT');
      expect(formatted).toBeDefined();
      expect(formatted).toContain('0');
    });

    it('should handle negative values', () => {
      const formatted = formatCurrency(-100, 'de-AT');
      expect(formatted).toBeDefined();
      expect(formatted).toContain('100');
    });

    it('should handle large values', () => {
      const formatted = formatCurrency(999999.99, 'de-AT');
      expect(formatted).toBeDefined();
    });
  });

  describe('User Reported Cases', () => {
    it('should correctly calculate 5400€ brutto (user reported case)', () => {
      const input: CalculatorInput = {
        employmentType: 'employee',
        incomePeriod: 'monthly',
        income: 5400,
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

      const result = calculateNetSalary(input);

      console.log('5400€ Test:');
      console.log('  Brutto monatlich:', result.grossMonthly.toFixed(2), '€');
      console.log('  SV monatlich:', result.socialInsuranceMonthly.toFixed(2), '€');
      console.log('  LSt monatlich:', result.incomeTaxMonthly.toFixed(2), '€');
      console.log('  Netto REGULÄR monatlich:', result.netRegularMonthly.toFixed(2), '€');
      console.log('  Netto DURCHSCHNITT monatlich:', result.netMonthly.toFixed(2), '€');
      console.log('  Expected (regular): ~3400.09€, Difference:', (result.netRegularMonthly - 3400.09).toFixed(2), '€');

      // User reported expected net: 3400.09€ (regular monthly, not average)
      // Test against regular monthly net (what you get 12x per year)
      expect(result.grossMonthly).toBe(5400);
      expect(result.netRegularMonthly).toBeGreaterThan(3390);
      expect(result.netRegularMonthly).toBeLessThan(3420);
    });

    it('should correctly calculate 120k€ yearly (user reported case)', () => {
      const input: CalculatorInput = {
        employmentType: 'employee',
        incomePeriod: 'yearly',
        income: 120000,
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

      const result = calculateNetSalary(input);

      console.log('120k€ Test:');
      console.log('  Brutto monatlich:', result.grossMonthly.toFixed(2), '€');
      console.log('  Brutto jährlich:', result.grossAnnual.toFixed(2), '€');
      console.log('  SV monatlich:', result.socialInsuranceMonthly.toFixed(2), '€');
      console.log('  LSt monatlich:', result.incomeTaxMonthly.toFixed(2), '€');
      console.log('  Netto monatlich:', result.netMonthly.toFixed(2), '€');
      console.log('  Netto jährlich:', result.netAnnual.toFixed(2), '€');

      // User reported the calculated value was too low
      expect(result.grossAnnual).toBeCloseTo(120000, 0);
      expect(result.netAnnual).toBeGreaterThan(60000);
    });
  });

  describe('Edge Cases', () => {
    it('should handle minimum wage scenarios', () => {
      const input: CalculatorInput = {
        employmentType: 'employee',
        incomePeriod: 'monthly',
        income: 1000,
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

      const result = calculateNetSalary(input);

      expect(result.netMonthly).toBeGreaterThan(0);
      // At low income, SV-Rückerstattung (negative tax refund) can make net higher than gross
      // This is correct for Austrian tax law
      expect(result.netMonthly).toBeGreaterThan(800);
    });

    it('should handle high salary scenarios', () => {
      const input: CalculatorInput = {
        employmentType: 'employee',
        incomePeriod: 'monthly',
        income: 10000,
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

      const result = calculateNetSalary(input);

      // High earners should hit higher tax brackets
      expect(result.incomeTaxAnnual).toBeGreaterThan(0);
      // But net should still be positive
      expect(result.netAnnual).toBeGreaterThan(0);
    });

    it('should handle zero income gracefully', () => {
      const input: CalculatorInput = {
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

      const result = calculateNetSalary(input);

      expect(result.grossMonthly).toBe(0);
      expect(result.netMonthly).toBe(0);
      expect(result.socialInsuranceMonthly).toBe(0);
      expect(result.incomeTaxMonthly).toBe(0);
    });
  });
});
