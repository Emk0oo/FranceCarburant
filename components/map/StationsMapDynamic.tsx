"use client";

import dynamic from "next/dynamic";
import type { FuelType, Station } from "@/types";

const StationsMap = dynamic(() => import("./StationsMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
  ),
});

type Props = {
  stations: Station[];
  selectedFuel: FuelType;
  thresholds: number[];
};

export function StationsMapDynamic(props: Props) {
  return <StationsMap {...props} />;
}
