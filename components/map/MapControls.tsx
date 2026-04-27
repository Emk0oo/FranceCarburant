"use client";

import { FUEL_TYPES, type FuelType } from "@/types";
import { formatPrice } from "@/lib/utils";
import { PRICE_PALETTE, NO_PRICE_COLOR } from "./legend";

type Props = {
  selectedFuel: FuelType;
  onChange: (fuel: FuelType) => void;
  thresholds: number[];
  hasNoPriceStations: boolean;
};

export function MapControls({
  selectedFuel,
  onChange,
  thresholds,
  hasNoPriceStations,
}: Props) {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-black/[.08] bg-background dark:border-white/[.12]">
      <div className="divide-y divide-black/[.08] dark:divide-white/[.12]">
        <div className="px-4 py-3">
          <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
            Carburant
          </p>
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            {FUEL_TYPES.map((f) => {
              const isActive = f.id === selectedFuel;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => onChange(f.id)}
                  className={`rounded-md border px-2 py-1.5 text-xs font-medium transition-colors ${
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

        <div className="px-4 py-3">
          <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
            Légende
          </p>
          {thresholds.length === 4 ? (
            <ul className="mt-2 space-y-1.5 text-xs">
              <LegendRow
                color={PRICE_PALETTE[0]}
                label={`≤ ${formatPrice(thresholds[0])}`}
              />
              <LegendRow
                color={PRICE_PALETTE[1]}
                label={`${formatPrice(thresholds[0])} – ${formatPrice(thresholds[1])}`}
              />
              <LegendRow
                color={PRICE_PALETTE[2]}
                label={`${formatPrice(thresholds[1])} – ${formatPrice(thresholds[2])}`}
              />
              <LegendRow
                color={PRICE_PALETTE[3]}
                label={`${formatPrice(thresholds[2])} – ${formatPrice(thresholds[3])}`}
              />
              <LegendRow
                color={PRICE_PALETTE[4]}
                label={`> ${formatPrice(thresholds[3])}`}
              />
              {hasNoPriceStations && (
                <LegendRow color={NO_PRICE_COLOR} label="Non disponible" />
              )}
            </ul>
          ) : (
            <p className="mt-2 text-xs text-zinc-500">
              Aucune donnée pour ce carburant.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function LegendRow({ color, label }: { color: string; label: string }) {
  return (
    <li className="flex items-center gap-2">
      <span
        className="inline-block h-3 w-3 flex-none rounded-full border border-white shadow"
        style={{ backgroundColor: color }}
      />
      <span className="tabular-nums">{label}</span>
    </li>
  );
}
