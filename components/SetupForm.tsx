"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  MAX_MESSAGE,
  MAX_TITLE,
  buildQuery,
  normalizeUrl,
  type Mode,
} from "@/lib/launch";

const PRESETS = [
  { label: "1 min", ms: 60_000 },
  { label: "5 min", ms: 300_000 },
  { label: "30 min", ms: 1_800_000 },
  { label: "1 hour", ms: 3_600_000 },
  { label: "1 day", ms: 86_400_000 },
];

const field =
  "w-full rounded-xl border border-line bg-card px-4 py-3 text-base outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30 placeholder:text-muted/60";
const label = "mb-2 block text-sm font-medium text-muted";

function toLocalInput(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function SetupForm() {
  const router = useRouter();
  const [timerType, setTimerType] = useState<"duration" | "date">("duration");
  const [dur, setDur] = useState({ d: "0", h: "0", m: "5", s: "0" });
  const [date, setDate] = useState("");
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [mode, setMode] = useState<Mode>("button");
  const [error, setError] = useState("");

  const durMs = useMemo(() => {
    const n = (v: string) => Math.max(0, Number(v) || 0);
    return (
      (n(dur.d) * 86400 + n(dur.h) * 3600 + n(dur.m) * 60 + n(dur.s)) * 1000
    );
  }, [dur]);

  function applyPreset(ms: number) {
    const total = ms / 1000;
    setDur({
      d: String(Math.floor(total / 86400)),
      h: String(Math.floor((total % 86400) / 3600)),
      m: String(Math.floor((total % 3600) / 60)),
      s: String(total % 60),
    });
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const clean = normalizeUrl(url);
    if (!clean) return setError("Enter a valid website address (http or https).");

    let target: number;
    if (timerType === "duration") {
      if (durMs <= 0) return setError("Set a duration greater than zero.");
      target = Date.now() + durMs;
    } else {
      target = new Date(date).getTime();
      if (!date || Number.isNaN(target)) return setError("Pick a date and time.");
      if (target <= Date.now()) return setError("Pick a time in the future.");
    }
    setError("");
    router.push(
      `/l?${buildQuery({ target, url: clean, message: message.trim(), title: title.trim(), mode })}`,
    );
  }

  const seg = (active: boolean) =>
    `flex-1 rounded-lg px-4 py-2 text-sm font-medium transition ${
      active ? "bg-accent text-white shadow" : "text-muted hover:text-foreground"
    }`;

  return (
    <form
      onSubmit={submit}
      className="w-full max-w-2xl space-y-6 rounded-3xl border border-line bg-card p-5 backdrop-blur sm:p-8"
    >
      <div>
        <span className={label}>Timer</span>
        <div className="mb-4 flex gap-1 rounded-xl border border-line p-1">
          <button type="button" className={seg(timerType === "duration")} onClick={() => setTimerType("duration")}>
            Countdown
          </button>
          <button
            type="button"
            className={seg(timerType === "date")}
            onClick={() => {
              setTimerType("date");
              if (!date) setDate(toLocalInput(new Date(Date.now() + 3_600_000)));
            }}
          >
            Date and time
          </button>
        </div>

        {timerType === "duration" ? (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {(
                [
                  ["d", "Days"],
                  ["h", "Hours"],
                  ["m", "Minutes"],
                  ["s", "Seconds"],
                ] as const
              ).map(([k, l]) => (
                <label key={k} className="block">
                  <span className="mb-1 block text-xs text-muted">{l}</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    value={dur[k]}
                    onChange={(e) => setDur({ ...dur, [k]: e.target.value })}
                    className={field}
                  />
                </label>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => applyPreset(p.ms)}
                  className="rounded-full border border-line px-3 py-1 text-xs text-muted transition hover:border-accent hover:text-foreground"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </>
        ) : (
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={field}
          />
        )}
      </div>

      <div>
        <label className={label} htmlFor="url">Website URL</label>
        <input id="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="example.com" className={field} inputMode="url" autoCapitalize="off" autoCorrect="off" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="title">Title (optional)</label>
          <input id="title" value={title} maxLength={MAX_TITLE} onChange={(e) => setTitle(e.target.value)} placeholder="Product launch" className={field} />
        </div>
        <div className="sm:col-span-2">
          <label className={label} htmlFor="msg">Message (optional)</label>
          <textarea id="msg" value={message} maxLength={MAX_MESSAGE} rows={3} onChange={(e) => setMessage(e.target.value)} placeholder="Something big is coming..." className={`${field} resize-none`} />
        </div>
      </div>

      <div>
        <span className={label}>When the timer ends</span>
        <div className="grid gap-3 sm:grid-cols-2">
          {(
            [
              ["button", "Show launch button", "You decide when to go live."],
              ["auto", "Auto-redirect", "Launch and go straight to the site."],
            ] as const
          ).map(([v, t, d]) => (
            <button
              key={v}
              type="button"
              onClick={() => setMode(v)}
              aria-pressed={mode === v}
              className={`rounded-2xl border p-4 text-left transition ${
                mode === v ? "border-accent bg-accent/10" : "border-line hover:border-muted"
              }`}
            >
              <div className="font-medium">{t}</div>
              <div className="mt-1 text-sm text-muted">{d}</div>
            </button>
          ))}
        </div>
      </div>

      {error && <p role="alert" className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        className="w-full rounded-xl bg-gradient-to-r from-accent to-accent-2 px-6 py-4 text-base font-semibold text-black transition hover:brightness-110 active:scale-[0.99]"
      >
        Start countdown
      </button>
    </form>
  );
}
