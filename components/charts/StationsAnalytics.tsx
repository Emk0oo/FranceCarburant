"use client";

import { useState } from "react";
import type { FuelType, Station } from "@/types";
import { PriceHistogram } from "./PriceHistogram";
import { CheapestRegionsBar } from "./CheapestRegionsBar";
import { FuelAvailabilityPie } from "./FuelAvailabilityPie";
import { AvgPricePerFuelBar } from "./AvgPricePerFuelBar";

type Props = {
  stations: Station[];
};

export default function StationsAnalytics({ stations }: Props) {
  const [selectedFuel, setSelectedFuel] = useState<FuelType>("gazole");

  return (
    <section>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-zinc-500">
            Insights
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            Pricing & availability
          </h2>
        </div>
        <p className="max-w-md text-xs text-zinc-500">
          Aggregations computed across all{" "}
          {stations.length.toLocaleString("en-US")} stations. Histogram and
          regional rankings update with the selected fuel.
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <PriceHistogram
          stations={stations}
          selectedFuel={selectedFuel}
          onFuelChange={setSelectedFuel}
        />
        <CheapestRegionsBar stations={stations} selectedFuel={selectedFuel} />
        <AvgPricePerFuelBar stations={stations} />
        <FuelAvailabilityPie stations={stations} />
      </div>
    </section>
  );
}
