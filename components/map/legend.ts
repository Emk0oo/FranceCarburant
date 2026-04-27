export const PRICE_PALETTE = [
  "#16a34a",
  "#84cc16",
  "#facc15",
  "#f97316",
  "#dc2626",
] as const;

export const NO_PRICE_COLOR = "#a1a1aa";

export function computeQuintiles(values: number[]): number[] {
  const sorted = [...values].sort((a, b) => a - b);
  if (sorted.length === 0) return [];
  const q = (p: number) => {
    const idx = (sorted.length - 1) * p;
    const lo = Math.floor(idx);
    const hi = Math.ceil(idx);
    if (lo === hi) return sorted[lo];
    return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
  };
  return [q(0.2), q(0.4), q(0.6), q(0.8)];
}

export function colorForPrice(
  price: number | null,
  thresholds: number[]
): string {
  if (price == null) return NO_PRICE_COLOR;
  for (let i = 0; i < thresholds.length; i++) {
    if (price <= thresholds[i]) return PRICE_PALETTE[i];
  }
  return PRICE_PALETTE[PRICE_PALETTE.length - 1];
}
