import { describe, it, expect } from 'vitest';
import { parseLocaleNumber, isValidNumberInput, sanitizeNumberInput } from './number-utils';

describe('parseLocaleNumber', () => {
  it('parses English format with period as decimal separator', () => {
    expect(parseLocaleNumber('3000.50')).toBe(3000.5);
    expect(parseLocaleNumber('1234.56')).toBe(1234.56);
    expect(parseLocaleNumber('0.99')).toBe(0.99);
  });

  it('parses German format with comma as decimal separator', () => {
    expect(parseLocaleNumber('3000,50')).toBe(3000.5);
    expect(parseLocaleNumber('1234,56')).toBe(1234.56);
    expect(parseLocaleNumber('0,99')).toBe(0.99);
  });

  it('parses English format with thousands separator', () => {
    expect(parseLocaleNumber('1,234.56')).toBe(1234.56);
    expect(parseLocaleNumber('1,234,567.89')).toBe(1234567.89);
  });

  it('parses German format with thousands separator', () => {
    expect(parseLocaleNumber('1.234,56')).toBe(1234.56);
    expect(parseLocaleNumber('1.234.567,89')).toBe(1234567.89);
  });

  it('parses numbers without decimal separators', () => {
    expect(parseLocaleNumber('3000')).toBe(3000);
    expect(parseLocaleNumber('42')).toBe(42);
  });

  it('handles empty or invalid input', () => {
    expect(parseLocaleNumber('')).toBe(NaN);
    expect(parseLocaleNumber('abc')).toBe(NaN);
  });

  it('handles whitespace', () => {
    expect(parseLocaleNumber(' 3000.50 ')).toBe(3000.5);
    expect(parseLocaleNumber(' 3 000,50 ')).toBe(3000.5);
  });

  it('handles ambiguous single separator based on digits after', () => {
    // Two digits after separator = decimal
    expect(parseLocaleNumber('3,50')).toBe(3.5);
    expect(parseLocaleNumber('3.50')).toBe(3.5);

    // Three digits after separator = thousands
    expect(parseLocaleNumber('3,000')).toBe(3000);
    expect(parseLocaleNumber('3.000')).toBe(3000);
  });
});

describe('isValidNumberInput', () => {
  it('validates correct number formats', () => {
    expect(isValidNumberInput('3000')).toBe(true);
    expect(isValidNumberInput('3000.50')).toBe(true);
    expect(isValidNumberInput('3000,50')).toBe(true);
    expect(isValidNumberInput('1.234,56')).toBe(true);
    expect(isValidNumberInput('1,234.56')).toBe(true);
  });

  it('rejects invalid formats', () => {
    expect(isValidNumberInput('abc')).toBe(false);
    expect(isValidNumberInput('12a34')).toBe(false);
    expect(isValidNumberInput('')).toBe(false);
  });
});

describe('sanitizeNumberInput', () => {
  it('removes invalid characters', () => {
    expect(sanitizeNumberInput('3000abc')).toBe('3000');
    expect(sanitizeNumberInput('30€00')).toBe('3000');
  });

  it('keeps valid decimal separators', () => {
    expect(sanitizeNumberInput('3000.50')).toBe('3000.50');
    expect(sanitizeNumberInput('3000,50')).toBe('3000,50');
  });

  it('handles multiple separators by keeping only the last one', () => {
    expect(sanitizeNumberInput('3.000.50')).toBe('3000.50');
    expect(sanitizeNumberInput('3,000,50')).toBe('3000,50');
    expect(sanitizeNumberInput('1.234,56')).toBe('1234,56');
  });

  it('handles empty input', () => {
    expect(sanitizeNumberInput('')).toBe('');
  });
});
