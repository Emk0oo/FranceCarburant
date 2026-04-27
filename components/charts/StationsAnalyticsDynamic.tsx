"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { Station } from "@/types";

const StationsAnalytics = dynamic(() => import("./StationsAnalytics"), {
  ssr: false,
  loading: () => <Placeholder />,
});

type Props = {
  stations: Station[];
};

export function StationsAnalyticsDynamic({ stations }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || visible) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { rootMargin: "200px 0px" }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [visible]);

  return (
    <div ref={ref}>
      {visible ? <StationsAnalytics stations={stations} /> : <Placeholder />}
    </div>
  );
}

function Placeholder() {
  return (
    <div className="h-[800px] w-full animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
  );
}
