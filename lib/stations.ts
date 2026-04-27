import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { cache } from "react";
import type { Station } from "@/types";

type RawStation = {
  id: number | string;
  adresse?: string;
  ville?: string;
  cp?: string;
  region?: string;
  departement?: string;
  geom?: { lat?: number; lon?: number } | null;
  gazole_prix?: number | string | null;
  sp95_prix?: number | string | null;
  sp98_prix?: number | string | null;
  e10_prix?: number | string | null;
  e85_prix?: number | string | null;
  gplc_prix?: number | string | null;
};

function toNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

export const getStations = cache(async (): Promise<Station[]> => {
  const filePath = path.join(
    process.cwd(),
    "app/api/prix-des-carburants-en-france-flux-instantane-v2.json"
  );
  const raw = await fs.readFile(filePath, "utf-8");
  const data = JSON.parse(raw) as RawStation[];

  const stations: Station[] = [];
  for (const r of data) {
    const lat = r.geom?.lat;
    const lng = r.geom?.lon;
    if (typeof lat !== "number" || typeof lng !== "number") continue;
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;

    stations.push({
      id: String(r.id),
      name: r.adresse?.trim() || "Station-service",
      address: r.adresse?.trim() ?? "",
      city: r.ville?.trim() ?? "",
      cp: r.cp ?? "",
      lat,
      lng,
      region: r.region,
      departement: r.departement,
      prices: {
        sp95: toNumber(r.sp95_prix),
        sp98: toNumber(r.sp98_prix),
        e10: toNumber(r.e10_prix),
        gazole: toNumber(r.gazole_prix),
        e85: toNumber(r.e85_prix),
        gplc: toNumber(r.gplc_prix),
      },
    });
  }
  return stations;
});

export async function getStationById(id: string): Promise<Station | undefined> {
  const stations = await getStations();
  return stations.find((s) => s.id === id);
}
