"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { FUEL_TYPES, type FuelType, type Station } from "@/types";
import { priceHistogramBins } from "@/lib/analytics";
import { formatPrice } from "@/lib/utils";
import { PRICE_PALETTE } from "@/components/map/legend";

type Props = {
  stations: Station[];
  selectedFuel: FuelType;
  onFuelChange: (fuel: FuelType) => void;
};

export function PriceHistogram({ stations, selectedFuel, onFuelChange }: Props) {
  const bins = useMemo(
    () => priceHistogramBins(stations, selectedFuel, 24),
    [stations, selectedFuel]
  );

  const fuelLabel =
    FUEL_TYPES.find((f) => f.id === selectedFuel)?.label ?? selectedFuel;

  return (
    <div className="rounded-2xl border border-black/[.08] bg-background p-5 dark:border-white/[.12]">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
            Price distribution
          </p>
          <h3 className="mt-0.5 text-base font-semibold tracking-tight">
            {fuelLabel} — across {stations.length.toLocaleString("en-US")} stations
          </h3>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {FUEL_TYPES.map((f) => {
            const isActive = f.id === selectedFuel;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => onFuelChange(f.id)}
                className={`rounded-md border px-2 py-1 text-[11px] font-medium transition-colors ${
                  isActive
                    ? "border-foreground bg-foreground text-background"
                    : "border-black/10 text-zinc-700 hover:border-black/30 dark:border-white/15 dark:text-zinc-200 dark:hover:border-white/40"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>
      <div className="mt-4 h-72 w-full">
        {bins.length === 0 ? (
          <EmptyState />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={bins}
              margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                stroke="currentColor"
                strokeOpacity={0.08}
                vertical={false}
              />
              <XAxis
                dataKey="midpoint"
                tickFormatter={(v: number) => formatPrice(v)}
                tick={{ fontSize: 10, fill: "currentColor", fillOpacity: 0.6 }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
                minTickGap={28}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "currentColor", fillOpacity: 0.6 }}
                tickLine={false}
                axisLine={false}
                width={32}
              />
              <Tooltip
                cursor={{ fill: "currentColor", fillOpacity: 0.06 }}
                contentStyle={tooltipStyle}
                labelStyle={{ fontSize: 11, color: "#71717a" }}
                formatter={(value) => [
                  `${Number(value).toLocaleString("en-US")} stations`,
                  "Count",
                ]}
                labelFormatter={(_, payload) => {
                  const item = payload?.[0]?.payload as
                    | { binStart: number; binEnd: number }
                    | undefined;
                  if (!item) return "";
                  return `${formatPrice(item.binStart)} – ${formatPrice(item.binEnd)}`;
                }}
              />
              <Bar
                dataKey="count"
                fill={PRICE_PALETTE[2]}
                radius={[4, 4, 0, 0]}
                animationDuration={350}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex h-full items-center justify-center text-xs text-zinc-500">
      No data for this fuel.
    </div>
  );
}

const tooltipStyle: React.CSSProperties = {
  borderRadius: 12,
  border: "1px solid rgba(0,0,0,0.08)",
  background: "var(--background)",
  color: "var(--foreground)",
  fontSize: 12,
  padding: "8px 10px",
  boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
};
