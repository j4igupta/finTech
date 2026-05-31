/**
 * Centralized number/currency/percent formatting so values render consistently
 * (thousands separators, fixed decimals) and handle edge cases — null/undefined,
 * negatives, and very large numbers — without crashing.
 */

const safe = (n: number | null | undefined): number =>
  typeof n === 'number' && Number.isFinite(n) ? n : 0;

/** "$1,234.50" — always two decimals, with sign for negatives. */
export function formatCurrency(value: number | null | undefined, currency = 'USD'): string {
  return safe(value).toLocaleString('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** "1,234" or "1,234.5" — grouped, with up to `maxDecimals` decimals. */
export function formatNumber(value: number | null | undefined, maxDecimals = 0): string {
  return safe(value).toLocaleString('en-US', { maximumFractionDigits: maxDecimals });
}

/** Compact form for large values: "1.2K", "3.4M". */
export function formatCompact(value: number | null | undefined): string {
  return safe(value).toLocaleString('en-US', { notation: 'compact', maximumFractionDigits: 1 });
}

/** "+1.23%" / "-4.50%" with explicit sign. */
export function formatPercent(value: number | null | undefined, decimals = 2): string {
  const n = safe(value);
  return `${n >= 0 ? '+' : ''}${n.toFixed(decimals)}%`;
}
