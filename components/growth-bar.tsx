"use client";

import { useEffect, useRef, type CSSProperties } from "react";

const FROM = 1200;
const format = (value: number) => Math.round(value).toLocaleString("en-US");
/** Round down to the nearest hundred so the figure reads "62,700+" rather than a noisy exact count. */
const floorToHundred = (value: number) => Math.floor(value / 100) * 100;

type GrowthBarProps = {
  /** Visitors to date (live from Vercel Web Analytics, or the April 2026 fallback). */
  total: number;
  /** Unique visitors in the last 30 days; the line is hidden when null. */
  last30Days: number | null;
  /** Label for the second bar: the month the `total` figure is from. */
  asOf: string;
};

/**
 * Dilli Dilli's visitor growth drawn to scale: 1,200 visitors in April 2025 against the
 * figure to date. The second bar and the counter are tied to scroll position.
 * Renders the final state on the server, without JS, and with reduced motion.
 */
export function GrowthBar({ total, last30Days, asOf }: GrowthBarProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const to = floorToHundred(total);
  const startShare = (FROM / to) * 100;

  useEffect(() => {
    const root = rootRef.current;
    const count = countRef.current;
    if (!root || !count) return;
    if (!document.documentElement.classList.contains("motion-ok")) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = root.getBoundingClientRect();
      const viewport = window.innerHeight;
      const raw = (viewport * 0.92 - rect.top) / (viewport * 0.6);
      const p = Math.min(1, Math.max(0, raw));
      const eased = p * p * (3 - 2 * p);
      root.style.setProperty("--p", eased.toFixed(4));
      count.textContent = format(FROM + (to - FROM) * eased) + (eased >= 1 ? "+" : "");
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [to]);

  return (
    <div ref={rootRef} style={{ "--p": 1, "--start": startShare.toFixed(3) } as CSSProperties}>
      <p className="sr-only">
        Visitors grew from 1,200 in April 2025 to more than {format(to)} by {asOf}.
      </p>

      <div aria-hidden>
        <p className="display max-w-full text-[clamp(2.75rem,13vw,11rem)] tabular-nums tracking-tight text-heading">
          <span ref={countRef}>{format(to)}+</span>
        </p>
        <p className="mt-3 text-muted">visitors to dilli-dilli.com to date</p>

        <div className="mt-10 grid grid-cols-[5.5rem_1fr] items-center gap-x-4 gap-y-3 sm:grid-cols-[7rem_1fr]">
          <span className="text-sm text-muted">April 2025</span>
          <div className="flex items-center gap-3">
            <span className="growth-start block h-10 min-w-1 rounded-xs bg-brand sm:h-14" />
            <span className="text-sm font-semibold tabular-nums text-ink">1,200</span>
          </div>

          <span className="text-sm text-muted">{asOf}</span>
          <div>
            <span className="growth-fill block h-10 min-w-1 rounded-xs bg-accent sm:h-14" />
          </div>
        </div>
      </div>

      {last30Days !== null ? (
        <p className="mt-8 flex items-center gap-2.5 text-lg text-ink">
          <span className="live-dot" aria-hidden />
          <span>
            <strong className="font-bold tabular-nums">{format(last30Days)}</strong> visitors in the last 30 days.
          </span>
        </p>
      ) : null}
    </div>
  );
}
