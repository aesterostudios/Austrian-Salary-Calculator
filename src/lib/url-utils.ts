import LZString from 'lz-string';
import type { CalculatorInput } from './calculator';

/**
 * Compresses calculator input data and encodes it for URL usage
 */
export function encodePayload(payload: CalculatorInput): string {
  try {
    const json = JSON.stringify(payload);
    const compressed = LZString.compressToEncodedURIComponent(json);
    return compressed;
  } catch (error) {
    console.error('Failed to encode payload:', error);
    // Fallback to uncompressed
    return encodeURIComponent(JSON.stringify(payload));
  }
}

/**
 * Decodes and decompresses calculator input data from URL
 * Handles both new compressed format and legacy uncompressed format
 */
export function decodePayload(encodedPayload: string | null): CalculatorInput | null {
  if (!encodedPayload) {
    return null;
  }

  try {
    // Try decompressing first (new format)
    const decompressed = LZString.decompressFromEncodedURIComponent(encodedPayload);

    if (decompressed) {
      return JSON.parse(decompressed) as CalculatorInput;
    }

    // Fallback to legacy format (uncompressed)
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
 * Creates a shareable URL with compressed payload
 */
export function createShareUrl(payload: CalculatorInput, baseUrl?: string): string {
  const base = baseUrl || window.location.origin;
  const compressed = encodePayload(payload);
  return `${base}/result?payload=${compressed}`;
}
