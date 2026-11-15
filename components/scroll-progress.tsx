"use client";

import { useEffect, useRef } from "react";

/**
 * 2px marigold reading-position hairline pinned to the top viewport edge.
 * GPU-composited via scaleX so scrolling never triggers layout.
 */
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      const ratio = scrollable > 24 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
      bar.style.transform = `scaleX(${ratio.toFixed(4)})`;
      bar.style.opacity = ratio > 0.005 ? "1" : "0";
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5 overflow-hidden"
    >
      <div
        ref={barRef}
        className="h-full w-full origin-left bg-accent opacity-0 transition-opacity duration-200"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
