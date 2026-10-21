export type Mode = "auto" | "button";

export type LaunchConfig = {
  target: number;
  url: string;
  message: string;
  title: string;
  mode: Mode;
};

export const MAX_MESSAGE = 280;
export const MAX_TITLE = 60;
const MAX_AHEAD = 10 * 365 * 86_400_000;

export function normalizeUrl(input: string): string | null {
  const raw = input.trim();
  if (!raw) return null;
  const withProtocol = /^[a-z][a-z0-9+.-]*:/i.test(raw) ? raw : `https://${raw}`;
  try {
    const u = new URL(withProtocol);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    if (!u.hostname.includes(".") && u.hostname !== "localhost") return null;
    return u.toString();
  } catch {
    return null;
  }
}

export function buildQuery(c: LaunchConfig): string {
  const p = new URLSearchParams();
  p.set("t", String(c.target));
  p.set("u", c.url);
  p.set("mode", c.mode);
  if (c.message) p.set("m", c.message);
  if (c.title) p.set("n", c.title);
  return p.toString();
}

type Raw = Record<string, string | string[] | undefined>;

export function parseQuery(raw: Raw): LaunchConfig | null {
  const one = (k: string) => {
    const v = raw[k];
    return Array.isArray(v) ? v[0] : v;
  };
  const target = Number(one("t"));
  const url = normalizeUrl(one("u") ?? "");
  if (!Number.isFinite(target) || target <= 0 || target > Date.now() + MAX_AHEAD || !url) return null;
  return {
    target,
    url,
    message: (one("m") ?? "").slice(0, MAX_MESSAGE),
    title: (one("n") ?? "").slice(0, MAX_TITLE),
    mode: one("mode") === "button" ? "button" : "auto",
  };
}

export function splitDuration(ms: number) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}
