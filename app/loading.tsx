import { Container } from "@/components/ui/Container";

export default function Loading() {
  return (
    <Container className="py-16 animate-pulse">
      <div className="flex flex-col gap-4 max-w-2xl">
        <div className="h-4 w-24 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-12 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-4 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-4 w-5/6 rounded bg-zinc-200 dark:bg-zinc-800" />
      </div>
    </Container>
  );
}
