"use client";

import { useMemo } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { Station } from "@/types";
import { fuelAvailability } from "@/lib/analytics";

const PIE_COLORS = [
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

export function FuelAvailabilityPie({ stations }: Props) {
  const data = useMemo(() => fuelAvailability(stations), [stations]);
  const total = stations.length;

  return (
    <div className="rounded-2xl border border-black/[.08] bg-background p-5 dark:border-white/[.12]">
      <div>
        <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
          Fuel availability
        </p>
        <h3 className="mt-0.5 text-base font-semibold tracking-tight">
          Stations offering each fuel
        </h3>
      </div>
      <div className="mt-4 h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius="55%"
              outerRadius="85%"
              paddingAngle={2}
              animationDuration={700}
              stroke="var(--background)"
              strokeWidth={2}
            >
              {data.map((row, idx) => (
                <Cell
                  key={row.fuel}
                  fill={PIE_COLORS[idx % PIE_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(value, _name, item) => {
                const share =
                  (item?.payload as { share?: number } | undefined)?.share ?? 0;
                return [
                  `${Number(value).toLocaleString("en-US")} (${(share * 100).toFixed(1)}%)`,
                  "Stations",
                ];
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              wrapperStyle={{ fontSize: 11 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-1 text-xs text-zinc-500">
        Out of {total.toLocaleString("en-US")} stations.
      </p>
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
