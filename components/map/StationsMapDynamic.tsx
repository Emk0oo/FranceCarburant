"use client";

import dynamic from "next/dynamic";
import type { Station } from "@/types";

const StationsMap = dynamic(() => import("./StationsMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
  ),
});

export function StationsMapDynamic({ stations }: { stations: Station[] }) {
  return <StationsMap stations={stations} />;
}
