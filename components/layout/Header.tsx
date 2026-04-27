import Link from "next/link";
import { Container } from "@/components/ui/Container";

const navLinks = [
  { href: "/stations", label: "Stations" },
  { href: "/stations#map", label: "Map" },
  { href: "/about", label: "About" },
];

export function Header() {
  return (
    <header className="border-b border-black/[.08] dark:border-white/[.12] bg-background">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight text-lg [font-family:var(--font-montserrat)]">
          FrancePetrol.
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-zinc-600 hover:text-foreground dark:text-zinc-300 dark:hover:text-zinc-50 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </Container>
    </header>
  );
}
