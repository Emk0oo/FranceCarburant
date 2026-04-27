import { Container } from "@/components/ui/Container";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-black/[.08] dark:border-white/[.12] bg-background">
      <Container className="flex h-16 items-center justify-between text-sm text-zinc-500 dark:text-zinc-400">
        <p>© {year} France Carburant</p>
        <p>Données publiques — prix-carburants.gouv.fr</p>
      </Container>
    </footer>
  );
}
