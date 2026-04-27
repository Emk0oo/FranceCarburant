import { FUEL_TYPES, type FuelType, type Station } from "@/types";
import { formatPrice } from "@/lib/utils";

export type HistogramBin = {
  binStart: number;
  binEnd: number;
  midpoint: number;
  count: number;
  label: string;
};

export function priceHistogramBins(
  stations: Station[],
  fuel: FuelType,
  binCount = 20
): HistogramBin[] {
  const prices: number[] = [];
  for (const s of stations) {
    const p = s.prices[fuel];
    if (p != null) prices.push(p);
  }
  if (prices.length === 0) return [];

  const min = Math.min(...prices);
  const max = Math.max(...prices);
  if (min === max) {
    return [
      {
        binStart: min,
        binEnd: max,
        midpoint: min,
        count: prices.length,
        label: formatPrice(min),
      },
    ];
  }

  const width = (max - min) / binCount;
  const bins: HistogramBin[] = Array.from({ length: binCount }, (_, i) => {
    const start = min + i * width;
    const end = i === binCount - 1 ? max : start + width;
    return {
      binStart: start,
      binEnd: end,
      midpoint: (start + end) / 2,
      count: 0,
      label: formatPrice((start + end) / 2),
    };
  });

  for (const p of prices) {
    let idx = Math.floor((p - min) / width);
    if (idx >= binCount) idx = binCount - 1;
    bins[idx].count++;
  }
  return bins;
}

export type RegionStat = {
  region: string;
  avg: number;
  count: number;
};

export function avgPriceByRegion(
  stations: Station[],
  fuel: FuelType,
  limit = 10,
  minStations = 5
): RegionStat[] {
  const acc = new Map<string, { sum: number; count: number }>();
  for (const s of stations) {
    const p = s.prices[fuel];
    const region = s.region?.trim();
    if (p == null || !region) continue;
    const cur = acc.get(region) ?? { sum: 0, count: 0 };
    cur.sum += p;
    cur.count++;
    acc.set(region, cur);
  }
  const stats: RegionStat[] = [];
  for (const [region, { sum, count }] of acc) {
    if (count < minStations) continue;
    stats.push({ region, avg: sum / count, count });
  }
  stats.sort((a, b) => a.avg - b.avg);
  return stats.slice(0, limit);
}

export type FuelAvailabilityRow = {
  fuel: FuelType;
  label: string;
  count: number;
  share: number;
};

export function fuelAvailability(stations: Station[]): FuelAvailabilityRow[] {
  const total = stations.length || 1;
  return FUEL_TYPES.map((f) => {
    let count = 0;
    for (const s of stations) {
      if (s.prices[f.id] != null) count++;
    }
    return { fuel: f.id, label: f.label, count, share: count / total };
  });
}

export type FuelAvgRow = {
  fuel: FuelType;
  label: string;
  avg: number | null;
};

export function avgPricePerFuel(stations: Station[]): FuelAvgRow[] {
  return FUEL_TYPES.map((f) => {
    let sum = 0;
    let count = 0;
    for (const s of stations) {
      const p = s.prices[f.id];
      if (p == null) continue;
      sum += p;
      count++;
    }
    return { fuel: f.id, label: f.label, avg: count === 0 ? null : sum / count };
  });
}
