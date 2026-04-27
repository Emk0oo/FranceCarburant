"use client";

import { useMemo, useState } from "react";
import { FUEL_TYPES, type FuelType, type Station } from "@/types";
import { computeQuintiles } from "./legend";
import { KPIPanel, type KPIStats } from "./KPIPanel";
import { MapControls } from "./MapControls";
import { StationsMapDynamic } from "./StationsMapDynamic";

export function StationsView({ stations }: { stations: Station[] }) {
  const [selectedFuel, setSelectedFuel] = useState<FuelType>("sp95");

  const { stats, thresholds, hasNoPrice } = useMemo(() => {
    const prices: number[] = [];
    let cheapest: Station | null = null;
    let cheapestPrice = Infinity;
    for (const s of stations) {
      const p = s.prices[selectedFuel];
      if (p == null) continue;
      prices.push(p);
      if (p < cheapestPrice) {
        cheapestPrice = p;
        cheapest = s;
      }
    }
    const sorted = [...prices].sort((a, b) => a - b);
    const n = sorted.length;
    const sum = sorted.reduce((a, b) => a + b, 0);
    const median =
      n === 0
        ? null
        : n % 2 === 0
          ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2
          : sorted[(n - 1) / 2];

    const stats: KPIStats = {
      count: n,
      total: stations.length,
      avg: n === 0 ? null : sum / n,
      median,
      min: n === 0 ? null : sorted[0],
      max: n === 0 ? null : sorted[n - 1],
      cheapestStation: cheapest,
    };

    return {
      stats,
      thresholds: computeQuintiles(prices),
      hasNoPrice: stations.length - n > 0,
    };
  }, [stations, selectedFuel]);

  const fuelLabel =
    FUEL_TYPES.find((f) => f.id === selectedFuel)?.label ?? selectedFuel;

  return (
    <div className="grid gap-4 lg:grid-cols-[260px_1fr_240px]">
      <KPIPanel stats={stats} fuelLabel={fuelLabel} />
      <div className="h-[600px] overflow-hidden rounded-2xl border border-black/[.08] dark:border-white/[.12]">
        <StationsMapDynamic
          stations={stations}
          selectedFuel={selectedFuel}
          thresholds={thresholds}
        />
      </div>
      <MapControls
        selectedFuel={selectedFuel}
        onChange={setSelectedFuel}
        thresholds={thresholds}
        hasNoPriceStations={hasNoPrice}
      />
    </div>
  );
}
