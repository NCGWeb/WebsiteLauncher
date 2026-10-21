import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import Countdown from "@/components/Countdown";
import { parseQuery } from "@/lib/launch";

export const metadata: Metadata = { title: "Launch countdown" };

async function Launch({ searchParams }: Pick<PageProps<"/l">, "searchParams">) {
  const config = parseQuery(await searchParams);
  if (!config) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-2xl font-semibold">This launch link is invalid</h1>
        <Link href="/" className="rounded-xl bg-accent px-5 py-3 font-medium text-white">
          Create a new launch
        </Link>
      </main>
    );
  }
  return <Countdown config={config} />;
}

export default function LaunchPage({ searchParams }: PageProps<"/l">) {
  return (
    <Suspense fallback={<main className="flex-1" />}>
      <Launch searchParams={searchParams} />
    </Suspense>
  );
}
