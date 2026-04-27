import Link from "next/link";
import { Container } from "@/components/ui/Container";

export default function HomePage() {
  return (
    <Container className="py-16 sm:py-24">
      <section className="flex flex-col gap-6 max-w-2xl">
        <span className="text-sm font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Welcome
        </span>
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight [font-family:var(--font-montserrat)]">
          FrancePetrol.
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed">
          Compare gasoline, diesel and LPG prices in real time across more than
          11,000 service stations in France.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <Link
            href="/stations"
            className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-6 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            Find a station
          </Link>
          <Link
            href="/stations#map"
            className="inline-flex h-11 items-center justify-center rounded-full border border-black/10 dark:border-white/15 px-6 text-sm font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/5"
          >
            View the map
          </Link>
        </div>
      </section>
    </Container>
  );
}
