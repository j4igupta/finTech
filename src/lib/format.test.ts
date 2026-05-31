import { describe, it, expect } from 'vitest';
import { formatCurrency, formatNumber, formatCompact, formatPercent } from './format';

describe('formatCurrency', () => {
  it('formats with grouping and two decimals', () => {
    expect(formatCurrency(1234.5)).toBe('$1,234.50');
  });
  it('handles negatives', () => {
    expect(formatCurrency(-42)).toBe('-$42.00');
  });
  it('coerces null/undefined/NaN to $0.00', () => {
    expect(formatCurrency(null)).toBe('$0.00');
    expect(formatCurrency(undefined)).toBe('$0.00');
    expect(formatCurrency(NaN)).toBe('$0.00');
  });
});

describe('formatNumber', () => {
  it('groups thousands', () => {
    expect(formatNumber(1234567)).toBe('1,234,567');
  });
  it('respects max decimals', () => {
    expect(formatNumber(3.14159, 2)).toBe('3.14');
  });
});

describe('formatCompact', () => {
  it('compacts large values', () => {
    expect(formatCompact(1200)).toBe('1.2K');
    expect(formatCompact(3_400_000)).toBe('3.4M');
  });
});

describe('formatPercent', () => {
  it('adds an explicit + for non-negatives', () => {
    expect(formatPercent(1.2)).toBe('+1.20%');
  });
  it('keeps the - for negatives', () => {
    expect(formatPercent(-3)).toBe('-3.00%');
  });
});
