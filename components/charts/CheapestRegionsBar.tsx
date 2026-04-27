"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { FUEL_TYPES, type FuelType, type Station } from "@/types";
import { avgPriceByRegion } from "@/lib/analytics";
import { formatPrice } from "@/lib/utils";
import { PRICE_PALETTE } from "@/components/map/legend";

type Props = {
  stations: Station[];
  selectedFuel: FuelType;
};

export function CheapestRegionsBar({ stations, selectedFuel }: Props) {
  const data = useMemo(
    () => avgPriceByRegion(stations, selectedFuel, 10),
    [stations, selectedFuel]
  );

  const fuelLabel =
    FUEL_TYPES.find((f) => f.id === selectedFuel)?.label ?? selectedFuel;

  const minAvg = data[0]?.avg ?? 0;
  const maxAvg = data[data.length - 1]?.avg ?? 0;

  return (
    <div className="rounded-2xl border border-black/[.08] bg-background p-5 dark:border-white/[.12]">
      <div>
        <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
          Cheapest regions
        </p>
        <h3 className="mt-0.5 text-base font-semibold tracking-tight">
          Top 10 — {fuelLabel}
        </h3>
      </div>
      <div className="mt-4 h-80 w-full">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-xs text-zinc-500">
            Not enough regional data for this fuel.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 8, right: 16, left: 8, bottom: 0 }}
            >
              <CartesianGrid
                stroke="currentColor"
                strokeOpacity={0.08}
                horizontal={false}
              />
              <XAxis
                type="number"
                domain={["dataMin - 0.05", "dataMax + 0.05"]}
                tickFormatter={(v: number) => formatPrice(v)}
                tick={{ fontSize: 10, fill: "currentColor", fillOpacity: 0.6 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                type="category"
                dataKey="region"
                tick={{ fontSize: 11, fill: "currentColor", fillOpacity: 0.8 }}
                tickLine={false}
                axisLine={false}
                width={140}
              />
              <Tooltip
                cursor={{ fill: "currentColor", fillOpacity: 0.06 }}
                contentStyle={tooltipStyle}
                formatter={(value, _name, item) => {
                  const count = (item?.payload as { count?: number } | undefined)
                    ?.count;
                  return [
                    `${formatPrice(Number(value))} · ${count ?? 0} stations`,
                    "Avg",
                  ];
                }}
              />
              <Bar
                dataKey="avg"
                radius={[0, 4, 4, 0]}
                animationDuration={350}
              >
                {data.map((row, idx) => (
                  <Cell
                    key={row.region}
                    fill={colorForRank(idx, data.length, row.avg, minAvg, maxAvg)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

function colorForRank(
  idx: number,
  total: number,
  value: number,
  min: number,
  max: number
): string {
  if (total <= 1 || max === min) return PRICE_PALETTE[0];
  const t = (value - min) / (max - min);
  const slot = Math.min(
    PRICE_PALETTE.length - 1,
    Math.max(0, Math.round(t * (PRICE_PALETTE.length - 1)))
  );
  void idx;
  return PRICE_PALETTE[slot];
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
