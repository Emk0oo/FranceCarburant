"use client";

import { useCallback, useMemo, useState } from "react";
import { FUEL_TYPES, type FuelType, type Station } from "@/types";
import { computeQuintiles } from "./legend";
import { KPIPanel, type KPIStats } from "./KPIPanel";
import { MapControls } from "./MapControls";
import { StationsMapDynamic } from "./StationsMapDynamic";
import type { Bounds } from "./StationsMap";

function isInBounds(s: Station, b: Bounds): boolean {
  return (
    s.lat <= b.north &&
    s.lat >= b.south &&
    s.lng <= b.east &&
    s.lng >= b.west
  );
}

export function StationsView({ stations }: { stations: Station[] }) {
  const [selectedFuel, setSelectedFuel] = useState<FuelType>("sp95");
  const [bounds, setBounds] = useState<Bounds | null>(null);

  const handleBoundsChange = useCallback((b: Bounds) => setBounds(b), []);

  // Thresholds + legend = global, stable, never depend on zoom.
  const { thresholds, hasNoPrice } = useMemo(() => {
    const prices: number[] = [];
    let missing = 0;
    for (const s of stations) {
      const p = s.prices[selectedFuel];
      if (p == null) missing++;
      else prices.push(p);
    }
    return {
      thresholds: computeQuintiles(prices),
      hasNoPrice: missing > 0,
    };
  }, [stations, selectedFuel]);

  // KPIs = filtered to current map viewport.
  const { stats, isFiltered } = useMemo(() => {
    const inView = bounds
      ? stations.filter((s) => isInBounds(s, bounds))
      : stations;

    const prices: number[] = [];
    let cheapest: Station | null = null;
    let cheapestPrice = Infinity;
    for (const s of inView) {
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
      total: inView.length,
      avg: n === 0 ? null : sum / n,
      median,
      min: n === 0 ? null : sorted[0],
      max: n === 0 ? null : sorted[n - 1],
      cheapestStation: cheapest,
    };
    return {
      stats,
      isFiltered: bounds != null && inView.length !== stations.length,
    };
  }, [stations, selectedFuel, bounds]);

  const fuelLabel =
    FUEL_TYPES.find((f) => f.id === selectedFuel)?.label ?? selectedFuel;

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-center lg:gap-6">
      <div className="order-2 w-full lg:order-1 lg:w-60 lg:flex-none">
        <KPIPanel
          stats={stats}
          fuelLabel={fuelLabel}
          isFiltered={isFiltered}
        />
      </div>
      <div className="order-1 h-[600px] w-full overflow-hidden rounded-2xl border border-black/[.08] dark:border-white/[.12] lg:order-2 lg:max-w-6xl lg:flex-1">
        <StationsMapDynamic
          stations={stations}
          selectedFuel={selectedFuel}
          thresholds={thresholds}
          onBoundsChange={handleBoundsChange}
        />
      </div>
      <div className="order-3 w-full lg:w-60 lg:flex-none">
        <MapControls
          selectedFuel={selectedFuel}
          onChange={setSelectedFuel}
          thresholds={thresholds}
          hasNoPriceStations={hasNoPrice}
        />
      </div>
    </div>
  );
}
