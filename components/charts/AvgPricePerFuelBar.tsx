"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Station } from "@/types";
import { avgPricePerFuel } from "@/lib/analytics";
import { formatPrice } from "@/lib/utils";

const FUEL_COLORS = [
  "#0ea5e9",
  "#8b5cf6",
  "#22c55e",
  "#f97316",
  "#ec4899",
  "#eab308",
];

type Props = {
  stations: Station[];
};

export function AvgPricePerFuelBar({ stations }: Props) {
  const data = useMemo(
    () =>
      avgPricePerFuel(stations).map((row) => ({
        ...row,
        avgValue: row.avg ?? 0,
      })),
    [stations]
  );

  return (
    <div className="rounded-2xl border border-black/[.08] bg-background p-5 dark:border-white/[.12]">
      <div>
        <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
          Average price
        </p>
        <h3 className="mt-0.5 text-base font-semibold tracking-tight">
          Per fuel — nationwide
        </h3>
      </div>
      <div className="mt-4 h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 16, right: 12, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              stroke="currentColor"
              strokeOpacity={0.08}
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "currentColor", fillOpacity: 0.7 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tickFormatter={(v: number) => formatPrice(v)}
              domain={["dataMin - 0.1", "dataMax + 0.1"]}
              tick={{ fontSize: 10, fill: "currentColor", fillOpacity: 0.6 }}
              tickLine={false}
              axisLine={false}
              width={60}
            />
            <Tooltip
              cursor={{ fill: "currentColor", fillOpacity: 0.06 }}
              contentStyle={tooltipStyle}
              formatter={(value) => [formatPrice(Number(value)), "Avg"]}
            />
            <Bar
              dataKey="avgValue"
              radius={[6, 6, 0, 0]}
              animationDuration={600}
            >
              {data.map((row, idx) => (
                <Cell
                  key={row.fuel}
                  fill={FUEL_COLORS[idx % FUEL_COLORS.length]}
                />
              ))}
              <LabelList
                dataKey="avgValue"
                position="top"
                formatter={(value: unknown) =>
                  typeof value === "number" && value > 0
                    ? formatPrice(value)
                    : ""
                }
                style={{ fontSize: 10, fill: "currentColor", fillOpacity: 0.7 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
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
