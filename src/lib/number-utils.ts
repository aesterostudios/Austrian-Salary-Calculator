/**
 * Utility functions for parsing and formatting numbers with locale-specific decimal separators
 */

/**
 * Parses a string input that may contain locale-specific decimal separators
 * Accepts both comma (,) and period (.) as decimal separators
 * Returns a number or NaN if parsing fails
 *
 * @param input - The string to parse (e.g., "1234.56" or "1234,56")
 * @returns The parsed number or NaN
 *
 * @example
 * parseLocaleNumber("3000.50") // 3000.5
 * parseLocaleNumber("3000,50") // 3000.5
 * parseLocaleNumber("3.000,50") // 3000.5 (German format with thousands separator)
 * parseLocaleNumber("3,000.50") // 3000.5 (English format with thousands separator)
 */
export function parseLocaleNumber(input: string): number {
  if (!input || typeof input !== 'string') {
    return NaN;
  }

  // Trim whitespace
  let normalized = input.trim();

  // Remove any whitespace characters
  normalized = normalized.replace(/\s/g, '');

  // Detect the format by checking the last occurrence of separators
  const lastComma = normalized.lastIndexOf(',');
  const lastPeriod = normalized.lastIndexOf('.');

  // Count how many of each separator we have
  const commaCount = (normalized.match(/,/g) || []).length;
  const periodCount = (normalized.match(/\./g) || []).length;

  if (commaCount === 0 && periodCount === 0) {
    // No separators - plain number
    // normalized stays as is
  } else if (commaCount + periodCount === 1) {
    // Single separator - need to determine if it's decimal or thousands
    const separatorPos = Math.max(lastComma, lastPeriod);
    const afterSeparator = normalized.substring(separatorPos + 1);

    if (afterSeparator.length <= 2 && afterSeparator.length > 0) {
      // Likely a decimal separator (e.g., "3,50" or "3.50")
      normalized = normalized.replace(',', '.');
    } else if (afterSeparator.length === 3) {
      // Likely a thousands separator (e.g., "3,000" or "3.000")
      normalized = normalized.replace(/[,.]/g, '');
    } else {
      // Edge case: treat as decimal if uncertain
      normalized = normalized.replace(',', '.');
    }
  } else if (lastComma > lastPeriod) {
    // Multiple separators with comma last = German format
    // German format: comma is decimal separator, period is thousands separator
    // e.g., "1.234,56"
    normalized = normalized.replace(/\./g, ''); // Remove thousands separators
    normalized = normalized.replace(',', '.'); // Replace decimal comma with period
  } else {
    // Multiple separators with period last = English format
    // English format: period is decimal separator, comma is thousands separator
    // e.g., "1,234.56"
    normalized = normalized.replace(/,/g, ''); // Remove thousands separators
    // Period is already the decimal separator
  }

  // Parse the normalized string
  const parsed = Number.parseFloat(normalized);
  return parsed;
}

/**
 * Validates if a string input is a valid number format
 * Accepts both comma and period as decimal separators
 *
 * @param input - The string to validate
 * @returns true if the input is a valid number format
 */
export function isValidNumberInput(input: string): boolean {
  if (!input || typeof input !== 'string') {
    return false;
  }

  // Allow only digits, commas, periods, and whitespace
  const validPattern = /^[\d.,\s]+$/;
  if (!validPattern.test(input)) {
    return false;
  }

  // Try to parse and check if it results in a valid number
  const parsed = parseLocaleNumber(input);
  return !isNaN(parsed) && isFinite(parsed);
}

/**
 * Formats a string input to be a valid number format
 * Allows typing decimal separators (both . and ,)
 *
 * @param input - The current input string
 * @returns The sanitized input string that can be displayed
 */
export function sanitizeNumberInput(input: string): string {
  if (!input) return '';

  // Allow digits, one decimal separator (. or ,), and whitespace
  // Remove any other characters
  let sanitized = input.replace(/[^\d.,\s]/g, '');

  // Ensure only one decimal separator
  const commaCount = (sanitized.match(/,/g) || []).length;
  const periodCount = (sanitized.match(/\./g) || []).length;

  // If multiple separators exist, keep only the last one
  if (commaCount + periodCount > 1) {
    // Find the last separator position
    const lastComma = sanitized.lastIndexOf(',');
    const lastPeriod = sanitized.lastIndexOf('.');
    const lastSeparator = Math.max(lastComma, lastPeriod);
    const separator = lastComma > lastPeriod ? ',' : '.';

    // Rebuild string: everything before last separator (no separators) + separator + everything after
    const beforeSeparator = sanitized.substring(0, lastSeparator).replace(/[.,]/g, '');
    const afterSeparator = sanitized.substring(lastSeparator + 1).replace(/[.,]/g, '');
    sanitized = beforeSeparator + separator + afterSeparator;
  }

  return sanitized;
}
