"use client";

import { useEffect, useMemo } from "react";
import { motion } from "motion/react";

const DURATION = 2800;

export default function LaunchAnimation({ url }: { url: string }) {
  const reduced = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  useEffect(() => {
    const id = setTimeout(() => window.location.assign(url), reduced ? 500 : DURATION);
    return () => clearTimeout(id);
  }, [url, reduced]);

  const particles = useMemo(
    () =>
      Array.from({ length: 48 }, (_, i) => {
        const r = (n: number) => {
          const x = Math.sin(i * 12.9898 + n * 78.233) * 43758.5453;
          return x - Math.floor(x);
        };
        const angle = (i / 48) * Math.PI * 2 + r(1) * 0.3;
        const dist = 160 + r(2) * 420;
        return {
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist,
          size: 3 + r(3) * 6,
          delay: 1.1 + r(4) * 0.2,
          hue: i % 2 ? "#8b7cff" : "#36d6c3",
        };
      }),
    [],
  );

  if (reduced) {
    return (
      <motion.div className="fixed inset-0 z-50 bg-white" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} />
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#07070d]">
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        style={{ background: "radial-gradient(circle at 50% 70%, rgba(139,124,255,0.35), transparent 60%)" }}
      />

      {/* streaking stars for speed */}
      {Array.from({ length: 24 }, (_, i) => (
        <motion.span
          key={i}
          className="absolute top-0 w-px bg-white/70"
          style={{ left: `${(i * 41) % 100}%`, height: 60 + (i % 5) * 30 }}
          initial={{ y: "-20vh", opacity: 0 }}
          animate={{ y: "120vh", opacity: [0, 1, 0] }}
          transition={{ duration: 0.7, delay: 0.5 + (i % 8) * 0.07, repeat: 2, ease: "easeIn" }}
        />
      ))}

      {/* rocket */}
      <motion.div
        className="absolute left-1/2 top-full -ml-8 sm:-ml-10"
        initial={{ y: 0 }}
        animate={{ y: "-135vh" }}
        transition={{ delay: 0.3, duration: 1.5, ease: [0.5, 0, 0.9, 0.4] }}
      >
        <svg viewBox="0 0 64 120" className="h-28 w-16 sm:h-36 sm:w-20" aria-hidden>
          <defs>
            <linearGradient id="flame" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fff" />
              <stop offset="0.4" stopColor="#36d6c3" />
              <stop offset="1" stopColor="#8b7cff" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M32 78 L44 78 L32 118 L20 78 Z" fill="url(#flame)" />
          <path d="M32 4 C48 22 50 50 46 78 L18 78 C14 50 16 22 32 4 Z" fill="#ececf4" />
          <circle cx="32" cy="36" r="7" fill="#8b7cff" />
          <path d="M18 60 L4 80 L18 76 Z M46 60 L60 80 L46 76 Z" fill="#8b7cff" />
        </svg>
      </motion.div>

      {/* burst rings */}
      {[0, 0.15, 0.3].map((d, i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 top-1/2 h-40 w-40 -ml-20 -mt-20 rounded-full border-2 border-accent-2"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 14], opacity: [0.9, 0] }}
          transition={{ delay: 1.1 + d, duration: 1, ease: "easeOut" }}
        />
      ))}

      {/* particles */}
      {particles.map((p, i) => (
        <motion.span
          key={i}
          className="absolute left-1/2 top-1/2 rounded-full"
          style={{ width: p.size, height: p.size, background: p.hue, boxShadow: `0 0 12px ${p.hue}` }}
          initial={{ x: 0, y: 0, opacity: 0 }}
          animate={{ x: p.x, y: p.y, opacity: [0, 1, 0] }}
          transition={{ delay: p.delay, duration: 1.1, ease: "easeOut" }}
        />
      ))}

      <motion.div
        className="absolute inset-0 flex items-center justify-center text-3xl font-bold tracking-[0.4em] text-white sm:text-5xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1, 1.1, 1.3] }}
        transition={{ delay: 1.2, duration: 1.2, times: [0, 0.25, 0.7, 1] }}
      >
        LIFTOFF
      </motion.div>

      {/* final flash */}
      <motion.div
        className="absolute inset-0 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.1, duration: 0.6, ease: "easeIn" }}
      />
    </div>
  );
}
