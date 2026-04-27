"use client";

import dynamic from "next/dynamic";
import type { Station } from "@/types";

const StationsAnalytics = dynamic(() => import("./StationsAnalytics"), {
  ssr: false,
  loading: () => (
    <div className="h-[800px] w-full animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
  ),
});

type Props = {
  stations: Station[];
};

export function StationsAnalyticsDynamic(props: Props) {
  return <StationsAnalytics {...props} />;
}
