"use client";

import { useEffect, useRef, type CSSProperties } from "react";

const FROM = 1200;
const format = (value: number) => Math.round(value).toLocaleString("en-US");
/** Round down to the nearest hundred only when falling back to the April 2026 floor ("62,700+"). */
const floorToHundred = (value: number) => Math.floor(value / 100) * 100;

type GrowthBarProps = {
  /** Visitors to date (live from Vercel Web Analytics, or the April 2026 fallback). */
  total: number;
  /** Unique visitors in the last 30 days; the line is hidden when null. */
  last30Days: number | null;
  /** Label for the second bar ("Today" when live, or "April 2026" on fallback). */
  asOf: string;
  /** True when `total` came from Vercel Web Analytics rather than the recorded floor. */
  live: boolean;
};

/**
 * Dilli Dilli's visitor growth drawn to scale: 1,200 visitors in April 2025 against the
 * live figure to date. Both the marigold bar and the visitor counter glide with spring-damped
 * scroll progress; the 30-day live line counts up on its own when scrolled into view.
 * Renders the final state on the server, without JS, and with reduced motion.
 */
export function GrowthBar({ total, last30Days, asOf, live }: GrowthBarProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const barEndCountRef = useRef<HTMLSpanElement>(null);
  const recentLineRef = useRef<HTMLParagraphElement>(null);
  const recentCountRef = useRef<HTMLElement>(null);

  const targetTotal = live ? Math.round(total) : floorToHundred(total);
  const suffix = live ? "" : "+";
  const startShare = (FROM / targetTotal) * 100;

  useEffect(() => {
    const root = rootRef.current;
    const count = countRef.current;
    if (!root || !count) return;
    if (!document.documentElement.classList.contains("motion-ok")) return;

    let frame = 0;
    let current = -1;
    let target = 1;

    const computeTarget = () => {
      const rect = root.getBoundingClientRect();
      const viewport = window.innerHeight;
      const raw = (viewport * 0.92 - rect.top) / (viewport * 0.62);
      const p = Math.min(1, Math.max(0, raw));
      return p * p * (3 - 2 * p);
    };

    const apply = (value: number) => {
      root.style.setProperty("--p", value.toFixed(4));
      if (value >= 0.985) {
        root.dataset.full = "";
      } else {
        delete root.dataset.full;
      }
      const currentVisitors = FROM + (targetTotal - FROM) * value;
      const formatted = format(currentVisitors) + (value >= 0.995 ? suffix : "");
      count.textContent = formatted;
      if (barEndCountRef.current) {
        barEndCountRef.current.textContent = formatted;
      }
    };

    const step = () => {
      const diff = target - current;
      if (Math.abs(diff) < 0.0015) {
        current = target;
        apply(current);
        frame = 0;
        return;
      }
      current += diff * 0.16;
      apply(current);
      frame = requestAnimationFrame(step);
    };

    const onScroll = () => {
      target = computeTarget();
      if (!frame) frame = requestAnimationFrame(step);
    };

    target = computeTarget();
    current = target;
    apply(current);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [targetTotal, suffix]);

  useEffect(() => {
    if (last30Days === null) return;
    const line = recentLineRef.current;
    const numEl = recentCountRef.current;
    if (!line || !numEl) return;
    if (!document.documentElement.classList.contains("motion-ok")) return;
    if (!("IntersectionObserver" in window)) return;

    let raf = 0;
    const animateCount = () => {
      const duration = 900;
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        numEl.textContent = format(last30Days * eased);
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          line.dataset.in = "";
          animateCount();
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -5% 0px", threshold: 0 }
    );
    observer.observe(line);
    return () => {
      observer.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [last30Days]);

  const finalFormatted = `${format(targetTotal)}${suffix}`;

  return (
    <div
      ref={rootRef}
      className="growth-root"
      data-full=""
      style={{ "--p": 1, "--start": startShare.toFixed(3) } as CSSProperties}
    >
      <p className="sr-only">
        {live
          ? `Visitors grew from 1,200 in April 2025 to ${finalFormatted} to date.`
          : `Visitors grew from 1,200 in April 2025 to more than ${format(targetTotal)} by ${asOf}.`}
      </p>

      <div aria-hidden>
        <p className="display max-w-full text-[clamp(2.75rem,13vw,11rem)] tabular-nums tracking-tight text-heading">
          <span ref={countRef}>{finalFormatted}</span>
        </p>
        <p className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-muted">
          <span>visitors to dilli-dilli.com to date</span>
          {live ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 py-0.5 text-xs font-semibold text-ink">
              <span className="live-dot" />
              Live via Vercel Analytics
            </span>
          ) : null}
        </p>

        <div className="mt-10 grid grid-cols-[5.5rem_minmax(0,1fr)] items-center gap-x-4 gap-y-3 sm:grid-cols-[7rem_minmax(0,1fr)]">
          <span className="text-sm text-muted">April 2025</span>
          <div className="flex min-w-0 items-center gap-3">
            <span className="growth-start block h-10 min-w-1 shrink-0 rounded-xs bg-brand sm:h-14" />
            <span className="text-sm font-semibold tabular-nums text-ink">1,200</span>
          </div>

          <span className="inline-flex items-center gap-2 text-sm font-medium text-ink">
            {live ? <span className="live-dot" /> : null}
            <span className={live ? "font-semibold text-ink" : "text-muted"}>{asOf}</span>
          </span>
          <div className="flex min-w-0 items-center gap-3">
            <div className="min-w-0 flex-1">
              <span className="growth-fill relative block h-10 min-w-1 overflow-hidden rounded-xs bg-accent sm:h-14" />
            </div>
            <span
              ref={barEndCountRef}
              className="growth-end-label shrink-0 text-sm font-semibold tabular-nums text-ink"
            >
              {finalFormatted}
            </span>
          </div>
        </div>
      </div>

      {last30Days !== null ? (
        <p
          ref={recentLineRef}
          data-reveal="up"
          className="mt-8 flex items-center gap-2.5 text-lg text-ink"
        >
          <span className="live-dot" aria-hidden />
          <span>
            <strong ref={recentCountRef} className="font-bold tabular-nums">
              {format(last30Days)}
            </strong>{" "}
            visitors in the last 30 days.
          </span>
        </p>
      ) : null}
    </div>
  );
}
