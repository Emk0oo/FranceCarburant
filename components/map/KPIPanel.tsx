"use client";

import type { Station } from "@/types";
import { formatPrice } from "@/lib/utils";

export type KPIStats = {
  count: number;
  total: number;
  avg: number | null;
  median: number | null;
  min: number | null;
  max: number | null;
  cheapestStation: Station | null;
};

type Props = {
  stats: KPIStats;
  fuelLabel: string;
  isFiltered: boolean;
};

export function KPIPanel({ stats, fuelLabel, isFiltered }: Props) {
  const { count, total, avg, median, min, max, cheapestStation } = stats;
  const coverage = total > 0 ? Math.round((count / total) * 100) : 0;

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-black/[.08] bg-background dark:border-white/[.12]">
      <div className="divide-y divide-black/[.08] dark:divide-white/[.12]">
        <Section>
          <Label>{isFiltered ? "Vue actuelle" : "France entière"}</Label>
          <p className="mt-0.5 text-base font-semibold tracking-tight">
            {fuelLabel}
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            <span className="font-semibold text-foreground tabular-nums">
              {count.toLocaleString("fr-FR")}
            </span>{" "}
            / {total.toLocaleString("fr-FR")} stations · {coverage}%
          </p>
        </Section>

        <Section>
          <Label>Prix moyen</Label>
          <p className="mt-0.5 text-2xl font-semibold tabular-nums tracking-tight">
            {avg != null ? formatPrice(avg) : "—"}
          </p>
          {median != null && (
            <p className="mt-0.5 text-xs text-zinc-500">
              Médiane{" "}
              <span className="font-medium text-foreground tabular-nums">
                {formatPrice(median)}
              </span>
            </p>
          )}
        </Section>

        <Section>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Min</Label>
              <p className="mt-0.5 text-sm font-semibold tabular-nums">
                {min != null ? formatPrice(min) : "—"}
              </p>
            </div>
            <div>
              <Label>Max</Label>
              <p className="mt-0.5 text-sm font-semibold tabular-nums">
                {max != null ? formatPrice(max) : "—"}
              </p>
            </div>
          </div>
        </Section>

        {cheapestStation && (
          <Section>
            <Label>Moins cher</Label>
            <p
              className="mt-0.5 truncate text-sm font-semibold"
              title={cheapestStation.name}
            >
              {cheapestStation.name}
            </p>
            <p className="text-xs text-zinc-500">
              {cheapestStation.cp} {cheapestStation.city}
            </p>
          </Section>
        )}
      </div>
    </div>
  );
}

function Section({ children }: { children: React.ReactNode }) {
  return <div className="px-4 py-3">{children}</div>;
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
      {children}
    </p>
  );
}
