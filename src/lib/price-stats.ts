import type { Decimal } from "@prisma/client/runtime/client";

export type PriceStats = {
  count: number;
  min: number | null;
  max: number | null;
  avg: number | null;
};

function toNum(v: Decimal): number {
  return Number(v);
}

/** Estadísticas sobre una lista de precios observados (mismo producto). */
export function computePriceStats(prices: Decimal[]): PriceStats {
  if (prices.length === 0) {
    return { count: 0, min: null, max: null, avg: null };
  }
  const nums = prices.map(toNum).filter((n) => Number.isFinite(n));
  if (nums.length === 0) {
    return { count: 0, min: null, max: null, avg: null };
  }
  const min = Math.min(...nums);
  const max = Math.max(...nums);
  const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
  return { count: nums.length, min, max, avg };
}
