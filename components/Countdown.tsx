"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import LaunchAnimation from "@/components/LaunchAnimation";
import { splitDuration, type LaunchConfig } from "@/lib/launch";

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex min-w-fit flex-auto flex-col items-center px-2 rounded-2xl border border-line bg-card py-4 backdrop-blur sm:py-8">
      <span className="font-mono text-[clamp(2rem,9vw,5.5rem)] font-semibold leading-none tabular-nums">
        {String(value).padStart(2, "0")}
      </span>
      <span className="mt-2 text-[0.65rem] uppercase tracking-widest text-muted sm:text-xs">{label}</span>
    </div>
  );
}

export default function Countdown({ config }: { config: LaunchConfig }) {
  const [now, setNow] = useState<number | null>(null);
  const [manualLaunch, setManualLaunch] = useState(false);
  const [startedLate, setStartedLate] = useState<boolean | null>(null);

  useEffect(() => {
    let first = true;
    const tick = () => {
      const n = Date.now();
      if (first) {
        first = false;
        setStartedLate(n >= config.target);
      }
      setNow(n);
    };
    const kick = setTimeout(tick, 0);
    const id = setInterval(tick, 250);
    return () => {
      clearTimeout(kick);
      clearInterval(id);
    };
  }, [config.target]);

  const done = now !== null && now >= config.target;
  const launch = useCallback(() => setManualLaunch(true), []);

  // Auto mode launches when the timer ends while watching. A link opened after the
  // target time shows the button instead, to avoid a surprise redirect.
  const launching = manualLaunch || (done && config.mode === "auto" && startedLate === false);

  const t = splitDuration(config.target - (now ?? config.target));
  const host = new URL(config.url).hostname;

  return (
    <main className="relative flex flex-1 flex-col items-center justify-center px-4 py-10 text-center sm:px-6">
      <Link href="/" className="absolute left-4 top-4 text-sm text-muted transition hover:text-foreground sm:left-6 sm:top-6">
        &larr; New launch
      </Link>

      <div className="w-full max-w-4xl">
        <p className="text-xs uppercase tracking-[0.3em] text-accent-2 sm:text-sm">
          {done ? "Ready for launch" : "Launching soon"}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">
          {config.title || host}
        </h1>
        {config.message && (
          <p className="mx-auto mt-4 max-w-xl whitespace-pre-line text-base text-muted sm:text-xl">
            {config.message}
          </p>
        )}

        <div className="mt-8 flex gap-2 sm:mt-12 sm:gap-4" aria-live="off" role="timer">
          {now === null ? (
            <div className="h-24 w-full sm:h-40" />
          ) : (
            <>
              <Unit value={t.days} label="Days" />
              <Unit value={t.hours} label="Hours" />
              <Unit value={t.minutes} label="Min" />
              <Unit value={t.seconds} label="Sec" />
            </>
          )}
        </div>

        <div className="mt-8 flex min-h-24 items-center justify-center sm:mt-12">
          <AnimatePresence>
            {done && !launching && (config.mode === "button" || startedLate) && (
              <motion.button
                key="go"
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                onClick={launch}
                className="relative rounded-full bg-gradient-to-r from-accent to-accent-2 px-10 py-4 text-lg font-bold text-black shadow-[0_0_60px_rgba(139,124,255,0.55)] sm:px-14 sm:py-5 sm:text-xl"
              >
                <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-accent/40" />
                Launch
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {launching && <LaunchAnimation url={config.url} />}
    </main>
  );
}
