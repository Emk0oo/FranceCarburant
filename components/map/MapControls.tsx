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
    <div className="absolute top-3 right-3 z-[400] w-64 rounded-lg border border-black/10 bg-background/95 p-3 shadow-lg backdrop-blur dark:border-white/15">
      <label className="block">
        <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
          Carburant
        </span>
        <select
          value={selectedFuel}
          onChange={(e) => onChange(e.target.value as FuelType)}
          className="mt-1 w-full rounded border border-black/15 bg-background px-2 py-1.5 text-sm dark:border-white/20"
        >
          {FUEL_TYPES.map((f) => (
            <option key={f.id} value={f.id}>
              {f.label}
            </option>
          ))}
        </select>
      </label>

      <div className="mt-3 border-t border-black/10 pt-3 dark:border-white/15">
        <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
          Légende
        </p>
        {thresholds.length === 4 ? (
          <ul className="mt-2 space-y-1 text-xs">
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
