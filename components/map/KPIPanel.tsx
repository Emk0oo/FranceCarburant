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
};

export function KPIPanel({ stats, fuelLabel }: Props) {
  const { count, total, avg, median, min, max, cheapestStation } = stats;
  const coverage = total > 0 ? Math.round((count / total) * 100) : 0;
  const spread = min != null && max != null ? max - min : null;

  return (
    <aside className="flex flex-col gap-3">
      <div className="rounded-2xl border border-black/[.08] bg-background p-4 dark:border-white/[.12]">
        <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
          Carburant
        </p>
        <p className="mt-1 text-xl font-semibold tracking-tight">{fuelLabel}</p>
        <p className="mt-2 text-xs text-zinc-500">
          <span className="font-semibold text-foreground tabular-nums">
            {count.toLocaleString("fr-FR")}
          </span>{" "}
          / {total.toLocaleString("fr-FR")} stations ({coverage}%)
        </p>
      </div>

      <div className="rounded-2xl border border-black/[.08] bg-background p-4 dark:border-white/[.12]">
        <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
          Prix moyen
        </p>
        <p className="mt-1 text-3xl font-semibold tabular-nums tracking-tight">
          {avg != null ? formatPrice(avg) : "—"}
        </p>
        {median != null && (
          <p className="mt-1 text-xs text-zinc-500">
            Médiane{" "}
            <span className="font-medium text-foreground tabular-nums">
              {formatPrice(median)}
            </span>
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <KPICard label="Min" value={min != null ? formatPrice(min) : "—"} />
        <KPICard label="Max" value={max != null ? formatPrice(max) : "—"} />
      </div>

      {spread != null && (
        <div className="rounded-2xl border border-black/[.08] bg-background p-4 dark:border-white/[.12]">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Écart min/max
          </p>
          <p className="mt-1 text-xl font-semibold tabular-nums tracking-tight">
            {formatPrice(spread)}
          </p>
        </div>
      )}

      {cheapestStation && (
        <div className="rounded-2xl border border-black/[.08] bg-background p-4 dark:border-white/[.12]">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Moins cher
          </p>
          <p
            className="mt-1 truncate text-sm font-semibold"
            title={cheapestStation.name}
          >
            {cheapestStation.name}
          </p>
          <p className="text-xs text-zinc-500">
            {cheapestStation.cp} {cheapestStation.city}
          </p>
        </div>
      )}
    </aside>
  );
}

function KPICard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/[.08] bg-background p-4 dark:border-white/[.12]">
      <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
        {label}
      </p>
      <p className="mt-1 text-lg font-semibold tabular-nums tracking-tight">
        {value}
      </p>
    </div>
  );
}
