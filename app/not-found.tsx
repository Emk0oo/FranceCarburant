import Link from "next/link";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <Container className="py-24 flex flex-col items-center text-center gap-4">
      <p className="text-sm font-medium uppercase tracking-wider text-zinc-500">
        Error 404
      </p>
      <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
        Page not found
      </h1>
      <p className="text-zinc-600 dark:text-zinc-300 max-w-md">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-2 inline-flex h-11 items-center justify-center rounded-full bg-foreground px-6 text-sm font-medium text-background hover:opacity-90"
      >
        Back to home
      </Link>
    </Container>
  );
}
