import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { StationsView } from "@/components/map/StationsView";
import { getStations } from "@/lib/stations";
import { formatPrice } from "@/lib/utils";
import { FUEL_TYPES } from "@/types";

export const metadata = {
  title: "Stations",
  description:
    "Carte interactive et liste des stations-service avec prix des carburants en France.",
};

const PREVIEW_LIMIT = 50;

export default async function StationsPage() {
  const stations = await getStations();
  const preview = stations.slice(0, PREVIEW_LIMIT);

  return (
    <div className="py-12 sm:py-16">
      <Container className="mb-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-zinc-500">
              {stations.length.toLocaleString("fr-FR")} stations &middot; données{" "}
              <code className="text-xs">data.gouv.fr</code>
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
              Stations-service
            </h1>
          </div>
          <Link
            href="/api/stations"
            className="text-sm text-zinc-600 underline underline-offset-4 hover:text-foreground"
            target="_blank"
          >
            Tester l&apos;API ↗
          </Link>
        </div>
      </Container>

      <section id="carte" className="mb-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[1700px]">
          <StationsView stations={stations} />
          <p className="mt-3 text-xs text-zinc-500">
            Astuce&nbsp;: zoomez ou déplacez la carte — les KPIs à gauche se
            recalculent sur la zone visible.
          </p>
        </div>
      </section>

      <Container>
        <h2 className="mb-4 text-xl font-semibold tracking-tight">
          Aperçu ({preview.length} premières stations)
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2">
          {preview.map((station) => (
            <li
              key={station.id}
              className="rounded-2xl border border-black/[.08] bg-background p-5 dark:border-white/[.12]"
            >
              <h3 className="text-lg font-semibold">{station.name}</h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                {station.cp} {station.city}
              </p>
              <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                {FUEL_TYPES.map((f) => {
                  const price = station.prices[f.id];
                  if (price == null) return null;
                  return (
                    <div key={f.id} className="flex justify-between">
                      <dt className="text-zinc-500">{f.label}</dt>
                      <dd className="font-medium tabular-nums">
                        {formatPrice(price)}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
}
