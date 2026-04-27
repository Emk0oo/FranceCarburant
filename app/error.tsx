"use client";

import { useEffect } from "react";
import { Container } from "@/components/ui/Container";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="py-24 flex flex-col items-center text-center gap-4">
      <p className="text-sm font-medium uppercase tracking-wider text-red-600">
        Erreur
      </p>
      <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
        Une erreur est survenue
      </h1>
      <p className="text-zinc-600 dark:text-zinc-300 max-w-md">
        Désolé, quelque chose s&apos;est mal passé. Vous pouvez réessayer.
      </p>
      <button
        onClick={reset}
        className="mt-2 inline-flex h-11 items-center justify-center rounded-full bg-foreground px-6 text-sm font-medium text-background hover:opacity-90"
      >
        Réessayer
      </button>
    </Container>
  );
}
